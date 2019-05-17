import suffixes from './suffixes.json';
import prefixes from './prefixes.json';
import heroes from './heroes.json';
import skills from './skills.json';
import Log from './log';
import { orderBy } from 'lodash';

export default class Generator {
  constructor(id) {
    this.id = id;
    this.prefixe = '';
    this.suffixe = '';
    this.pic = '';
    this.attack_type = '';
    this.name ='';
    this.border = '';
    this.background ='';
    this.family = '';
    this.country = '';
    this.quality = 0;
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


  generate() {
    this.family = this.getFamily()
    const hero = heroes[this.family][this.getRandomArray(heroes[this.family].length)]
    this.name = hero.name;
    this.country = hero.country;
    this.pic = hero.id;
    this.border = this.getRandomInt(this.quality);
    this.background = this.getRandomInt(4);
    this.quality = this.setItemQuality();
    this.prefixe = this.setPrefixes(this.quality);
    this.suffixe = this.setSuffixe(this.quality);
    this.attack_type = this.getAttackType()
    this.attack = this.getRandomInt(20000)
    this.health= this.getRandomInt(20000)
    this.carry= this.getRandomInt(10000)
    this.speed= this.getRandomInt(20)

    this.active_skill = skills[this.family]['active'][this.attack_type][this.getRandomArray(skills[this.family]['active'][this.attack_type].length)]
    this.passive_skill = skills[this.family]['passive'][this.getRandomArray(skills[this.family]['passive'].length)]

    this.res_physical= this.getRandomInt(20)
    this.res_weapon= this.getRandomInt(20)
    this.res_fire= this.getRandomInt(20)
    this.res_chemical= this.getRandomInt(20)
    return this;
  }

  createUniqueId() {
    var id = new Date().valueOf();
    return id
  }

  setItemQuality() {
    var rnd = 0
    rnd = this.getRandomInt(1000)
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
            prefixe = ''
            break;
        case 5:
            prefixe = prefixes.common[Math.floor(Math.random() * prefixes.common.length)]
        break;
        default:
            prefixe = ''
    }
    return prefixe
  };

  setSuffixe(quality) {
    let suffixe;
    switch (quality) {
        case 1:
            suffixe = suffixes.mythical[Math.floor(Math.random() * suffixes.mythical.length)]
            break;
        case 2:
            suffixe = suffixes.legendary[Math.floor(Math.random() * suffixes.legendary.length)]
            break;
        case 3:
            suffixe = suffixes.epic[Math.floor(Math.random() * suffixes.epic.length)]
            break;
        case 4:
            suffixe = suffixes.rare[Math.floor(Math.random() * suffixes.rare.length)]
            break;
        case 5:
            suffixe = suffixes.common[Math.floor(Math.random() * suffixes.common.length)]
        break;
        default:
            suffixe = ''
    }
    return suffixe
  };

  getLog() {
    return this.log.log;
  }
}
