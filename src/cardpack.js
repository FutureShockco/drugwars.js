import Card from './card';

export default class CardPack {
  constructor(amount) {
    this.cards = [];
    for (let i = 0; i < amount; i += 1) {
        const gen = new Card;
        let card = gen.generate(this.setItemQuality())
        this.cards.push(card);
    }
  }

  
  setItemQuality() {
    var rnd = 0
    rnd = Math.floor(Math.random() * Math.floor(1000))
    if (rnd > 990) {
        return 1
    }
    if (rnd > 950) {
        return 2
    }
    if (rnd > 870) {
        return 3
    }
    if (rnd > 710) {
        return 4
    }
    else {
        return 5
    }
  }

}