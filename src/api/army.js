const debug = require('debug')('army');
const { orderBy } = require('lodash');
const Troop = require('./troop');

class Army {
  constructor(units, name) {
    this.troops = [];
    this.alive = true;
    this.name = name;

    units.forEach((unit) => {
      this.troops.push(new Troop(unit.key, unit.amount, name));
    });
  }

  getAttacks() {
    const attacks = [];

    this.troops.forEach((troop) => {
      if (troop.undead > 0) {
        const attack = troop.getAttack();
        if (attack > 0) {
          debug(`${this.name} ${troop.key} x ${troop.undead} attack ${attack}`);
          attacks.push(attack);
        }
      }
    });
    return attacks;
  }

  takeDamages(damages) {
    const pending = damages;

    const troopsSorted = orderBy(this.troops, ['priority'], ['asc']);
    troopsSorted.forEach((troop) => {
      if (troop.undead > 0 && pending.length > 0) {
        troop.takeDamages(pending[0]);
        pending.splice(0, 1);
      }
    });

    const troopsAlive = this.troops.filter(troop => troop.undead > 0).length;
    if (!troopsAlive) {
      this.alive = false;
    }

    if (troopsAlive > 0 && pending.length > 0) {
      this.takeDamages(pending);
    }
  }

  getResult() {
    return this.troops.map((troop) => {
      const unit = {
        key: troop.key,
        amount: troop.amount,
      };
      if (troop.dead > 0) unit.dead = troop.dead;
      return unit;
    });
  }
}

module.exports = Army;
