function randomInt(int) {
  return Math.floor(Math.random() * int);
}

function compose(...fns) {
  return arg => {
    fns.reduceRight((acc, val) => {
      console.log(acc.name, val.name);
      return acc(val);
    });
  };
}

// state of the world
// events log/queue?
// event happens
// - name of event and necesarry data (ids)
// a subscriber picks it up and fetches data
// executes the action and a new event with changes to given data
// another subscriber picks it up and applies to the state of the world

function hit(multiplier, attacker, target) {
  return multiplier(100) + target.evansion <= attacker.melee;
}

function damage(attacker, target) {
  return {
    target: {
      ...target,
      life: target.life - (attacker.damage - target.defense)
    },
    attacker
  };
}

function attack(attacker, target, toHit) {
  if (toHit(attacker, target)) {
    return damage(attacker, target);
  } else {
    return { attacker, target };
  }
}

module.exports = { hit, damage, attack, compose };
