import Army from './army';
import Log from './log';

export default class Fight {
  constructor(json) {
    this.attackers = json.attacker.units || [];
    this.defenders = json.target.units || [];
    this.log = new Log();
  }

  fight() {
    this.log.add('Fight start');
    const attackers = new Army(this.attackers, 'attacker', this.log);
    const defenders = new Army(this.defenders, 'defender', this.log);
    attackers.updateAliveStatus();
    defenders.updateAliveStatus();
    let round = 0;
    while (attackers.alive && defenders.alive && round < 5) {
      round += 1;
      this.log.add(`Round ${round}`);
      this.log.add(`Attacker Army - Supply : ${attackers.supply()} Power : ${attackers.attackPower()}% Size: ${attackers.size()} Value : ${attackers.cost()}`);
      this.log.add(`Defender Army - Supply : ${defenders.supply()}  Power : ${defenders.attackPower()}% Size: ${defenders.size()} Value :  ${defenders.cost()}`);
      const attackersActions = attackers.chooseActions(attackers.attackPower());
      const defendersActions = defenders.chooseActions(defenders.attackPower());
      attackers.processAllActions(attackersActions,defenders.attackPower(),defendersActions,round);
      defenders.processAllActions(defendersActions,attackers.attackPower(),attackersActions,round);
    }

    let winner = 'none';
    let result = 2;
    if (attackers.alive && !defenders.alive) {
      result = 1;
      winner = 'attacker';
    } else if (!attackers.alive && defenders.alive) {
      result = 3;
      winner = 'defender';
    }
    this.log.add(`Attacker Army - Supply : ${attackers.supply()} Power : ${attackers.attackPower()}% Size: ${attackers.size()} Value : ${attackers.cost()}`);
    this.log.add(`Defender Army - Supply : ${defenders.supply()}  Power : ${defenders.attackPower()}% Size: ${defenders.size()} Value :  ${defenders.cost()}`);
    this.log.add(`Fight ended in round ${round}, Winner is : ${winner}`);

    return {
      result,
      attacker: {
        units: attackers.getResult(),
      },
      target: {
        units: defenders.getResult(),
      },
    };
  }

  getLog() {
    return this.log.log;
  }
}
