import { useContext, useEffect, useRef, useState } from "react";
import CountDownDisplay from "../components/CountDownDisplay";
import { DeepgramApiKeyContext } from "../components/DeepgramApiKeyContext";
import { DrawingCanvas } from "../components/Drawing";
import { GameContext, GameState } from "../components/GameContext";
import GameOver from "../components/GameOver";
import Guesses from "../components/Guesses";
import Header from "../components/Header";
import Microphone from "../components/Microphone";
import Rules from "../components/Rules";
import TurnInfo from "../components/TurnInfo";
import { synthesizer as createSynthesizer, Synthesizer } from "../speech/synthesizer";
import { Transcriber, transcriber as createTranscriber } from "../speech/transcriber";

const skipWords = new Set<string>(['it','is','an','and','this','the','i','a','what']);

export default function QuickGuessPage() {
  const gameCtx = useContext(GameContext);
  const apiKeyCtx = useContext(DeepgramApiKeyContext);
  const isCleanUp = useRef<boolean>(false);
  const [ isMicOn, setIsMicOn ] = useState<boolean>(false);
  const [ guess, setGuess ] = useState<string>();
  
  const synthesizer = useRef<Synthesizer>(createSynthesizer());
  const transcriber = useRef<Transcriber>(
    createTranscriber({
      fetchApiKey: apiKeyCtx.key,
      onMessage: onTranscriptMessage,
      onStart: () => {
        setIsMicOn(true);
      },
      onStop: () => {
        setIsMicOn(false);
      },
      onError: () => {}
    })
  );  

  function onTranscriptMessage(evt: MessageEvent) {
    const data = JSON.parse(evt.data);
    if (data.channel.alternatives[0] && data.channel.alternatives[0].words) {
      data.channel.alternatives[0].words.forEach(({word} : any) => {
        //console.log('transcribed: ', word);
        if (!skipWords.has(word)) {
          setGuess(word);
        }
      });
    }
  }

  function startGame() {
    // console.log()
    if (!isCleanUp.current) {
      transcriber.current.start();
      setTimeout(gameCtx.start, 1000);
    }
  }

  function cleanUp() {
    // console.log('setting iscleanup');
    isCleanUp.current = true;
    transcriber.current.stop();
    synthesizer.current.cancel();
    gameCtx.stop();
  }

  useEffect(() => {
    if (guess) {
      gameCtx.guess(guess);
    }
  }, [guess]);

  useEffect(() => {
    if (gameCtx.state === GameState.READY) {
      synthesizer.current.speak({
        msg: 'Hi there! Welcome to Quick, Guess! Here are some quick rules, simply make a correct guess in 10 seconds, you are allowed 3 incorrect drawings, and good luck',
        // msg: "hello",
        onend: startGame,
        onerror: console.log
      })
    } else if (gameCtx.state === GameState.OVER) {
      transcriber.current.stop();
    } 
  }, [gameCtx.state]);

  useEffect(() => {
    return cleanUp;
  }, [])

  function buildPlayingComponent() {
    return <>
      <div className="w-100 flex items-center justify-center">
        <CountDownDisplay />
        <div className="tc">
          <DrawingCanvas onDone={gameCtx.beginTimer} />
        </div>
        <TurnInfo />
      </div>
      <Guesses />
    </>;
  }

  return <>
    <Header />
    {gameCtx.state === GameState.PLAYING 
      ? buildPlayingComponent()
      : gameCtx.state === GameState.OVER
        ? <GameOver playAgain={startGame} />
        : <Rules />
    }
      
    {gameCtx.state !== GameState.OVER && 
      <div className="w-100 tc mv4 ph6-ns ph5-m ph2">
        <Microphone enabled={transcriber.current.isOn()} />
      </div>
    }

    {/* <div className="w-100 tc">
      <button onClick={() => transcriber.current.start()}>start transcriber</button>
      <button onClick={() => transcriber.current.stop()}>stop transcriber</button>
      <button onClick={() => gameCtx.start()}>start game</button>
      <button onClick={() => gameCtx.stop()}>stop game</button>
      <button onClick={() => gameCtx.guess('butterfly')}>guess butterfly</button>
      <button onClick={() => gameCtx.guess('airplane')}>guess airplane</button>
      <button onClick={() => gameCtx.guess('cat')}>guess cat</button>
      <button onClick={() => gameCtx.guess('apple')}>apple</button>
      <button onClick={() => gameCtx.guess('bridge')}>bridge</button>
      <button onClick={() => console.log('api=', apiCtx.key())}>api</button>
    </div> */}
  </>
}


