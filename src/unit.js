import units from './units.json';

export default class Unit {
  constructor(key, i, name, log) {
    this.key = key;
    this.name = name;
    this.i = i;
    this.spec = units[key];
    this.health = units[key].defense;
    this.dead = false;
    this.priority = units[key].priority;
    this.log = log;
  }

  takeDamages(damages) {
    this.log.add(
      `[${this.name}] ${this.key} (${this.i}) take damages -${damages} / ${this.health}`,
    );
    if (this.health > damages) {
      this.health = this.health - damages;
    } else {
      this.kill();
    }
  }

  kill() {
    this.log.add(`[${this.name}] ${this.key} (${this.i}) is dead`);
    this.health = 0;
    this.dead = true;
  }
}
