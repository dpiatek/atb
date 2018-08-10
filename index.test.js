const { attack, hit, compose } = require("./index");

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

describe("compose", () => {
  it("composes a single function", () => {
    const f = jest.fn();
    const g = jest.fn();
    const composed = compose(
      f,
      g
    );
    composed();
    expect(f).toHaveBeenCalledTimes(1);
    expect(g).toHaveBeenCalledTimes(1);
  });
});

describe("basics", () => {
  it("successfully attacks", () => {
    const noMultiplierHit = hit.bind(this, () => 0);

    expect(attack(player, slime, noMultiplierHit).attacker).toBe(player);
    expect(attack(player, slime, noMultiplierHit).target).toEqual({
      ...slime,
      life: 15
    });
  });

  it("fails an attack and returns the same data", () => {
    const fullMultiplierHit = hit.bind(this, () => 100);

    expect(attack(player, slime, fullMultiplierHit).attacker).toBe(player);
    expect(attack(player, slime, fullMultiplierHit).target).toBe(slime);
  });
});
