import suffixes from './suffixes.json';
import prefixes from './prefixes.json';
import heroes from './heroes.json';
import activeskills from './actives.json';
import Log from './log';

export default class Card {
  constructor(quality,seed) {
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
    this.flag='';
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

  getFamily(seed) {
    var rnd = 0
    rnd = parseInt(seed.toString().substring(0,2)*10);
    if (rnd > 999) {
      return 'cops'
    }
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

  getAttackType(seed) {
    var rnd = 0
    rnd = parseInt(seed.toString().substring(1,3)*10);
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

  generate(quality,seed) {
    this.quality = quality;
    this.family = this.getFamily(seed);
    let hero = heroes[this.family][seed];
    let passage = 1;
    while (hero === undefined) {
      hero = heroes[this.family][(Math.round(seed/10))-passage];
      passage++;
    }
    this.name = hero.name;
    this.country = hero.country;
    this.flag = hero.flag;
    this.pic = hero.id;
    this.img ='./cards/1.png';
    this.open = false;
    this.id = this.createUniqueId();
    this.background = this.getRandomInt(4);
    this.attack_type = this.getAttackType(seed)
    this.prefixe = this.setPrefixes(this.quality,this.family);
    this.suffixe = this.setSuffixe(this.quality,this.attack_type);
    this.attack = this.getRandomIntMinMax(5000,8000+(3000*this.quality))
    this.health= this.getRandomIntMinMax(5000,+(2000*this.quality))
    this.carry= this.getRandomIntMinMax(1000,+(1000*this.quality))
    this.speed= this.getRandomIntMinMax(10-this.quality,20)
    this.active_skill = activeskills[this.family]['active'][this.attack_type][this.getRandomArray(activeskills[this.family]['active'][this.attack_type].length)]
    this.passive_skill = activeskills[this.family]['passive'][this.getRandomArray(activeskills[this.family]['passive'].length)]

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

  setPrefixes(quality,family) {
    return  prefixes[family][quality][this.getRandomArray(prefixes[family][quality].length)]
  };

  setSuffixe(quality,type) {
    return  suffixes[type][quality][this.getRandomArray(suffixes[type][quality].length)]
  };

  getLog() {
    return this.log.log;
  }
}
