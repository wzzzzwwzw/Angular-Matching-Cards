import {card, CardInterface} from "./card.interface";


export class Card implements CardInterface {
  id: number;
  img: string;
  flipped: boolean;

  constructor(id: number, img: string, flipped: boolean,) {
    this.flipped = flipped;
    this.id = id;
    this.img = img;
  }

  static getPairedCards(): Array<Card> {
    let numCards = parseInt(<string>localStorage.getItem("numImages"));
    let res: Array<Card> = [];

    for (let i = 0; i < numCards / 2; i++) {
      let cardOne = new Card(Math.round(Math.random() * 100), card[i % 8].img, false);
      let cardTwo = new Card(Math.round(Math.random() * 100), card[i % 8].img, false);
      res.push(cardOne);
      res.push(cardTwo);
    }

    return res;
  }

  static shuffleCards(): Array<Card> {
    let array = this.getPairedCards();
    //Generate random ID for each card
    for (let i = 0; i < array.length; i++) {
      array[i].id = Math.round(Math.random() * 1000);
    }

    //Get playingCards in random positions
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }


}






