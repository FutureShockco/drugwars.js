const debug = require('debug')('troop');
const unitsJson = require('../units.json');

class Troop {
  constructor(key, amount, name) {
    this.key = key;
    this.amount = amount;
    this.name = name;
    this.spec = unitsJson[key];
    this.attack = unitsJson[key].attack;
    this.defense = unitsJson[key].defense;
    this.priority = unitsJson[key].priority;

    this.dead = 0;
    this.undead = amount;
  }

  getAttack() {
    return this.undead > 0 ? this.attack * this.undead : 0;
  }

  takeDamages(damages) {
    const health = this.undead * this.defense;
    const healthAfterDamage = health - damages;

    debug(`${this.name} ${this.key} ${this.undead} -${damages}/${health}`);

    if (healthAfterDamage <= 0) {
      debug(`${this.name} ${this.key} ${this.undead} dead`);

      this.dead = this.amount;
      this.undead = 0;
    } else {
      const undead = parseFloat(healthAfterDamage / this.defense).toFixed(0);
      if (undead !== this.undead) {
        debug(`${this.name} ${this.key} ${this.undead - undead} dead`);
        this.dead += this.undead - undead;
        this.undead = undead;
      }
    }
  }
}

module.exports = Troop;
