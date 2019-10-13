import { Client } from 'kbyte';
import constants from './constants';
import Fight from './fight';
import units from './units.json';
import buildings from './buildings.json';
import missions from './missions.json';
import trainings from './trainings.json';
import upgrades from './upgrades.json';
import drugs from './drugs.json';
import locations from './locations.json';
import continents from './continents.json';
import utils from './utils';

import heroes from './heroes.json';

import skills_chemical from './skills_chemical.json';
import skills_fire from './skills_fire.json';
import skills_weapon from './skills_weapon.json';
import skills_physical from './skills_physical.json';

import passives_cartel from './passives_cartel.json';
import passives_gang from './passives_gang.json';
import passives_mafia from './passives_mafia.json';

import c_units from './cardunits.json';
import c_buildings from './cardbuildings.json';
import c_items from './carditems.json';
import c_upgrades from './cardupgrades.json';
module.exports = {
  constants,
  Client,
  Fight,
  units,
  buildings,
  missions,
  trainings,
  upgrades,
  drugs,
  locations,
  continents,
  utils,
  Cards: { heroes, passives: { cartel: passives_cartel, gang: passives_gang, mafia: passives_mafia }, actives: { chemical: skills_chemical, fire: skills_fire, weapon: skills_weapon, physical: skills_physical }, unit: c_units, buildings: c_buildings, items: c_items, upgrades: c_upgrades }
};
