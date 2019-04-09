import units from './units.json';

export default class Unit {
  constructor(key, i, name, log) {
    this.key = key;
    this.name = name;
    this.i = i;
    this.spec = units[key];
    this.health = units[key].defense;
    this.dead = false;
    this.priority = units[key].priority;
    this.skills = units[key].skills[0] || { type: 'attack' };
    this.log = log;
  }

  takeDamages(damages,from,round) {
    this.log.add(
      `[${this.name}] ${this.key} (${this.i} ${this.skills.type,this.skills.use}) take damages from ${from} dmg -${damages} / ${this.health}`,
    );
    if(this.skills && this.skills && this.skills.type === 'bulletproof' && this.health < damages && this.skills.use > 0){
      this.log.add(
        `[${this.name}] ${this.key} (${this.i}) used his bullet proof`,
      );
      this.skills.use = 0;
      this.health = 25;
    }
    else if (this.skills && this.skills && this.skills.type === 'shield' && this.skills.use > 0 && damages >0) {
      this.log.add(
        `[${this.name}] ${this.key} (${this.i}) used his shield`,
      );
      this.skills.use = 0;
      this.health = this.health + this.skills.effect - damages;
    } 
    else if (this.health > 0 && this.health > damages) {
      this.health = this.health - damages;
    } 
    else {
      this.kill();
    }
  }

  takeBuff(points,type,round) {
    if(this.health < this.maxhealth && type === 'heal' || this.health < this.maxhealth && type === 'groupheal')
    {
      this.log.add(
        `[${this.name}] ${this.key} (${this.i}) take buff ${type} +${points}`,
      );
      this.health += points;
      this.dead = false;
    }
  }

  kill() {
    this.log.add(`[${this.name}] ${this.key} (${this.i}) is dead`);
    this.health = 0;
    this.dead = true;
  }
}
