const unitsJson = require('../units.json');

class Unit {
  constructor(key) {
    this.key = key;
    this.spec = unitsJson[key];
    this.health = unitsJson[key].defense;
    this.dead = false;
  }

  takeDamages(damages) {
    let pending = damages;
    if (this.dead) {
      pending = damages;
    } else if (this.health > damages) {
      this.health = this.health - damages;
      pending = 0;
    } else {
      pending = damages - this.health;
      this.health = 0;
      this.dead = true;
    }
    return pending;
  }
}

module.exports = Unit;
