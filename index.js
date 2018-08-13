export const compose = (...fns) => (...arg) =>
  fns.reduceRight((acc, val) => () => val(acc(...arg)))();

export const curryLeft = (fn, ...curriedArgs) => (...args) =>
  fn(...curriedArgs, ...args);

export const curryRight = (fn, ...curriedArgs) => (...args) =>
  fn(...args, ...curriedArgs);

export const eitherOr = (predicateFn, leftFn, rightFn) => (...args) =>
  predicateFn(...args) ? leftFn(...args) : rightFn(...args);

export const identity = ident => ident;

export const randomInt = int => Math.floor(Math.random() * int);

export const random100 = () => randomInt(100);

export const calcMeleeDamage = ({ attacker: { damage }, target }) => {
  const val = randomInt(damage[1] - damage[0] + 1) + damage[0] - target.defense;
  return val >= 0 ? val : 0;
};

export const rawHit = ({ chanceModifier }, action) => {
  const { attacker, target } = action;
  const hit = chanceModifier() + target.evansion <= attacker.melee;
  return { ...action, result: { ...action.result, hit } };
};

export const rawDamage = ({ damageCalc }, action) => {
  const { attacker, target } = action;
  const damage = damageCalc({ attacker, target });

  return {
    ...action,
    target: {
      ...target,
      life: target.life - damage
    },
    result: {
      ...action.result,
      damage
    }
  };
};

export const message = action => {
  const { attacker, target, result } = action;
  let message;

  if (result.hit) {
    message = `${attacker.name} hits ${target.name} for ${
      result.damage
    } damage!`;
  } else {
    message = `${attacker.name} misses!`;
  }

  return {
    ...action,
    result: {
      ...action.result,
      message
    }
  };
};
