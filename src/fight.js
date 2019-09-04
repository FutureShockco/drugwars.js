import Army from './army';
import Log from './log';
import dunits from './units.json';

export default class Fight {
  constructor(json) {
    this.randomizer = json.merkle_root;
    this.attackers = json.attacker.units || [];
    this.defenders = json.target.units || [];
    this.defendersBuildings = json.target.buildings || [];
    this.attackersTrainings = json.attacker.trainings || [];
    this.defendersTrainings = json.target.trainings || [];
    this.log = new Log();
  }

  fight() {
    this.log.add('Fight start [A] Attacker - [D] Defender');
    const sendDate = (new Date()).getTime();
    const attackers = new Army(this.attackers, 'attacker', this.attackersTrainings, null, this.log);
    const defenders = new Army(this.defenders, 'defender', this.defendersTrainings, this.defendersBuildings, this.log);
    attackers.updateAliveStatus();
    defenders.updateAliveStatus();
    const attacker_start_value = {supply :attackers.supply(), power : attackers.attackPower(), size: attackers.size(),cost:attackers.cost(), carry:attackers.capacity()};
    const defender_start_value = {supply :defenders.supply(), power : defenders.defensiveAttackPower(), size: defenders.size(),cost:defenders.cost(), carry:defenders.capacity()};
    let round = 0;
    while (attackers.alive && defenders.alive && round < 6) {
      round += 1;
      this.log.add(`<div class="round">Round ${round} Attacker AP : ${attackers.attackPower()}% - Defender AP : ${defenders.defensiveAttackPower()}%</div>`);
      let defendersActions = defenders.chooseActions(round);
      let attackersActions = attackers.chooseActions(round);
      defenders.processAllActions(defendersActions,attackers.attackPower(),attackersActions,round);
      defendersActions = defenders.chooseActions(round);
      attackersActions = attackers.chooseActions(round);
      attackers.processAllActions(attackersActions,defenders.defensiveAttackPower(),defendersActions,round);
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
    const attacker_end_value = {supply :attackers.supply(), power : attackers.attackPower(), size: attackers.size(),cost:attackers.cost(), carry:attackers.capacity()};
    const defender_end_value = {supply :defenders.supply(), power : defenders.defensiveAttackPower(), size: defenders.size(),cost:defenders.cost(), carry:defenders.capacity()};
    this.log.add(`Fight ended in round ${round}, Winner is : ${winner}`);
    const receiveDate = (new Date()).getTime();
    console.log('Ended in '+ (receiveDate - sendDate +'ms'));
    return {
      result,
      attacker: {
        units: attackers.getResult(),
        start_value: attacker_start_value,
        end_value: attacker_end_value,
      },
      target: {
        units: defenders.getResult(),
        start_value: defender_start_value,
        end_value: defender_end_value,
      },
    };
  }

  getLog() {
    return this.log.log;
  }
}
