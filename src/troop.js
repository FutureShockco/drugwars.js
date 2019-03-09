import unitsJson from './units.json';

export default class Troop {
  constructor(key, amount, name, log) {
    this.log = log;
    this.key = key;
    this.amount = amount;
    this.name = name;
    this.spec = unitsJson[key];
    this.attack = unitsJson[key].attack;
    this.defense = unitsJson[key].defense;
    this.priority = unitsJson[key].priority;
    this.dead = 0;
    this.undead = amount;
  }

  getAttack() {
    return this.undead > 0 ? this.attack * this.undead : 0;
  }

  takeDamages(damages) {
    const health = this.undead * this.defense;
    const healthAfterDamage = health - damages;

    this.log.add(
      `[${this.name}] ${this.undead} x ${this.key} take damages -${damages} / ${health}`,
    );

    if (healthAfterDamage <= 0) {
      this.log.add(`[${this.name}] ${this.undead} x ${this.key} die`);

      this.dead = this.amount;
      this.undead = 0;
    } else {
      const undead = Math.ceil(healthAfterDamage / this.defense);
      if (undead !== this.undead) {
        this.log.add(`[${this.name}] ${this.undead - undead} x ${this.key} die`);
        this.dead += this.undead - undead;
        this.undead = undead;
      }
    }
  }
}
