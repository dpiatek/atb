const {
  rawHit,
  rawDamage,
  rawAttack,
  calcMeleeDamage,
  compose,
  curryLeft,
  curryRight
} = require("./index");

const player = {
  name: "Cloud",
  melee: 80, // to hit
  damage: 20, // damage
  evansion: 20, // reduces to hit
  defense: 10, // reduces damage,
  life: 40 // hp
};

const slime = {
  name: "Slime",
  melee: 70, // to hit
  damage: 20, // damage
  evansion: 5, // reduces to hit
  defense: 15, // reduces damage,
  life: 20 // hp
};

const battle = {
  attacker: player,
  target: slime
};

describe("compose", () => {
  it("calls 1 function", () => {
    const f = jest.fn();

    const composed = compose(f);
    composed();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("calls 4 functions", () => {
    const f = jest.fn();
    const g = jest.fn();
    const h = jest.fn();
    const i = jest.fn();

    const composed = compose(
      f,
      g,
      h,
      i
    );
    composed();
    expect(f).toHaveBeenCalledTimes(1);
    expect(g).toHaveBeenCalledTimes(1);
    expect(h).toHaveBeenCalledTimes(1);
    expect(i).toHaveBeenCalledTimes(1);
  });

  it("calls both functions in right order", () => {
    const f = jest.fn(v => "A" + v);
    const g = jest.fn(v => v);

    const composed = compose(
      f,
      g
    );
    const result = composed("B");
    expect(result).toBe("AB");
    expect(f).toHaveBeenCalledWith("B");
  });

  it("supports multiple args", () => {
    const f = jest.fn(v => "A" + v);
    const g = jest.fn((x, y, z) => x + y + z);

    const composed = compose(
      f,
      g
    );
    const result = composed("B", "C", "D");
    expect(result).toBe("ABCD");
  });
});

describe("attack", () => {
  it("succeceds and returns updated data for target", () => {
    const alwaysHit = () => -1000;
    const hitCalc = curryLeft(rawHit, { chanceModifier: alwaysHit });
    const damageCalc = curryLeft(rawDamage, { damageCalc: calcMeleeDamage });
    const alwaysHitAttack = curryLeft(rawAttack, { hitCalc, damageCalc });

    expect(alwaysHitAttack(battle).attacker).toBe(player);
    expect(alwaysHitAttack(battle).target).toEqual({
      ...slime,
      life: 15
    });
  });

  it("fails an attack and returns the same data", () => {
    const neverHit = () => 1000;
    const hitCalc = curryLeft(rawHit, { chanceModifier: neverHit });
    const damageCalc = curryLeft(rawDamage, { damageCalc: calcMeleeDamage });
    const neverHitAttack = curryLeft(rawAttack, { hitCalc, damageCalc });

    expect(neverHitAttack(battle).attacker).toBe(player);
    expect(neverHitAttack(battle).target).toBe(slime);
  });
});
