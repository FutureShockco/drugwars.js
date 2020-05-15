import dunits from './units.json';

export default class Unit {
  constructor(key, i, name, log) {
    this.key = key;
    this.name = name;
    this.i = i;
    this.attack = dunits[key].attack;
    this.defense = dunits[key].defense;
    this.spec = dunits[key];
    this.health = dunits[key].health;
    this.max_health = dunits[key].health;
    this.dead = false;
    this.priority = dunits[key].priority;
    this.log = log;
    this.skill = dunits[key].skill;
    this.skill_type = dunits[key].skill.type;
    this.use = dunits[key].use;
    this.type = dunits[key].type;
  }

  takeDamages(damage,sender_skill,round,name,num) {
    let damages = 5;
    if((damage - this.defense)>0)
    damages  = damage - (this.defense);
    let current ='';
    if(this.name === 'attacker')
    current = "D";
    else current = "A";
    let currentlog = `[${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) with <span style="color:green">${parseFloat(this.health).toFixed(0)}</span> HP and ${this.defense} DEF take <span style="color:red">${damages} DMG</span> from [${current}] ${name} (${num}) with <span style="color:blueviolet"> "${sender_skill}"</span>.`

    if(this.type === 'Melee' && sender_skill === 'accuratehit' && this.type !=='tastynasty')
    {
      currentlog +=` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) took <span style="color:red"> ${damages/10}  DMG</span> bonus.`
      this.health = this.health - damages/10;
    }

    if(this.type === 'Range' && sender_skill === 'accurateprecision')
    {
      currentlog +=` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) took <span style="color:red"> ${damages/10}  DMG</span> bonus.`
      this.health = this.health - damages/10;
    }

    if (this.skill.type === 'shield' && this.use > 0) {
      currentlog += ` [${this.name.substring(0, 1).toUpperCase()}] ${this.key} (${
        this.i
      }) used his (${this.use}) shield.`;
      this.use -= 1;
      this.health = this.health + this.skill.effect;
    } 

    if(this.skill.type === 'bulletproof' && this.health < damages && this.use > 0){
      currentlog += `[${this.name.substring(0, 1).toUpperCase()}] ${this.key} (${this.i}) used his (${this.use}) bulletproof.`
      this.use -= 1;
      this.health = 250;
    }
    else if(this.skill.type === 'dodge' && this.use > 0 && damages > this.health)
    {
      this.use -= 1;
      currentlog +=` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i})<span style="color:blueviolet"> dodged</span> ${damages} DMG.`;
    } 
    else if (this.health > 0 && this.health > damages) {
      this.health =  this.health - damages
      currentlog += ` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) got now <span style="color:green">${parseFloat(this.health).toFixed(0)}</span> HP.`
    } 
    else {
      currentlog+= ` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) is <span style="color:darkorange">now dead.</span>`;
      this.kill();
    }
    this.log.add(currentlog);
  }

  takeBuff(points,sender_skill,round,name,num) {
  if(this.health < this.max_health && sender_skill === 'heal' || this.health < this.max_health && sender_skill === 'groupheal')
    {
      this.log.add(
        ` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) with <span style="color:green">${parseFloat(this.health).toFixed(0)}</span> HP and ${this.defense} DEF take ${sender_skill} <span style="color:chartreuse">+${points} HP</span> from [${this.name.substring(0,1).toUpperCase()}] ${name} (${num}).`,
      );
      this.health = this.health + points;
      if(this.health > this.max_health)
      this.health = this.max_health
    }
  }

  kill() {
    this.health = 0;
    this.dead = true;
  }
}
