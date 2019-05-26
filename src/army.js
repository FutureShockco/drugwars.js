import { orderBy } from 'lodash';
import Unit from './unit';
import dwunits from './units.json';
import Troop from './troop';

export default class Army {
  constructor(units, name, trainings, log) {
    this.units = [];
    this.trainings = [];
    this.groups = []
    this.alive = true;
    this.name = name;
    this.log = log;
    this.groupid = 0;
    units.forEach(unit => {
      const effect = dwunits[unit.key].skill.effect
      if(unit.amount>0)
      {
        if(dwunits[unit.key].skill.type === "group")
        {
          let group_amount = unit.amount
          while(group_amount>0)
          {
            if(group_amount>=effect)
            {
              group_amount = group_amount - effect
              this.groups.push(new Troop(unit.key, effect, this.groupid++, name, log));	
            }
            else{
              if(group_amount>0)
              this.groups.push(new Troop(unit.key, group_amount, this.groupid++, name, log));	
              group_amount = 0
            }
          }
        }
        else{
          for (let i = 0; i < unit.amount; i += 1) {
            if (this.name === 'defender' && unit.key === 'hobo' || this.name === 'defender' && unit.key === 'spy' ) {
            }
            else
             {
              this.units.push(new Unit(unit.key, i + 1, name, log));
             }
          }
        }
      }
    });
    trainings.forEach(training => {
          if (training.key === 'routing' || training.lvl < 1) {
          }
          else
          this.trainings.push({key:training.key,lvl:training.lvl});
    });
    //ATTRIBUTE TRAINING MODIFICATOR
    this.units.forEach(unit => {
      const protection = this.trainings.find(b => b.key === 'protection');
      const giant = this.trainings.find(b => b.key === 'giant');
      if(protection)
      unit.defense = unit.defense +  (unit.defense/200 *protection.lvl);
      if(giant)
      unit.health = unit.health +  (unit.health/200 *giant.lvl);
        //ALL MELEE
        if(unit.spec.type === 'Melee')
        {
          const closecombat = this.trainings.find(b => b.key === 'closecombat');
          if(closecombat)
          unit.attack = unit.attack + (unit.attack /100 * closecombat.lvl);
        }
        else{
          const firearms = this.trainings.find(b => b.key === 'firearms');
          if(firearms)
          {
            unit.attack = unit.attack + (unit.attack /100 * firearms.lvl);
          }
        }

        // HOBO
        if(unit.key === "hobo")
        {
          const kamikaze = this.trainings.find(b => b.key === 'spiritwine');
          if(kamikaze)
          unit.attack = unit.attack + (unit.attack /100 * kamikaze.lvl);
        }

        // SNIPER
        if(unit.key === "sniper")
        {
          const sniping = this.trainings.find(b => b.key === 'sniping');
          if(sniping)
          unit.attack = unit.attack + (unit.attack /100 * sniping.lvl);
        }

        // BAZOOKA
        if(unit.key === "bazooka")
        {
          const bomb = this.trainings.find(b => b.key === 'bomb');
          if(bomb)
          unit.attack = unit.attack + (unit.attack /100 * bomb.lvl);
        }

        //WEAPON
        if(unit.key === "rowdy" || unit.key === "sniper" || unit.key === "hitman")
          {
          const firearms = this.trainings.find(b => b.key === 'weapon');
          if(firearms)
          {
            unit.attack = unit.attack + (unit.attack /100 * firearms.lvl);
          }
        }

        // FIRE
        if(unit.key === "bazooka" || unit.key === "gunman")
        {
          const fire = this.trainings.find(b => b.key === 'fire');
          if(fire)
          unit.attack = unit.attack + (unit.attack /100 * fire.lvl);
        }

        // CHEMICAL
        if(unit.key === "mercenary"  || unit.key === "knifer")
        {
          const chemical = this.trainings.find(b => b.key === 'chemical');
          if(chemical)
          unit.attack = unit.attack + (unit.attack /100 *chemical.lvl);
        }
        
        //ELITE
        if(unit.key === "mercenary" || unit.key === "knifer" || unit.key === "big_mama" || unit.key === "ninja")
        {
          const psychological = this.trainings.find(b => b.key === 'psychological');
          if(psychological)
          {
            unit.attack = unit.attack + (unit.attack /200 *psychological.lvl);
            unit.defense = unit.defense + (unit.defense /200 *psychological.lvl);
          }
        }

    })
  }

  chooseActions(round) {
    const actions = [];
    this.units.forEach(unit => {
      if (!unit.dead && unit.spec.attack > 0) {
        if(round != 1 || unit.spec.range > 4 || unit.spec.skill.type === 'tastynasty' || unit.key === 'hobo' )
        {
            // if(unit.use > 0 || unit.use === -1)
            // {
            //   actions.push([unit.attack, unit.skill, unit.key, unit.i]);
            // }
            // else{
            //   unit.skill_type = 'attack'
            //   actions.push([unit.attack, unit.skill, unit.key, unit.i]);
            // }
            actions.push([unit.attack, unit.skill, unit.key, unit.i]);
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
    this.processArmyActions('allies', allies, null, null, round);
    this.processArmyActions('enemies',enemies, attackpower, round);
  }

  processArmyActions(target, actions, attackpower,round) {
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
          attack.dmg = action[0];
            serie.push(attack);
            break;
          case 'multiplehit':
          attack = {}
          attack.author = name
          attack.num = num
          attack.dmg = action[0];
            for (let i = 0; i < action[1].range; i += 1) {
              serie.push(attack);
            }
            unitsSorted.forEach(unit => {
              if (!unit.dead && serie.length > 0) {
                unit.takeDamages(serie[0].dmg * attackpower / 100, skill_type, round , serie[0].author, serie[0].num);
                serie.splice(0, 1);
              }
            });
            break;
          case 'criticalhit':
          attack = {}
          attack.author = name
          attack.num = num
          attack.dmg = (action[0] * action[1].range * round * attackpower / 100);
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
                unit.takeDamages(serie[0].dmg * attackpower / 100, skill_type, round,serie[0].author, serie[0].num);
                serie.splice(0, 1);
              }
            });
            break;
          default:
          attack = {}
          attack.author = name
          attack.num = num
          attack.dmg = action[0];
            serie.push(attack);
            break;
        }
        this.groups.forEach(group => {	
          if (group.undead > 0 && serie.length > 0) {	 
            group.takeGroupDamages(serie[0].dmg * attackpower / 100, skill_type, round , serie[0].author, serie[0].num);	        
            serie.splice(0, 1);	       
          }	      
        })
        unitsSorted.forEach(unit => {
          if (!unit.dead && serie.length > 0) {
            unit.takeDamages(serie[0].dmg * attackpower / 100, skill_type, round , serie[0].author, serie[0].num);
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
    return {drug_cost,weapon_cost,alcohol_cost}
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
    let supply = 0;
    this.units.forEach(unit => {
      if (!unit.dead)
        supply += dwunits[unit.key].supply
    });
    let power = Math.round(100 - parseFloat(supply / 6).toFixed(0) / 100)
    const coordination = this.trainings.find(b => b.key === 'coordination');
    if(coordination)
    power = power + parseInt(coordination.lvl)/10
    if(power>=60)
    {
      if(power > 100)
      power = 100
      return power
    }
    else return 60
  }

  defensiveAttackPower() {
    let supply = 0;
    this.units.forEach(unit => {
      if (!unit.dead)
        supply += dwunits[unit.key].supply
    });
    let power = Math.round(100 - parseFloat(supply / 5).toFixed(0) / 100)
    const coordination = this.trainings.find(b => b.key === 'coordination');
    if(coordination)
    power = power + parseInt(coordination.lvl)/10
    if(power>=60)
    {
      if(power > 100)
      power = 100
      return power
    }
    else return 60
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
