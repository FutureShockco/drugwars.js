import { orderBy } from 'lodash';
import Unit from './unit';
import dwunits from './units.json';
import numeral from 'numeral';
import Troop from './troop';

export default class Army {
  constructor(units, name, log) {
    this.units = [];
    this.groups = []
    this.alive = true;
    this.name = name;
    this.log = log;
    this.groupid = 0;
    units.forEach(unit => {
      if(dwunits[unit.key].skills[0].type === "group")
      {
        let group_amount = unit.amount
        const skill =  dwunits[unit.key].skills[0]
        const effect =  dwunits[unit.key].skills[0].effect
        while(group_amount>0)
        {
          if(group_amount>=effect)
          {
            group_amount = group_amount - effect
            this.groups.push(new Troop(unit.key, effect, this.groupid++, name, skill, log));	
          }
          else{
            if(group_amount>0)
            this.groups.push(new Troop(unit.key, group_amount, this.groupid++, name, skill, log));	
            group_amount = 0
          }
        }
      }
      else{
        for (let i = 0; i < unit.amount; i += 1) {
          const skill =  dwunits[unit.key].skills[0]
          if (this.name === 'defender' && unit.key === 'hobo' || this.name === 'defender' && unit.key === 'spy') {
  
          }
          else
            this.units.push(new Unit(unit.key, i + 1, name, skill, log));
        }
      }

    });
  }

  chooseActions(round) {
    const actions = [];
    this.units.forEach(unit => {
      if (!unit.dead && unit.spec.attack > 0) {
        if(round != 1 || unit.spec.range > 4 || unit.spec.skills[0].type === 'tastynasty' || unit.key === 'hobo' )
        {
            if(unit.use > 0 || unit.use === -1)
            {
            }
            else{
              unit.skill.type = 'attack'
            }
          actions.push([unit.spec.attack, unit.skill, unit.key, unit.i]);
        }
        if (unit.health === 0 && !unit.dead) unit.kill();
      }
    });
    this.groups.forEach(group => {
      if (group.undead > 0 && round != 1) {
        const attack = group.getAttack();
        if (attack > 0) {
          actions.push([attack, group.skill, group.key, group.i]);
        }
      }
    });
    return actions;
  }

  //Process all actions for attacker and defender
  processAllActions(allies, attackpower, enemies, round) {
    this.processArmyActions('allies', allies, null, round);
    this.processArmyActions('enemies',enemies, attackpower, round);
  }

  processArmyActions(target, actions, attackpower, round) {
    const unitsSorted = orderBy(this.units, ['priority'], ['asc']);
    const unitsByHighestPriority = orderBy(this.units, ['priority'], ['desc']);
    actions.forEach(action => {
      const serie = [];
      const skill_type = action[1].type;
      const name = action[2];
      const num = action[3];
      let attack = 0;
      let buff = 0;
      if (target === 'allies') {
        switch (skill_type) {
          case 'heal':
              buff = {}
              buff.points = parseInt(action[1].effect);
              buff.author = name
              buff.num = num
              serie.push(buff);
            break;
          case 'groupheal':
              buff = {}
              buff.points = parseInt(action[1].effect);
              buff.author = name
              buff.num = num
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(buff);
            }
            break;
          default:
            break;
        }
        unitsSorted.forEach(unit => {
          if (serie.length > 0 && !unit.dead) {
            unit.takeBuff(serie[0].points , skill_type, round ,serie[0].author, serie[0].num);
            serie.splice(0, 1);
          }
        });
      }
      else {
        switch (skill_type) {
          case 'splash':
            attack = {}
            attack.author = name
            attack.num = num
            attack.dmg = parseInt(action[1].effect);
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(attack);
            }
            break;
          case 'attack':
          attack = {}
          attack.author = name
          attack.num = num
          attack.dmg = parseInt(action[0]);
            serie.push(attack);
            break;
          case 'multiplehit':
          attack = {}
          attack.author = name
          attack.num = num
          attack.dmg = parseInt(action[1].effect);
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(attack);
            }
            break;
          case 'criticalhit':
          attack = {}
          attack.author = name
          attack.num = num
          attack.dmg = parseInt(Math.round((action[1].effect * action[1].range * round) * attackpower / 100));
            serie.push(attack);
            break;
          case 'tastynasty':
          attack = {}
          attack.author = name
          attack.num = num
          attack.dmg = parseInt(action[0]);
            serie.push(attack);
            unitsByHighestPriority.forEach(unit => {
              if (!unit.dead && serie.length > 0) {
                unit.takeDamages(Math.round(serie[0].dmg * attackpower / 100), skill_type, round,serie[0].author, serie[0].num);
                serie.splice(0, 1);
              }
            });
            break;
          default:
          attack = {}
          attack.author = name
          attack.num = num
          attack.dmg = parseInt(action[0]);
            serie.push(attack);
            break;
        }
        this.groups.forEach(group => {	
          if (group.undead > 0 && serie.length > 0) {	 
            group.takeGroupDamages(Math.round(serie[0].dmg * attackpower / 100), skill_type, round , serie[0].author, serie[0].num);	        
            serie.splice(0, 1);	       
          }	      
        })
        unitsSorted.forEach(unit => {
          if (!unit.dead && serie.length > 0) {
            unit.takeDamages(Math.round(serie[0].dmg * attackpower / 100), skill_type, round , serie[0].author, serie[0].num);
            serie.splice(0, 1);
          }
        });
      }
    });

    this.updateAliveStatus();
  }

  updateAliveStatus() {
    const unitsAlive = this.units.filter(unit => !unit.dead).length;
    const groupAlive = this.groups.filter(group => !group.dead).length;
    if (!unitsAlive && !groupAlive) {
      this.alive = false;
    }
  }

  size() {
    return this.units.filter(unit => !unit.dead).length
  }

  cost() {
    let drug_cost = 0;
    let weapon_cost = 0;
    let alcohol_cost = 0;
    this.units.forEach(unit => {
      if (!unit.dead) {
        drug_cost += dwunits[unit.key].drugs_cost
        weapon_cost += dwunits[unit.key].weapons_cost
        alcohol_cost += dwunits[unit.key].alcohols_cost
      }
    });
    this.groups.forEach(group => {
      if (!group.dead) {
        drug_cost += dwunits[group.key].drugs_cost * group.amount
        weapon_cost += dwunits[group.key].weapons_cost * group.amount
        alcohol_cost += dwunits[group.key].alcohols_cost * group.amount
      }
    });
    return `<img class="minip" src="https://drugwars.io/img/icons/drug.png" > ${numeral(drug_cost).format('0.[00]a')}, <img class="minip" src="https://drugwars.io/img/icons/weapon.png" > ${numeral(weapon_cost).format('0.[00]a')}, <img class="minip" src="https://drugwars.io/img/icons/alcohol.png" > ${numeral(alcohol_cost).format('0.[00]a')}`
  }

  supply() {
    let supply = 0;
    this.units.forEach(unit => {
      if (!unit.dead)
        supply += dwunits[unit.key].supply
    });
    return supply
  }

  capacity() {
    let capacity = 0;
    this.units.forEach(unit => {
      if (!unit.dead)
      capacity += dwunits[unit.key].capacity
    });
    return capacity
  }

  attackPower() {
    let attackpower = 0;
    this.units.forEach(unit => {
      if (!unit.dead)
        attackpower += dwunits[unit.key].supply
    });
    return Math.round(100 - parseFloat(attackpower / 5).toFixed(0) / 100)
  }

  getResult() {
    const unitsObj = {};
    this.groups.forEach(group => {
      if (!unitsObj[group.key]) {
        unitsObj[group.key] = {
          amount: 0,
          dead: 0,
        };
      }
      unitsObj[group.key].amount += group.amount;
      unitsObj[group.key].dead += group.dead;
    })
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
