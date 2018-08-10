const compose = (...fns) => (...arg) =>
  fns.reduceRight((acc, val) => () => val(acc(...arg)))();

const curryLeft = (fn, ...curriedArgs) => (...args) =>
  fn(...curriedArgs, ...args);

const curryRight = (fn, ...curriedArgs) => (...args) =>
  fn(...args, ...curriedArgs);

export function randomInt(int) {
  return Math.floor(Math.random() * int);
}

export function calcMeleeDamage({ attacker: { damage }, target }) {
  return randomInt(damage[1] - damage[0] + 1) - target.defense;
}

export function rawHit({ chanceModifier }, { attacker, target }) {
  return chanceModifier() + target.evansion <= attacker.melee;
}

export function rawDamage({ damageCalc }, { attacker, target }) {
  return {
    target: {
      ...target,
      life: target.life - damageCalc({ attacker, target })
    },
    attacker
  };
}

export function rawAttack({ hitCalc, damageCalc }, battle) {
  if (hitCalc(battle)) {
    return damageCalc(battle);
  } else {
    return battle;
  }
}

export { compose, curryLeft, curryRight };
