import units from './units.json';

export default class Unit {
  constructor(key, i, name, skill, log) {
    this.key = key;
    this.name = name;
    this.i = i;
    this.attack = units[key].attack;
    this.defense = units[key].defense;
    this.spec = units[key];
    this.health = units[key].health;
    this.max_health = units[key].health;
    this.dead = false;
    this.priority = units[key].priority;
    this.log = log;
    this.use = skill.use
    this.skill = skill;
    this.type = units[key].type;
  }

  takeDamages(damages,skill_type,round,name,num) {
    damages = damages - (this.defense)
    let current =''
    if(this.name === 'attacker')
    current = "D"
    else current = "A"
    let currentlog = `[${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) with ${parseFloat(this.health).toFixed(2)} HP take <span style="color:red">${parseFloat(damages).toFixed(2)} DMG</span> from [${current}] ${name} (${num}) with <span style="color:blueviolet"> "${skill_type}"</span>.`

    if(this.type === 'Melee' && skill_type === 'accuratehit' && this.type != 'tastynasty')
    {
      currentlog +=` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) took <span style="color:red"> ${parseFloat(damages/10).toFixed(2)}  DMG</span> bonus.`
      this.health = this.health - damages/10;
    }

    if (this.skill.type === 'shield' && this.use > 0) {
      currentlog += ` [${this.name.substring(0, 1).toUpperCase()}] ${this.key} (${
        this.i
      }) used his (${this.use}) shield.`;
      this.use = this.use - 1;
      this.health = this.health + this.skill.effect;
    } 


    if(this.skill.type === 'bulletproof' && this.health < damages && this.use > 0){
      currentlog += `[${this.name}] ${this.key} (${this.i}) used his (${this.use}) bulletproof`
      this.use = this.use-1;
      this.health = 25;
    }
    else if(this.skill.type === 'dodge' && this.use > 0 && damages > this.health)
    {
      this.use = this.use-1;
      currentlog +=` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i})<span style="color:blueviolet"> dodged</span> ${damages} DMG.`;
    } 
    else if (this.health > 0 && this.health > damages) {
      this.health =  this.health - damages
      currentlog += ` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) got now ${parseFloat(this.health).toFixed(2)} HP.`
    } 
    else {
      currentlog+= ` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) is <span style="color:darkorange">now dead.</span>`;
      this.kill();
    }
    this.log.add(currentlog);
  }

  takeBuff(points,skill_type,round,name,num) {
  if(this.health < this.max_health && skill_type === 'heal' || this.health < this.max_health && skill_type === 'groupheal')
    {
      this.log.add(
        ` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) with ${parseFloat(this.health).toFixed(2)} HP take ${skill_type} <span style="color:chartreuse">+${points} HP</span> from [${this.name.substring(0,1).toUpperCase()}] ${name} (${num}).`,
      );
      this.health = this.health + points;
      if(this.health > this.max_health)
      this.health = this.max_health
      this.dead = false;
    }
  }

  kill() {
    this.health = 0;
    this.dead = true;
  }
}
