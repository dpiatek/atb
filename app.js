import React from "react";
import ReactDOM from "react-dom";

import {
  rawAttack,
  rawDamage,
  rawHit,
  calcMeleeDamage,
  random100,
  curryLeft
} from "./index";

const hitCalc = curryLeft(rawHit, { chanceModifier: random100 });
const damageCalc = curryLeft(rawDamage, { damageCalc: calcMeleeDamage });
const attack = curryLeft(rawAttack, { hitCalc, damageCalc });

const player = {
  name: "Cloud",
  melee: 80, // to hit
  damage: [20, 30], // damage
  evansion: 20, // reduces to hit
  defense: 10, // reduces damage,
  life: 40 // hp
};

const slime = {
  name: "Slime",
  melee: 70, // to hit
  damage: [11, 15], // damage
  evansion: 5, // reduces to hit
  defense: 25, // reduces damage,
  life: 20 // hp
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: props.player,
      enemy: props.enemy
    };
  }

  attackPlayer = () => {
    const { player, enemy } = this.state;
    const newState = attack({ attacker: enemy, target: player });

    if (player !== newState.target) {
      console.log(
        `${newState.attacker.name} hits ${newState.target.name} for ${Math.abs(
          newState.target.life - this.state.player.life
        )} damage!`
      );
    } else {
      console.log(`${newState.attacker.name} misses!`);
    }

    this.setState(() => ({
      player: newState.target,
      enemy: newState.attacker
    }));
  };

  attackEnemy = () => {
    const { player, enemy } = this.state;
    const newState = attack({ attacker: player, target: enemy });

    if (player !== newState.target) {
      console.log(
        `${newState.attacker.name} hits ${newState.target.name} for ${Math.abs(
          newState.target.life - this.state.enemy.life
        )} damage!`
      );
    } else {
      console.log(`${newState.attacker.name} misses!`);
    }

    this.setState(() => ({
      player: newState.attacker,
      enemy: newState.target
    }));
  };

  render() {
    return (
      <React.Fragment>
        <pre>{JSON.stringify(this.state.player)}</pre>
        <pre>{JSON.stringify(this.state.enemy)}</pre>
        <button onClick={this.attackEnemy}>Player action</button>
        <button onClick={this.attackPlayer}>Enemy action</button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <App player={player} enemy={slime} />,
  document.getElementById("app")
);
