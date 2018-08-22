/*
 *  Copyright: (c) 2018, Dominik Piatek <do.piatek@gmail.com>
 *  GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 *
*/

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
  life: 40, // hp
  speed: 8
};

const slime = {
  name: "Slime",
  melee: 70, // to hit
  damage: [11, 15], // damage
  evansion: 5, // reduces to hit
  defense: 25, // reduces damage,
  life: 20, // hp,
  speed: 5
};

const tick = (state, update) => {
  const {
    player: { speed: playerSpeed },
    enemy: { speed: enemySpeed },
    atb
  } = state();

  const newPlayerSpeed = atb.player + playerSpeed;
  const newEnemySpeed = atb.enemy + enemySpeed;

  if (newPlayerSpeed !== 100 || newEnemySpeed !== 100) {
    update({
      player: newPlayerSpeed >= 100 ? 100 : newPlayerSpeed,
      enemy: newEnemySpeed >= 100 ? 100 : newEnemySpeed
    });
  }
};

// tickMs -> currentState -> newState
// pulse(100, staticData).map(data => calculateAtb(data))

// const pulse = () => {
//   return {
//     map: callback => {}
//   };
// };

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: props.player,
      enemy: props.enemy,
      messages: [],
      atb: {
        player: 0,
        enemy: 0
      }
    };
  }

  timeoutId = null;

  startBattle = () => {
    this.timeoutId = setInterval(tick, 100, this.fetchState, this.updateAtb);
  };

  resetBattle = () => {
    clearInterval(this.timeoutId);

    this.updateAtb({
      player: 0,
      enemy: 0
    });
  };

  fetchState = () => {
    return this.state;
  };

  updateAtb = atb => {
    this.setState(s => ({
      ...s,
      atb
    }));
  };

  attack = config => {
    const [attacker, target] = config;
    const ns = attack({
      attacker: this.state[attacker],
      target: this.state[target]
    });

    this.setState(s => ({
      [attacker]: ns.attacker,
      [target]: ns.target,
      messages: [...s.messages, ns.result.message],
      atb: {
        ...s.atb,
        [attacker]: 0
      }
    }));
  };

  render() {
    const { player, enemy, atb, messages } = this.state;
    const playerEnabled = atb.player === 100;
    const enemyEnabled = atb.enemy === 100;

    return (
      <React.Fragment>
        <button onClick={this.startBattle}>Start battle</button>
        <button onClick={this.resetBattle}>Reset battle</button>
        <button
          disabled={!playerEnabled}
          onClick={this.attack.bind(this, ["player", "enemy"])}
        >
          Player action
        </button>
        <progress name="player" max="100" value={atb.player} />
        <button
          disabled={!enemyEnabled}
          onClick={this.attack.bind(this, ["enemy", "player"])}
        >
          Enemy action
        </button>
        <progress name="enemy" max="100" value={atb.enemy} />
        <pre>{JSON.stringify(player)}</pre>
        <pre>{JSON.stringify(enemy)}</pre>
        <ol>
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ol>
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <App player={player} enemy={slime} />,
  document.getElementById("app")
);
