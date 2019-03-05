const debug = require('debug')('fight');
const Army = require('./army');

class Fight {
  constructor(json) {
    this.attackerUnits = json.attacker.units || [];
    this.targetUnits = json.target.units || [];
  }

  fight() {
    debug('Fight start');
    const attackerArmy = new Army(this.attackerUnits, 'A');
    const targetArmy = new Army(this.targetUnits, 'T');
    let round = 0;

    while (attackerArmy.alive && targetArmy.alive) {
      round += 1;
      debug(`Round ${round} start`);

      const attackerAttacks = attackerArmy.getAttacks();
      const targetAttacks = targetArmy.getAttacks();
      attackerArmy.takeDamages(targetAttacks);
      targetArmy.takeDamages(attackerAttacks);
    }

    debug(`Fight ended in round ${round}`);

    let result = 2;
    if (attackerArmy.alive) {
      result = 1;
    } else if (targetArmy.alive) {
      result = 3;
    }

    return {
      result,
      attacker: {
        units: attackerArmy.getResult(),
      },
      target: {
        units: targetArmy.getResult(),
      },
    };
  }
}

module.exports = Fight;
