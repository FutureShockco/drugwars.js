const Army = require('./army');

class Fight {
  constructor(json) {
    this.attackerUnits = json.attacker.units || [];
    this.targetUnits = json.target.units || [];
  }

  fight() {
    const attackerArmy = new Army(this.attackerUnits);
    const targetArmy = new Army(this.targetUnits);
    let i = 0;

    while (attackerArmy.alive && targetArmy.alive) {
      i++;
      const attackerAttack = attackerArmy.getAttack();
      const targetAttack = targetArmy.getAttack();
      attackerArmy.takeDamages(targetAttack);
      targetArmy.takeDamages(attackerAttack);
    }

    const result = attackerArmy.alive
      ? 1 : targetArmy.alive ? 3 : 2;

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
