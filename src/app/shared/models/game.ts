import {Card} from "./card";

export interface GameInterface {
  playingCards: Card[],
  winnerCards: Card[],
  timeLeft: number,
  score: number
}

export class Game implements GameInterface {
  playingCards: Card[];
  winnerCards: Card[];
  score: number;
  timeLeft: number;

  constructor(playingCards: Card[], winnerCards: Card[], score: number, timeLeft: number) {
    this.playingCards = playingCards;
    this.winnerCards = winnerCards;
    this.score = score;
    this.timeLeft = timeLeft;
  }


}
