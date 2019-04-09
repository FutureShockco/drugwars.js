import { orderBy } from 'lodash';
import Unit from './unit';
import dwunits from './units.json';

export default class Army {
  constructor(units, name, log) {
    this.units = [];
    this.alive = true;
    this.name = name;
    this.log = log;
    units.forEach(unit => {
      for (let i = 0; i < unit.amount; i += 1) {
        if (this.name === 'defender' && unit.key === 'hobo' || this.name === 'defender' && unit.key === 'spy') {

        }
        else this.units.push(new Unit(unit.key, i + 1, name, log));
      }
    });
  }

  chooseActions(attackpower) {
    const actions = [];
    this.units.forEach(unit => {
      if (!unit.dead && unit.spec.attack > 0) {
        if (unit.skills.type === 'attack') {
          this.log.add(
            `[${this.name}] ${unit.key} (${unit.i}) simple attack with ${Math.round(unit.spec.attack * attackpower / 100)} dmg`,
          );
        }
        else {
          this.log.add(`[${this.name}] ${unit.key} (${unit.i , unit.skills.use}) use ${unit.skills.type} skill and attack with ${Math.round(unit.spec.attack * attackpower / 100)} dmg`);
        }
        actions.push([unit.spec.attack, unit.skills]);
      }
    });
    this.units.forEach(unit => {
      if (unit.health === 0 && !unit.dead) unit.kill();
    });
    return actions;
  }

  //Process all actions for attacker and defender
  processAllActions(allies, attackpower, enemies, round) {
    this.processArmyActions('allies', allies, null, round);
    this.processArmyActions('enemies', enemies, attackpower, round);
  }

  processArmyActions(target, actions, attackpower, round) {
    const unitsSorted = orderBy(this.units, ['priority'], ['asc']);
    const unitsByHighestPriority = orderBy(this.units, ['priority'], ['desc']);
    actions.forEach(action => {
      const serie = [];
      const type = action[1].type;
      let attack = 0;
      let buff = 0;
      if (target === 'allies') {
        switch (type) {
          case 'heal':
            buff = parseInt(action[1].effect);
            serie.push(buff);
            break;
          case 'groupheal':
            buff = parseInt(action[1].effect);
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(buff);
            }
            break;
          default:
            break;
        }
        unitsSorted.forEach(unit => {
          if (serie.length > 0 && unit.health > 0) {
            unit.takeBuff(serie[0], type, round);
            serie.splice(0, 1);
          }
        });
      }
      else {
        switch (type) {
          case 'splash':
            attack = parseInt(action[1].effect);
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(attack);
            }
            break;
          case 'attack':
            attack = parseInt(action[0]);
            serie.push(attack);
            break;
          case 'multiplehit':
            attack = parseInt(action[1].effect);
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(attack);
            }
            break;
          case 'criticalhit':
            attack = parseInt(action[1].effect * action[1].range);
            serie.push(attack);
            break;
          case 'taster':
            attack = parseInt(action[0]);
            serie.push(attack);
            unitsByHighestPriority.forEach(unit => {
              if (!unit.dead && serie.length > 0) {
                unit.takeDamages(serie[0], type, round);
                serie.splice(0, 1);
              }
            });
            break;
          default:
            attack = parseInt(action[0]);
            serie.push(attack);
            break;
        }
        unitsSorted.forEach(unit => {
          if (!unit.dead && serie.length > 0) {
            unit.takeDamages(Math.round(serie[0] * attackpower / 100), type, round);
            serie.splice(0, 1);
          }
        });
      }

    });

    this.updateAliveStatus();
  }

  updateAliveStatus() {
    const unitsAlive = this.units.filter(unit => !unit.dead).length;
    if (!unitsAlive) {
      this.alive = false;
    }
  }

  size() {
    return this.units.filter(unit => !unit.dead).length
  }

  cost() {
    //let drug_cost = 0;
    let weapon_cost = 0;
    let alcohol_cost = 0;
    this.units.forEach(unit => {
      if (!unit.dead) {
        //drug_cost += dwunits[unit.key].drugs_cost
        weapon_cost += dwunits[unit.key].weapons_cost
        alcohol_cost += dwunits[unit.key].alcohols_cost
      }
    });
    //return `DRUGS ${drug_cost}, WEAPONS ${weapon_cost}, ALCOHOL ${alcohol_cost}`

    return `WEAPONS ${weapon_cost}, ALCOHOL ${alcohol_cost}`
  }

  supply() {
    let supply = 0;
    this.units.forEach(unit => {
      if (!unit.dead)
        supply += dwunits[unit.key].supply
    });
    return supply
  }

  attackPower() {
    let attackpower = 0;
    this.units.forEach(unit => {
      if (!unit.dead)
        attackpower += dwunits[unit.key].supply
    });
    return Math.round(100 - parseFloat(attackpower / 2).toFixed(0) / 100)
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
