import { orderBy } from 'lodash';
import Troop from './troop';

export default class Army {
  constructor(units, name, log) {
    this.troops = [];
    this.alive = true;
    this.name = name;
    this.log = log;

    units.forEach(unit => {
      this.troops.push(new Troop(unit.key, unit.amount, name, log));
    });
  }

  getAttacks() {
    const attacks = [];

    const troopsSorted = orderBy(this.troops, ['priority'], ['asc']);
    troopsSorted.forEach(troop => {
      if (troop.undead > 0) {
        const attack = troop.getAttack();
        if (attack > 0) {
          this.log.add(`${this.name} ${troop.key} x ${troop.undead} attack ${attack}`);
          attacks.push(attack);
        }
      }
    });
    return attacks;
  }

  takeDamages(damages) {
    const pending = damages;

    const troopsSorted = orderBy(this.troops, ['priority'], ['asc']);
    troopsSorted.forEach(troop => {
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
