import Card from './card';

export default class CardPack {
  constructor(amount,seed) {
    this.cards = [];
    let all = 3;
    for (let i = 0; i < amount; i += 1) {
        const gen = new Card;
        let card = gen.generate(this.setItemQuality(seed.substring(all-3,all)),seed.substring(all-3,all))
        this.cards.push(card);
        all+=3;
    }
  }

  
  setItemQuality(seed) {
    if (seed > 990) {
        return 1
    }
    if (seed > 950) {
        return 2
    }
    if (seed > 870) {
        return 3
    }
    if (seed > 710) {
        return 4
    }
    else {
        return 5
    }
  }

}