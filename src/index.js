import { Client } from 'kbyte';
import constants from './constants';
import Fight from './fight';
import units from './units.json';
import buildings from './buildings.json';
import shop from './shop.json';
import missions from './missions.json';
import trainings from './trainings.json';
import upgrades from './upgrades.json';
import drugs from './drugs.json';
import locations from './locations.json';
import continents from './continents.json';
import utils from './utils';

import heroes from './heroes.json';
import suffixes from './suffixes.json';
import prefixes from './prefixes.json';
import actives from './actives.json';
import passives from './passives.json';
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
  shop,
  missions,
  trainings,
  upgrades,
  drugs,
  locations,
  continents,
  utils,
  Cards: { heroes, suffixes, prefixes, passives, actives, unit: c_units, buildings: c_buildings, items: c_items, upgrades: c_upgrades }
};
