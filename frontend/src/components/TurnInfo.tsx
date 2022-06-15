import { useContext } from "react";
import { getRandomInt } from "../helpers";
import { GameContext, Turn, TurnState } from "./GameContext";

const wonMsgs = [
  "Great guess, how did you know?",
  "Wow, that was impressive!",
  "You got it, keep going!",
  "Good job!",
];

const lostMsgs = [
  "Good effort, don't give up!",
  "Try again!",
  "It's OK, that was a hard one",
  "Good try, you'll get the next one"
];

export default function TurnInfo() {
  const gameCtx = useContext(GameContext);
  const turn = gameCtx.turn;
  if (turn && turn.state !== undefined) {
    return <div className="w-20 f4 fw6 tl">
      {turn.state === TurnState.Won
        ? <div>
            <div className="f-6 fw7 green">&#10004;</div>
              {wonMsgs[getRandomInt(wonMsgs.length)]}
          </div>
        : <div>
            <div className="f-6 fw7 red">&#x2718;</div>
              {lostMsgs[getRandomInt(lostMsgs.length)]}
          </div>
      }
    </div>
  } else {
    return <div className="w-20 tl f1"></div>
  }
}

