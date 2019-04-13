import Army from './army';
import Log from './log';

export default class Fight {
  constructor(json) {
    this.randomizer = json.merkle_root
    this.attackers = json.attacker.units || [];
    this.defenders = json.target.units || [];
    this.log = new Log();
  }

  fight() {
    this.log.add('Fight start [A] Attacker - [D] Defender');
    const attackers = new Army(this.attackers, 'attacker', this.log);
    const defenders = new Army(this.defenders, 'defender', this.log);
    attackers.updateAliveStatus();
    defenders.updateAliveStatus();

    let round = 0;
    const attacker_value = `Supply : ${attackers.supply()} Power : ${attackers.attackPower()}% Size: ${attackers.size()}  <h5> Value :</h5><div> ${attackers.cost()} </div> Carry : ${attackers.capacity()}`;
    const defender_value = `Supply : ${defenders.supply()} Power : ${defenders.attackPower()}% Size: ${defenders.size()} <h5> Value :</h5>  <div>${defenders.cost()}</div>`;
    while (attackers.alive && defenders.alive && round < 6) {
      round += 1;
      this.log.add(`Round ${round}`);
      const defendersActions = defenders.chooseActions(round);
      const attackersActions = attackers.chooseActions(round);
      defenders.processAllActions(defendersActions,attackers.attackPower(),attackersActions,round);
      attackers.processAllActions(attackersActions,defenders.attackPower(),defendersActions,round);
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
    const attacker_end_value = `Supply : ${attackers.supply()} Power : ${attackers.attackPower()}% Size: ${attackers.size()} <h5> Value :</h5><div> ${attackers.cost()} </div> Carry : ${attackers.capacity()}`;
    const defender_end_value = `Supply : ${defenders.supply()} Power : ${defenders.attackPower()}% Size: ${defenders.size()}  <h5> Value :</h5>  <div>${defenders.cost()}</div>`;
    this.log.add(`Fight ended in round ${round}, Winner is : ${winner}`);

    return {
      result,
      attacker: {
        units: attackers.getResult(),
        value : attacker_value,
        end_value : attacker_end_value
      },
      target: {
        units: defenders.getResult(),
        value : defender_value,
        end_value : defender_end_value
      },
    };
  }

  getLog() {
    return this.log.log;
  }
}
