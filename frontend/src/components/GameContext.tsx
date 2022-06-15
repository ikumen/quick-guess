import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Drawing, Point } from "./Drawing";
import { Fn, NoOp, shuffleArray } from "../helpers";

export enum GameState {
  INIT,        // load this app and start fetching word list
  READY,       // wait for UI to initiate a game
  PLAYING,
  PLAYAGAIN,
  OVER
}

export type GameContextType = {
  state: GameState,
  drawing?: Drawing,
  turns: Turn[],
  turn?: Turn,
  timeRemaining?: number,
  start: Fn,
  stop: Fn,
  newTurn: Fn,
  guess: (guess: string) => void,
  beginTimer: Fn,
  
}

export const GameContext = React.createContext<GameContextType>({
  state: GameState.INIT,
  turns: [],
  start: NoOp,
  stop: NoOp,
  newTurn: NoOp,
  guess: NoOp,
  beginTimer: NoOp
});

export enum TurnState {
  Lost, Won
}

export type Turn = {
  word: string,
  guesses: Set<string>,
  state?: TurnState
}

export type GameProviderProps = {
  failAllowed?: number
}

export function GameProvider({children, failAllowed = 3}: PropsWithChildren<GameProviderProps>) {
  const [ state, setState ] = useState<GameState>(GameState.INIT);
  const [ drawing, setDrawing ] = useState<Drawing>();
  const [ timeRemaining, setTimeRemaining ] = useState<number>();
  const [ turn, setTurn ] = useState<Turn>();
  const words = useRef<string[]>([]);
  const turns = useRef<Turn[]>([]);
  const intervalId = useRef<number>();

  function cleanUp() {
    //console.log('Cleaning up gamectx');
    window.clearInterval(intervalId.current);
    setTimeRemaining(undefined);
  }

  useEffect(() => {
    async function fetchWords() {
      const data = await fetch(`/api/drawings/words`).then(resp => resp.json());
      words.current.push(...data);
      setState(GameState.READY);
    }
    fetchWords();
    return cleanUp;
  }, []);

  useEffect(() => {
    if (state === GameState.PLAYING && turns.current.length === 0) {
      // kick start the very first turn
      // console.log('state updated to PLAYING');
      newTurn();
    }
  }, [state]);

  function start() {
    shuffleArray(words.current);
    setState(GameState.PLAYING);
    turns.current = [];
  }

  function newTurn() {
    if (state !== GameState.PLAYING) return;
    if (turns.current.length === words.current.length
        || getFailedTurnCount() >= 3) {
      // console.log('newTurn() ends state=>OVER')
      setState(GameState.OVER);
    } else {
      const word = words.current[turns.current.length];
      //console.log('newTurn(): state is and turns good, word=', word, ' words=', words.current)
      setTurn({word, guesses: new Set<string>()});
      setState(GameState.PLAYING);
      loadDrawing(word);
    }
  }

  function loadDrawing(word: string) {
    fetch(`/api/drawings/random?word=${word}`)
      .then(resp => resp.json())
      .then(({drawing} : {drawing: number[][][]}) => drawing.map(s => s[0].map((x, i) => ({x, y: s[1][i]}))))
      .then((strokes: Array<Point>[]) => setDrawing({strokes}));
  }

  function getFailedTurnCount() {
    return turns.current.reduce((p, turn) => turn.state === TurnState.Lost ? p + 1 : p, 0);
  }

  const guess = (guess: string) => {
    // console.log('got guess:', guess, ', state:', state, ', timeremain:', timeRemaining, ', ');
    if (!drawing || state !== GameState.PLAYING) return;
    // console.log('in guess(): checking turn state')
    if (!turn) return;
    if (turn.state !== undefined) return;
    if (turn.guesses.has(guess)) {
      timesUp();
      return;
    }
    
    turn.guesses.add(guess);
    setTurn({...turn, guesses: turn.guesses});
  }

  const beginTimer = (n: number = 10) => {
    timer(n);
  }

  const stopTimer = () => {
    setTimeRemaining(undefined);
    window.clearInterval(intervalId.current);
  }

  const timesUp = () => {
    stopTimer();
    if (turn) {
      turn.state = turn.guesses.has(turn.word) ? TurnState.Won : TurnState.Lost;
      setTurn({...turn});
      turns.current.push(turn);
    }

    window.setTimeout(() => {
      newTurn();
    }, 2000);
  }
  
  const timer = (n: number) => {
    intervalId.current = window.setInterval(() => {
      setTimeRemaining(n);
      if (n-- < 1 || (turn && turn.guesses.has(turn.word))) timesUp();
    }, 1000);
  }

  const stop = () => {
    stopTimer();
    setState(GameState.OVER);
  }

  const defaultContext : GameContextType = {
    state,
    drawing,
    turns: turns.current,
    turn,
    timeRemaining,
    start,
    newTurn,
    guess,
    beginTimer,
    stop
  }

  return (
    <GameContext.Provider value={defaultContext}>
      {children}
    </GameContext.Provider>
  );
}

