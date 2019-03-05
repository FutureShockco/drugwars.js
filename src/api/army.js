const unitsJson = require('../units.json');
const Unit = require('./unit');

class Army {
  constructor(units) {
    this.units = [];
    this.alive = true;

    Object.keys(unitsJson).forEach((key) => {
      units.forEach((unit) => {
        if (unit.key === key) {
          for (let i = 0; i < unit.amount; i++) {
            this.units.push(new Unit(unit.key));
          }
        }
      });
    });
  }

  getAttack() {
    let attack = 0;
    this.units.forEach((unit) => {
      attack += !unit.dead ? unit.spec.attack : 0;
    });
    return attack;
  }

  takeDamages(damages) {
    let pending = damages;

    this.units.forEach((unit) => {
      if (pending > 0) {
        pending = unit.takeDamages(pending);
      }
    });

    const unitsAlive = this.units.filter((unit) => !unit.dead).length;
    if (!unitsAlive) {
      this.alive = false;
    }

    if (unitsAlive > 0 && pending > 0) {
      this.takeDamages(pending);
    }
  }

  getResult() {
    const unitsObj = {};

    this.units.forEach((unit) => {
      if (!unitsObj[unit.key]) {
        unitsObj[unit.key] = {
          amount: 0,
          dead: 0,
        };
      }
      unitsObj[unit.key].amount += 1;
      unitsObj[unit.key].dead += unit.dead ? 1 : 0;
    });

    return Object.keys(unitsObj).map((key) => ({
      key,
      amount: unitsObj[key].amount,
      dead: unitsObj[key].dead || undefined,
    }));
  }
}

module.exports = Army;
