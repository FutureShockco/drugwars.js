const calculateCostToUpgrade = (amount, level) => {
  if (!amount) {
    return 0;
  }
  return level
    ? (amount * (level + 1 * (level + 1) * (2 * (level + 1)))) / 5
    : ((amount * 2) / 5) * 2.5;
};

const calculateTimeToBuild = (id, coeff, level, hqLevel) =>
  id === 'headquarters'
    ? 2500 * ((Math.sqrt(625 + 100 * (level * 250)) - 25) / 50) * 1000
    : ((coeff * 2000 * ((Math.sqrt(625 + 100 * (level * 250)) - 25) / 50)) / hqLevel) * 1000;

const calculateTimeToTrain = (coeff, level, amount) =>
  (coeff * 80 - (level * 10) / 100) * amount * 1000;

const getBalances = (user, ocLvl, timestamp) => {
  const time = (timestamp - new Date(user.last_update).getTime()) / 1000;
  let drugs = user.drugs_balance + Number(parseFloat(time * user.drug_production_rate).toFixed(2));
  let weapons =
    user.weapons_balance + Number(parseFloat(time * user.weapon_production_rate).toFixed(2));
  let alcohols =
    user.alcohols_balance + Number(parseFloat(time * user.alcohol_production_rate).toFixed(2));
  if (ocLvl > 0) {
    drugs += (ocLvl + time * user.drug_production_rate) * 0.005;
    weapons += (ocLvl + time * user.weapon_production_rate) * 0.005;
    alcohols += (ocLvl + time * user.alcohol_production_rate) * 0.005;
  }
  return {
    drugs: drugs > user.drug_storage ? user.drug_storage : drugs,
    weapons: weapons > user.weapon_storage ? user.weapon_storage : weapons,
    alcohols: alcohols > user.alcohol_storage ? user.alcohol_storage : alcohols,
  };
};

export default {
  calculateCostToUpgrade,
  calculateTimeToBuild,
  calculateTimeToTrain,
  getBalances,
};
