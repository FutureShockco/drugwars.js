import Army from './army';
import Log from './log';

export default class Fight {
    constructor(json) {
        this.randomizer = json.merkle_root || [];
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
        const attacker_start_value = { supply: attackers.supply(), power: attackers.attackPower(this.attackersTrainings), size: attackers.size(), cost: attackers.cost(), carry: attackers.capacity() };
        const defender_start_value = { supply: defenders.supply(), power: defenders.defensiveAttackPower(this.defendersTrainings), size: defenders.size(), cost: defenders.cost(), carry: defenders.capacity() };

        const defenderPower = defender_start_value.power
        const attackerPower = attacker_start_value.power
        let round = 0;
        while (attackers.alive && defenders.alive && round < 7 || (this.defendersBuildings.find(b => b.key === 'hidden_mines' && b.lvl > 0) && round === 0)) {
            round += 1;
            this.log.add(`<div class="round">Round ${round} Attacker AP : ${attackers.attackPower(this.attackersTrainings)}% - Defender AP : ${defenders.defensiveAttackPower(this.defendersTrainings)}%</div>`);
            let defendersActions = defenders.chooseActions(round);
            let attackersActions = attackers.chooseActions(round);
            attackers.processAllActions(attackersActions, defenderPower, defendersActions, round);
            defenders.processAllActions(defendersActions, attackerPower, attackersActions, round);
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
        const attacker_end_value = { supply: attackers.supply(), power: attackers.attackPower(this.attackersTrainings), size: attackers.size(), cost: attackers.cost(), carry: attackers.capacity() };
        const defender_end_value = { supply: defenders.supply(), power: defenders.defensiveAttackPower(this.defendersTrainings), size: defenders.size(), cost: defenders.cost(), carry: defenders.capacity() };
        this.log.add(`Fight ended in round ${round}, Winner is : ${winner}`);
        const receiveDate = (new Date()).getTime();
        console.log('Ended in ' + (receiveDate - sendDate + 'ms'));
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