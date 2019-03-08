import Army from './army';
import Log from './log';

export default class Fight {
  constructor(json) {
    this.attackerUnits = json.attacker.units || [];
    this.targetUnits = json.target.units || [];
    this.log = new Log();
  }

  fight() {
    this.log.add('Fight start');
    const attackerArmy = new Army(this.attackerUnits, 'attacker', this.log);
    const targetArmy = new Army(this.targetUnits, 'target', this.log);
    let round = 0;

    while (attackerArmy.alive && targetArmy.alive) {
      round += 1;
      this.log.add(`Round ${round} start`);

      const attackerAttacks = attackerArmy.getAttacks();
      const targetAttacks = targetArmy.getAttacks();
      attackerArmy.takeDamages(targetAttacks);
      targetArmy.takeDamages(attackerAttacks);
    }

    this.log.add(`Fight ended in round ${round}`);

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

  getLog() {
    return this.log.log;
  }
}
