const debug = require('debug')('unit');
const unitsJson = require('../units.json');

class Unit {
  constructor(key, i, name) {
    this.key = key;
    this.name = name;
    this.i = i;
    this.spec = unitsJson[key];
    this.health = unitsJson[key].defense;
    this.dead = false;
    this.priority = unitsJson[key].priority;
  }

  takeDamages(damages) {
    debug(`${this.name} ${this.key} ${this.i} -${damages}/${this.health}`);
    if (this.health > damages) {
      this.health = this.health - damages;
    } else {
      debug(`${this.name} ${this.key} ${this.i} dead`);
      this.health = 0;
      this.dead = true;
    }
  }
}

module.exports = Unit;
