const compose = (...fns) => (...arg) =>
  fns.reduceRight((acc, val) => () => val(acc(...arg)))();

const curryLeft = (fn, ...curriedArgs) => (...args) =>
  fn(...curriedArgs, ...args);

const curryRight = (fn, ...curriedArgs) => (...args) =>
  fn(...args, ...curriedArgs);

function randomInt(int) {
  return Math.floor(Math.random() * int);
}

function calcMeleeDamage({ attacker, target }) {
  return attacker.damage - target.defense;
}

function rawHit({ chanceModifier }, { attacker, target }) {
  return chanceModifier() + target.evansion <= attacker.melee;
}

function rawDamage({ damageCalc }, { attacker, target }) {
  return {
    target: {
      ...target,
      life: target.life - damageCalc({ attacker, target })
    },
    attacker
  };
}

function rawAttack({ hitCalc, damageCalc }, battle) {
  if (hitCalc(battle)) {
    return damageCalc(battle);
  } else {
    return battle;
  }
}

module.exports = {
  rawHit,
  rawDamage,
  rawAttack,
  calcMeleeDamage,
  compose,
  curryLeft,
  curryRight
};
