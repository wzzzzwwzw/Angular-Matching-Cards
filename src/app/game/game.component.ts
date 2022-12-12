import {Component, OnDestroy, OnInit} from '@angular/core';
import {Card} from "../shared/models/card";
import {MatDialog} from "@angular/material/dialog";
import {PersistenceService} from "../shared/services/persistence.service";
import {ApiService} from "../shared/services/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Game} from "../shared/models/game";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {

  currentTime = parseInt(<string>localStorage.getItem("timer"));
  numSelectedCards = parseInt(<string>localStorage.getItem("numImages"));

  backCard = "./assets/img2/reverso.jpg";
  playingCards: Array<Card> = Card.shuffleCards();
  selectedCards: Array<Card> = [];
  winnerCards: Array<Card> = [];

  userScore: number = 0;
  intervals: number[] = [];
  isLogged: boolean = false;
  blocked: boolean = false;
  endGame: boolean = false;
  savedRecord: boolean = false;
  disabled: boolean = false;

  constructor(
    public dialog: MatDialog,
    private persistence: PersistenceService,
    private api: ApiService,
    private _snackBar: MatSnackBar
  ) {
    this.isLogged = this.persistence.isLogged;
    this.persistence.loggedChange.subscribe((value) => {
      this.isLogged = value;
    })
  }

  ngOnInit(): void {
    this.playTimer();
  }

  ngOnDestroy(): void {
    this.clearIntervals();
  }

  flip(card: Card) {
    card.flipped = !card.flipped;
    this.selectedCards.push(card);

    if (this.selectedCards.length == 2) {
      this.blocked = true;
      window.setTimeout(() => {
        this.checkCards();
        this.blocked = false
      }, 700);
    }
  }

  checkCards() {
    let firstCard = this.selectedCards[0];
    let secondCard = this.selectedCards[1];

    if (firstCard.img == secondCard.img) {
      /* Sum points and add */
      this.correctMatch();
      this.winnerCards.push(firstCard);
      this.winnerCards.push(secondCard);

    } else {
      /* Reverse Card */
      this.wrongMatch();
      for (let card in this.selectedCards) {
        this.selectedCards[card].flipped = !this.selectedCards[card].flipped;
      }

    }
    if (this.hasWon() && this.isLogged) {
      this.savedRecord = true;

    }
    //Empty Selected Cards
    this.selectedCards = [];

  }

  correctMatch() {
    this.userScore = this.userScore + 15;
  }

  wrongMatch() {
    this.userScore = this.userScore - 5;
  }

  hasWon(): boolean {
    let res: boolean = false;
    if (this.numSelectedCards != null) {
      let gameCards = this.numSelectedCards;
      if (this.winnerCards.length == gameCards) {
        this.clearIntervals();
        let title = "!YOU WON!";
        let message = "GOOD JOB ! You Matched All the Cards.";
        this.openDialog(title, message);
        this.endGame = true;
        res = true;
      }
    }
    return res;
  }

  openDialog(title: string, message: string) {
    this.dialog.open(DialogComponent, {data: {title: title, msg: message}});
  }

  playTimer() {
    this.clearIntervals();
    if (this.currentTime == 0) return;
    else {
      let timeInterval = setInterval(() => {
        this.currentTime--;
        if (this.currentTime == 0) {
          clearInterval(timeInterval);
          this.failedGame();
        }
        if (this.hasWon()) {
          clearInterval(timeInterval);
        }
      }, 1000);
      // @ts-ignore
      this.intervals.push(timeInterval);
    }
  }

  clearIntervals() {
    for (let i = 0; i < this.intervals.length; i++) {
      clearInterval((this.intervals)[i]);
      this.intervals.splice(i, 1);
    }
  }

  failedGame() {
    this.endGame = true;
    let title = "You Lost!";
    let message = "Timeout!!";
    this.openDialog(title, message);
  }

  async saveGame() {
    let game = new Game(this.playingCards, this.winnerCards, this.userScore, this.currentTime)
    let saveSuccess = await this.api.saveGame(game);
    if (saveSuccess) {
      this._snackBar.open('Saved', 'Close', {
        duration: 1000
      });
    }
  }

  async loadGame() {
    let game = await this.api.loadGame();

    if (game !== null) {
      this.playingCards = game.playingCards;
      this.winnerCards = game.winnerCards;
      this.userScore = game.score;
      this.currentTime = game.timeLeft;
      this.numSelectedCards = game.playingCards.length;

      this._snackBar.open('Loaded', 'Close', {
        duration: 1000
      });
    }
  }

  async saveRecord() {
    this.disabled = true;
    let time = parseInt(<string>localStorage.getItem("timer"));
    let record = await this.api.postRecord(this.userScore, this.numSelectedCards, time);
    if (record) {
      this._snackBar.open('Match Recorded', 'Close', {
        duration: 1000
      });
    }

  }

  newGame() {
    this.endGame = false;
    this.currentTime = parseInt(<string>localStorage.getItem("timer"));
    this.numSelectedCards = parseInt(<string>localStorage.getItem("numImages"));
    this.playingCards = Card.shuffleCards();
    this.winnerCards = [];
    this.userScore = 0;
    this.disabled = false;

    this.playTimer();
  }
}

