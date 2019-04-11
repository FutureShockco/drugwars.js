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
        const skill = dwunits[unit.key].skills[0];
        if (
          (this.name === 'defender' && unit.key === 'hobo') ||
          (this.name === 'defender' && unit.key === 'spy')
        ) {
        } else this.units.push(new Unit(unit.key, i + 1, name, skill, log));
      }
    });
  }

  chooseActions(round) {
    const actions = [];
    this.units.forEach(unit => {
      if (!unit.dead && unit.spec.attack > 0) {
        if (
          round != 1 ||
          unit.spec.range > 4 ||
          unit.spec.skills[0].type === 'taster' ||
          unit.key === 'hobo'
        ) {
          if (unit.skill.passive) {
          } else if (unit.use > 0 || unit.use === -1) {
            // this.log.add(`[${unit.name}] ${unit.key} use his skill ${unit.skill.type}`);
          } else {
            // this.log.add(`[${unit.name}] ${unit.key} can't use ${unit.skill.type} anymore and will attack with ${unit.spec.attack} dmg`);
            unit.skill.type = 'attack';
          }
          actions.push([unit.spec.attack, unit.skill, unit.key]);
        }
        if (unit.health === 0 && !unit.dead) unit.kill();
      }
    });
    return actions;
  }

  // Process all actions for attacker and defender
  processAllActions(allies, attackpower, enemies, round) {
    this.processArmyActions('allies', allies, null, round);
    this.processArmyActions('enemies', enemies, attackpower, round);
  }

  processArmyActions(target, actions, attackpower, round) {
    const unitsSorted = orderBy(this.units, ['priority'], ['asc']);
    const unitsByHighestPriority = orderBy(this.units, ['priority'], ['desc']);
    actions.forEach(action => {
      const serie = [];
      const skill_type = action[1].type;
      const name = action[2];
      let attack = 0;
      let buff = 0;
      if (target === 'allies') {
        switch (skill_type) {
          case 'heal':
            buff = {};
            buff.points = parseInt(action[1].effect);
            buff.author = name;
            serie.push(buff);
            break;
          case 'groupheal':
            buff = {};
            buff.points = parseInt(action[1].effect);
            buff.author = name;
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(buff);
            }
            unitsSorted.forEach(unit => {
              if (serie.length > 0 && unit.health > 0) {
                unit.takeBuff(serie[0].points, skill_type, round, serie[0].author);
                serie.splice(0, 1);
              }
            });
            break;
          default:
            break;
        }
        unitsSorted.forEach(unit => {
          if (serie.length > 0 && unit.health > 0) {
            unit.takeBuff(serie[0].points, skill_type, round, serie[0].author);
            serie.splice(0, 1);
          }
        });
      } else {
        switch (skill_type) {
          case 'splash':
            attack = {};
            attack.author = name;
            attack.dmg = parseInt(action[1].effect);
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(attack);
            }
            break;
          case 'attack':
            attack = {};
            attack.author = name;
            attack.dmg = parseInt(action[0]);
            serie.push(attack);
            break;
          case 'multiplehit':
            attack = {};
            attack.author = name;
            attack.dmg = parseInt(action[1].effect);
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(attack);
            }
            unitsSorted.forEach(unit => {
              if (!unit.dead && serie.length > 0) {
                unit.takeDamages(
                  Math.round((serie[0].dmg * attackpower) / 100),
                  skill_type,
                  round,
                  serie[0].author,
                );
                serie.splice(0, 1);
              }
            });
            break;
          case 'criticalhit':
            attack = {};
            attack.author = name;
            attack.dmg = parseInt(
              Math.round((action[1].effect * action[1].range * round * attackpower) / 100),
            );
            serie.push(attack);
            break;
          case 'taster':
            attack = {};
            attack.author = name;
            attack.dmg = parseInt(action[0]);
            serie.push(attack);
            unitsByHighestPriority.forEach(unit => {
              if (!unit.dead && serie.length > 0) {
                unit.takeDamages(
                  Math.round((serie[0].dmg * attackpower) / 100),
                  skill_type,
                  round,
                  serie[0].author,
                );
                serie.splice(0, 1);
              }
            });
            break;
          default:
            attack = {};
            attack.author = name;
            attack.dmg = parseInt(action[0]);
            serie.push(attack);
            break;
        }
        unitsSorted.forEach(unit => {
          if (!unit.dead && serie.length > 0) {
            unit.takeDamages(
              Math.round((serie[0].dmg * attackpower) / 100),
              skill_type,
              round,
              serie[0].author,
            );
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
    return this.units.filter(unit => !unit.dead).length;
  }

  cost() {
    const drug_cost = 0;
    let weapon_cost = 0;
    let alcohol_cost = 0;
    this.units.forEach(unit => {
      if (!unit.dead) {
        // drug_cost += dwunits[unit.key].drugs_cost
        weapon_cost += dwunits[unit.key].weapons_cost;
        alcohol_cost += dwunits[unit.key].alcohols_cost;
      }
    });
    return `D ${drug_cost}, W ${weapon_cost}, A ${alcohol_cost}`;
  }

  supply() {
    let supply = 0;
    this.units.forEach(unit => {
      if (!unit.dead) supply += dwunits[unit.key].supply;
    });
    return supply;
  }

  attackPower() {
    let attackpower = 0;
    this.units.forEach(unit => {
      if (!unit.dead) attackpower += dwunits[unit.key].supply;
    });
    return Math.round(100 - parseFloat(attackpower / 4).toFixed(0) / 100);
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
