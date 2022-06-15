import { useContext } from "react";
import { GameContext } from "./GameContext";

export default function GameOver({playAgain} : {playAgain: () => void}) {
  const gameCtx = useContext(GameContext);  
  const correctGuesses = gameCtx.turns.reduce((p, turn) => turn.guesses.has(turn.word) ? p + 1 : p, 0);
  const isWon = correctGuesses === gameCtx.turns.length;
  return (
    <div className="w-100 tc mt2 ph6-ns ph5-m ph2 flex justify-between items-center">
      <div className="w-50">
        <h2 className="mt4">{isWon ? 'You Win' : 'Game Over'}</h2>
        <div className="w-100 tc mv3">
          <span className="bg-yellow pv2 ph3 fw7 f2">{correctGuesses}</span> 
        </div>
        {isWon 
          ? <div className="w-100 tc mv3">
            Congrats, you've guessed all {correctGuesses} drawings correctly!
          </div>
          : <div className="w-100 tc mv3">
              {correctGuesses > 15 
                ? "Wow, you did great!"
                : correctGuesses < 5
                  ? "Keep at it!"
                  : "Good job!"
            } You guessed {correctGuesses} {correctGuesses === 1 ? 'drawing' : 'drawings'} correctly!
          </div>
        }
        <div className="w-100 tc mv4">
          <span onClick={playAgain} className="ph4 pv2 fw7 pointer bg-light-blue dim">Play Again</span>
        </div>  
      </div>
      <div className="w-50">
        <ul className="list w-100 tc ma0 pt3 pa0">
          {gameCtx.turns.map((turn, i) => <li key={i} className={!turn.guesses.has(turn.word) ? 'black-40 fw6' : 'black fw7 f4'}>{turn.word}</li>)}
        </ul>

      </div>
    </div>
  );
}
