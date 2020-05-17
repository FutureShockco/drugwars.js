import units from './units.json';

export default class Troop {
    constructor(key, amount, i, name, log) {
        this.key = key;
        this.name = name;
        this.i = i;
        this.spec = units[key];
        this.attack = units[key].attack;
        this.defense = units[key].defense;
        this.amount = amount;
        this.health = units[key].health;
        this.grouphealth = units[key].health * amount;
        this.max_health = units[key].health;
        this.dead = 0;
        this.undead = amount;
        this.priority = units[key].priority;
        this.log = log;
        this.skill = units[key].skill;
        this.use = units[key].use;
        this.type = units[key].type
    }

    getAttack() {
        return this.undead > 0 ? this.attack * this.undead : 0;
    }

    takeGroupDamages(damage, sender_skill, round, name, num, sender_amount) {
        let damages = Math.floor(damage - Math.ceil(this.defense));
        if (damages < 0)
            damages = 1;
        let displayDefense = Math.ceil(this.defense)
        let damageleft = 0;
        let current = ''
        if (this.name === 'attacker')
            current = "D"
        else
            current = "A"
        let healthAfterDamage = this.grouphealth || 0;
        this.undead = Math.round(healthAfterDamage / this.max_health);
        let currentlog = `<div class="tick ${this.name}">`;
        if (this.type === 'Melee' && sender_skill === 'accuratehit' && this.type !== 'tastynasty') {
            currentlog += `[${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) took <span style="color:red"> ${damages/10}  DMG</span> bonus.`
            this.grouphealth = this.grouphealth - (damages / 10);
            healthAfterDamage = this.grouphealth;
        }

        if (this.type === 'Range' && sender_skill === 'accurateprecision') {
            currentlog += `[${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) took <span style="color:red"> ${damages/10}  DMG</span> bonus.`
            this.grouphealth = this.grouphealth - (damages / 10);
            healthAfterDamage = this.grouphealth;
        }

        if (this.skill.type === 'shield' && this.use > 0 && this.undead !== this.amount) {
            currentlog += `[${this.name.substring(0, 1).toUpperCase()}] ${this.key} (${this.i}) used his (${this.use}) shield. `;
            this.use -= 1;
            if (this.grouphealth + (this.skill.effect * this.undead) < this.amount * this.max_health)
                this.grouphealth = this.grouphealth + (this.skill.effect * this.undead);
            else this.grouhealth = this.amount * this.max_health
            healthAfterDamage = this.grouphealth;
        }


        if (this.skill.type === 'bulletproof' && (this.grouphealth / this.undead) < damages && this.use > 0) {
            currentlog += `[${this.name.substring(0,1).toUpperCase()}] (${this.i})  with ${this.undead} x ${this.key} with <span style="color:green">${parseFloat(this.grouphealth).toFixed(0)}</span> HP take <span style="color:red">${parseFloat(damages).toFixed(0)} DMG</span> from [${current}] (${num}) with ${sender_amount} x ${name}  <span style="color:blueviolet"> "${sender_skill}"</span>.`
            currentlog += `[${this.name.substring(0, 1).toUpperCase()}] ${this.key} (${this.i}) used his (${this.use}) bulletproof.`
            this.use -= 1;
            this.grouphealth = 20 * this.undead;
            healthAfterDamage = this.grouphealth;
        } else if (this.skill.type === 'dodge' && this.use > 0 && damages > this.grouphealth) {
            this.use -= 1;
            currentlog += `[${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i})<span style="color:blueviolet"> dodged</span> <span style="color:red">${parseFloat(damages).toFixed(0)} DMG.</span>`;
        } else {
            if (this.key === "hobo") {
                currentlog += `[${this.name.substring(0,1).toUpperCase()}] (${this.i})  with ${this.amount} x ${this.key} with <span style="color:green">${parseFloat(this.grouphealth).toFixed(0)}</span> HP take <span style="color:red">${parseFloat(damages).toFixed(0)} DMG</span> from [${current}] (${num}) with ${sender_amount} x ${name}  <span style="color:blueviolet"> "${sender_skill}"</span>.`
            } else
                currentlog += `[${this.name.substring(0,1).toUpperCase()}] (${this.i})  with ${this.undead} x ${this.key} with <span style="color:green">${parseFloat(this.grouphealth).toFixed(0)}</span> HP and <span style="color:yellow">${parseFloat(displayDefense).toFixed(0)}</span> DEF take <span style="color:red">${parseFloat(damages).toFixed(0)} DMG</span> from [${current}] (${num}) with ${sender_amount} x ${name}  <span style="color:blueviolet"> "${sender_skill}"</span>.`
            this.grouphealth = this.grouphealth - damages
            healthAfterDamage = this.grouphealth;
        }
        if (healthAfterDamage <= 0) {
            if (this.key === "hobo") {
                currentlog += `<br/> [${this.name.substring(0,1).toUpperCase()}] (${this.i}) ${this.amount} x ${this.key} are <span style="color:darkorange">now dead.</span>`;
            } else
                currentlog += `<br/> [${this.name.substring(0,1).toUpperCase()}] (${this.i}) ${this.undead} x ${this.key} are <span style="color:darkorange">now dead.</span>`;
            this.dead = this.amount;
            if (this.dead < 0)
                this.dead = 0;
            this.undead = 0;
            this.kill();
        } else {
            const undead = Math.round(healthAfterDamage / this.max_health);

            if (undead !== this.undead || undead !== this.amount) {
                currentlog += `<br/> [${this.name.substring(0,1).toUpperCase()}] (${this.i}) ${undead} x ${this.key} are left.`;
                this.dead += Number(this.undead - undead);
                if (this.dead > this.amount)
                    this.dead = this.amount
                if (this.dead < 0)
                    this.dead = 0;
                this.undead = undead;
            }
        }
        currentlog += "</div>"
        this.log.add(
            currentlog
        );
        if (damage > this.grouhealth && this.dead === this.amount)
            damageleft = damage - this.grouhealth;
        return Math.round(damageleft)
    }

    takeGroupBuff(points, sender_skill, round, name, num) {
        if (this.grouhealth < this.max_health && sender_skill === 'heal' || this.grouhealth < this.max_health && sender_skill === 'groupheal') {
            this.log.add(
                `<br/> [${this.name.substring(0,1).toUpperCase()}] ${this.key} (${this.i}) with ${this.grouhealth} HP take ${sender_skill} <span style="color:chartreuse">+${points} HP</span> from [${this.name.substring(0,1).toUpperCase()}] (${num}) with${name} .`,
            );
            this.grouhealth = this.grouhealth + points;
            if (this.grouhealth > (this.undead * this.max_health))
                this.grouhealth = this.undead * this.max_health
            this.dead = false;
        }
    }

    kill() {
        this.health = 0;
        this.grouhealth = 0;
    }
}