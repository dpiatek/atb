import React from "react";
import ReactDOM from "react-dom";

import {
  rawDamage,
  rawHit,
  calcMeleeDamage,
  random100,
  curryLeft,
  compose,
  eitherOr,
  identity,
  message
} from "./index";

const hitCalc = curryLeft(rawHit, { chanceModifier: random100 });
const damageCalc = curryLeft(rawDamage, { damageCalc: calcMeleeDamage });

const damageOrMiss = eitherOr(
  action => action.result.hit,
  damageCalc,
  identity
);

const attack = compose(
  message,
  damageOrMiss,
  hitCalc
);

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
      enemy: props.enemy,
      messages: []
    };
  }

  attackPlayer = () => {
    const { player, enemy } = this.state;
    const newState = attack({ attacker: enemy, target: player });

    this.setState(() => ({
      player: newState.target,
      enemy: newState.attacker,
      messages: [...this.state.messages, newState.result.message]
    }));
  };

  attackEnemy = () => {
    const { player, enemy } = this.state;
    const newState = attack({ attacker: player, target: enemy });

    this.setState(() => ({
      player: newState.attacker,
      enemy: newState.target,
      messages: [...this.state.messages, newState.result.message]
    }));
  };

  render() {
    return (
      <React.Fragment>
        <pre>{JSON.stringify(this.state.player)}</pre>
        <pre>{JSON.stringify(this.state.enemy)}</pre>
        <p>{this.state.message}</p>
        <ol>
          {this.state.messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ol>
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
