import suffixes from './suffixes.json';
import prefixes from './prefixes.json';
import heroes from './heroes.json';
import skills from './skills.json';
import Log from './log';
import { orderBy } from 'lodash';

export default class Card {
  constructor(quality) {
    this.id = '';
    this.prefixe = '';
    this.suffixe = '';
    this.pic = '';
    this.family = '';
    this.country = '';
    this.img = '';
    this.open = '';
    this.attack_type = '';
    this.name ='';
    this.border = '';
    this.background ='';
    this.quality = quality;
    this.attack = 0;
    this.health= 0;
    this.carry= 0;
    this.speed= 0;

    this.active_skill={};
    this.passive_kill ={};

    this.res_physical= 0;
    this.res_weapon= 0;
    this.res_fire= 0;
    this.res_chemical= 0;
    this.log = new Log();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) +1;
  }
  
  getRandomArray(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getRandomIntMinMax(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getFamily() {
    var rnd = 0
    rnd = this.getRandomInt(1000)
    if (rnd > 800) {
        return 'cartel'
    }
    if (rnd > 400) {
        return 'mafia'
    }
    else {
        return 'gang'
    }
  }

  getAttackType() {
    var rnd = 0
    rnd = this.getRandomInt(1000)
    if (rnd > 800) {
        return 'chemical'
    }
    if (rnd > 600) {
        return 'fire'
    }
    if (rnd > 400) {
      return 'weapon'
    }
    else {
      return 'physical'
    }
  }


  generate(quality) {
    this.quality = quality;
    this.family = this.getFamily()
    const hero = heroes[this.family][this.getRandomArray(heroes[this.family].length)]
    this.name = hero.name;
    this.country = hero.country;
    // this.pic = this.getRandomInt(7);
    this.pic = hero.id;
    this.img ='./cards/1.png';
    this.open = false;
    this.id = this.createUniqueId();
    this.background = this.getRandomInt(4);
    this.attack_type = this.getAttackType()
    this.prefixe = this.setPrefixes(this.quality);
    this.suffixe = this.setSuffixe(this.quality,this.attack_type);
    this.attack = this.getRandomIntMinMax(5000,8000+(3000*this.quality))
    this.health= this.getRandomIntMinMax(5000,+(2000*this.quality))
    this.carry= this.getRandomIntMinMax(1000,+(1000*this.quality))
    this.speed= this.getRandomIntMinMax(10-this.quality,20)
    this.active_skill = skills[this.family]['active'][this.attack_type][this.getRandomArray(skills[this.family]['active'][this.attack_type].length)]
    this.passive_skill = skills[this.family]['passive'][this.getRandomArray(skills[this.family]['passive'].length)]

    this.res_physical= this.getRandomInt(20)
    this.res_weapon= this.getRandomInt(20)
    this.res_fire= this.getRandomInt(20)
    this.res_chemical= this.getRandomInt(20)
    return this;
  }

  createUniqueId() {
    const id = new Date().valueOf()+ this.getRandomInt(222550);
    return id
  }

  setPrefixes(quality) {
    let prefixe;
    switch (quality) {
        case 1:
            prefixe = prefixes.mythical[Math.floor(Math.random() * prefixes.mythical.length)]
            break;
        case 2:
            prefixe = prefixes.legendary[Math.floor(Math.random() * prefixes.legendary.length)]
            break;
        case 3:
            prefixe = prefixes.epic[Math.floor(Math.random() * prefixes.epic.length)]
            break;
        case 4:
            prefixe =  prefixes.rare[Math.floor(Math.random() * prefixes.rare.length)]
            break;
        case 5:
            prefixe = prefixes.common[Math.floor(Math.random() * prefixes.common.length)]
        break;
        default:
            prefixe = ''
    }
    return prefixe
  };

  setSuffixe(quality,type) {
    return  suffixes[type][quality][Math.floor(Math.random() * suffixes[type][quality].length)]
  };

  getLog() {
    return this.log.log;
  }
}
