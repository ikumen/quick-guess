import { useContext } from "react";
import { GameContext } from "./GameContext";

export default function CountDownDisplay() {
  const gameCtx = useContext(GameContext);
  return (
    <div className="w-20 tc">
      {(gameCtx.timeRemaining && gameCtx.timeRemaining > 0) 
        ? <span className="black-20 count-down f-6 fw7">{ gameCtx.timeRemaining }</span>
        : ''
      }
    </div>
  );
}

