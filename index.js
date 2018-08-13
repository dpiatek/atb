export const compose = (...fns) => (...arg) =>
  fns.reduceRight((acc, val) => () => val(acc(...arg)))();

export const curryLeft = (fn, ...curriedArgs) => (...args) =>
  fn(...curriedArgs, ...args);

export const curryRight = (fn, ...curriedArgs) => (...args) =>
  fn(...args, ...curriedArgs);

export const randomInt = int => Math.floor(Math.random() * int);

export const random100 = () => randomInt(100);

export const calcMeleeDamage = ({ attacker: { damage }, target }) => {
  const val = randomInt(damage[1] - damage[0] + 1) + damage[0] - target.defense;
  return val >= 0 ? val : 0;
};

export const rawHit = ({ chanceModifier }, { attacker, target }) =>
  chanceModifier() + target.evansion <= attacker.melee;

export const rawDamage = ({ damageCalc }, { attacker, target }) => {
  return {
    target: {
      ...target,
      life: target.life - damageCalc({ attacker, target })
    },
    attacker
  };
};

export const rawAttack = ({ hitCalc, damageCalc }, battle) => {
  if (hitCalc(battle)) {
    return damageCalc(battle);
  } else {
    return battle;
  }
};

export const rawMessage = (oldBattle, battle) => {
  if (player !== newState.target) {
    console.log(
      `${newState.attacker.name} hits ${newState.target.name} for ${Math.abs(
        newState.target.life - this.state.player.life
      )} damage!`
    );
  } else {
    console.log(`${newState.attacker.name} misses!`);
  }
};
