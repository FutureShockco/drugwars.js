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
      if (!unit.dead && unit.spec.attack > 0) {
        const skills = unit.spec.skills || {};
        const skillsMessage = skills.splash ? `splash (${skills.splash.range}) ` : '';
        this.log.add(
          `[${this.name}] ${unit.key} (${unit.i}) attack ${skillsMessage}+${unit.spec.attack}`,
        );
        attacks.push([unit.spec.attack, skills]);
      }
    });

    return attacks;
  }

  takeDamages(damages) {
    const splashDamages = damages.filter(damage => damage[1] && damage[1].splash);
    const normalDamages = damages.filter(damage => !damage[1] || !damage[1].splash);

    this.units.forEach(unit => {
      if (unit.spec.defense === 0) unit.kill();
    });

    this.takeSplashDamages(splashDamages);
    this.takeNormalDamages(normalDamages);
  }

  takeNormalDamages(damages, loop = 0) {
    const pending = damages;

    const unitsSorted = orderBy(this.units, ['priority'], ['asc']);
    unitsSorted.forEach(unit => {
      while (!unit.dead && pending.length > 0) {
        unit.takeDamages(pending[0][0]);
        pending.splice(0, 1);
      }
    });

    const unitsAlive = this.units.filter(unit => !unit.dead).length;
    if (!unitsAlive) {
      this.alive = false;
    }

    if (unitsAlive > 0 && pending.length > 0) {
      this.takeNormalDamages(pending, loop + 1);
    }
  }

  takeSplashDamages(damages) {
    const unitsSorted = orderBy(this.units, ['priority'], ['asc']);

    damages.forEach(damage => {
      const serie = [];
      const attack = parseInt(damage[0] / damage[1].splash.range, 10);
      for (let i = 0; i < damage[1].splash.range; i += 1) {
        serie.push(attack);
      }

      unitsSorted.forEach(unit => {
        if (!unit.dead && serie.length > 0) {
          unit.takeDamages(serie[0]);
          serie.splice(0, 1);
        }
      });
    });

    this.updateAliveStatus();
  }

  updateAliveStatus() {
    const unitsAlive = this.units.filter(unit => !unit.dead).length;
    if (!unitsAlive) {
      this.alive = false;
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
