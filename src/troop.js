import units from './units.json';

export default class Troop {
  constructor(key, amount,i, name, log) {
    this.key = key;
    this.name = name;
    this.i = i;
    this.spec = units[key];
    this.attack = units[key].attack;
    this.defense = units[key].defense;
    this.amount = amount;
    this.health = units[key].health;
    this.grouhealth = units[key].health*amount;
    this.max_health = units[key].health;
    this.dead = 0;
    this.undead = amount;
    this.priority = units[key].priority;
    this.log = log;
    this.skill = units[key].skill;
    this.use = units[key].use;
    this.type = units[key].type
    }

  getAttack() {
    return this.undead > 0 ? this.attack * this.undead : 0;
  }

  takeGroupDamages(damage,skill_type,round,name,num) {
    let damages = damage - (this.defense);
    let current =''
    if(this.name === 'attacker')
    current = "D"
    else 
    current = "A"
    this.grouhealth = this.grouhealth- damages
    let healthAfterDamage = this.grouhealth ;
    let currentlog = `[${this.name.substring(0,1).toUpperCase()}] group (${this.i})  with ${this.undead} x ${this.key} with ${this.grouhealth} HP take <span style="color:red">${damages} DMG</span> from [${current}] ${name} (${num}) with <span style="color:blueviolet"> "${skill_type}"</span>.`
    if (healthAfterDamage <= 0) {
      currentlog+= ` [${this.name.substring(0,1).toUpperCase()}] group (${this.i}) ${this.undead} x ${this.key} are <span style="color:darkorange">now dead.</span>`;
      this.dead = this.amount;
      this.undead = 0;
    } else {
      const undead = Math.ceil(healthAfterDamage / this.health);
      if (undead !== this.undead) {
        currentlog+= ` [${this.name.substring(0,1).toUpperCase()}] ${undead} x ${this.key} group (${this.i}) are left.`;

        this.dead += this.undead - undead;
        this.undead = undead;
      }
    }
    this.log.add(
      currentlog
    );
  }

  takeGroupBuff(points,skill_type,round,name,num) {
    if(this.health < this.max_health && skill_type === 'heal' || this.health < this.max_health && skill_type === 'groupheal')
      {
        this.log.add(
          ` [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) with ${this.health} HP take ${skill_type} <span style="color:chartreuse">+${points} HP</span> from [${this.name.substring(0,1).toUpperCase()}] ${name} (${num}).`,
        );
        this.health = this.health + points;
        if(this.health > this.max_health)
        this.health = this.max_health
        this.dead = false;
      }
    }
}
