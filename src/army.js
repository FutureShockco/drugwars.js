import { orderBy } from 'lodash';
import Unit from './unit';

export default class Army {
  constructor(units, name, log) {
    this.units = [];
    this.alive = true;
    this.name = name;
    this.log = log;

    units.forEach(unit => {
      for (let i = 0; i < unit.amount; i += 1) {
        this.units.push(new Unit(unit.key, i + 1, name, log));
      }
    });
  }

  getAttacks() {
    const attacks = [];

    this.units.forEach(unit => {
      if (!unit.dead) {
        this.log.add(`[${this.name}] ${unit.key} (${unit.i}) attack +${unit.spec.attack}`);
        attacks.push(unit.spec.attack);
      }
    });

    return attacks;
  }

  takeDamages(damages) {
    const pending = damages;

    const unitsSorted = orderBy(this.units, ['priority'], ['asc']);
    unitsSorted.forEach(unit => {
      while (!unit.dead && pending.length > 0) {
        unit.takeDamages(pending[0]);
        pending.splice(0, 1);
      }
    });

    const unitsAlive = this.units.filter(unit => !unit.dead).length;
    if (!unitsAlive) {
      this.alive = false;
    }

    if (unitsAlive > 0 && pending.length > 0) {
      this.takeDamages(pending);
    }
  }

  getResult() {
    const unitsObj = {};

    this.units.forEach(unit => {
      if (!unitsObj[unit.key]) {
        unitsObj[unit.key] = {
          amount: 0,
          dead: 0,
        };
      }
      unitsObj[unit.key].amount += 1;
      unitsObj[unit.key].dead += unit.dead ? 1 : 0;
    });

    return Object.keys(unitsObj).map(key => {
      const unit = { key, amount: unitsObj[key].amount };
      if (unitsObj[key].dead) unit.dead = unitsObj[key].dead;
      return unit;
    });
  }
}
