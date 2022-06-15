import { useContext } from "react";
import { GameContext } from "./GameContext";

export default function Guesses() {
  const gameCtx = useContext(GameContext);
  const turn = gameCtx.turn;
  const guessLabels: JSX.Element[] = [
    // <span key='g1' className={'mr2'}>car</span>,
    // <span key='g2' className={'mr2'}>baseball</span>,
    // <span key='g3' className={'mr2'}>tree</span>,
  ];
  if (turn) {
    turn.guesses.forEach(guess => 
      guessLabels.push(<span key={guess} className={guess === turn.word ? 'bg-green fw7 white mr2 pv2 ph3' : 'mr2'}>{guess}</span>));
  }
  return (
    <div className="w-100 tc mt4 ph6-ns ph5-m ph2 black-70">
      {guessLabels}
    </div>
  );
}
