import { useContext, useEffect, useRef, useState } from "react";
import './Drawing.css';
import { GameContext, GameState } from "../components/GameContext";
import { Fn } from "../helpers";

export type Point = {
  x: number,
  y: number
}

export type Drawing = {
  strokes: Array<Point>[];
}

export type DrawingProps = {
  frameRate?: number,
  onDone: Fn
}

interface Stroke {
  index: number,
  point: number   
}

export function DrawingCanvas({frameRate = 10, onDone} : DrawingProps) {
  const gameContext = useContext(GameContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stroke, setStroke] = useState<Stroke>({index: 0, point: 0});
  const [frameCount, setFrameCount] = useState<number>(0);

  function draw(ctx: CanvasRenderingContext2D) : Stroke | undefined { 
    if (!gameContext.drawing) return;
  
    let newStroke;
    if (stroke.point < gameContext.drawing.strokes[stroke.index].length) {
      const {x, y} = gameContext.drawing.strokes[stroke.index][stroke.point];
      if (stroke.point === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      newStroke = {point: stroke.point + 1, index: stroke.index};
    } else {
      newStroke = {point: 0, index: stroke.index + 1};
    }
    setStroke(newStroke);
    return newStroke;
  }

  /**
   * Called whenever a new drawing is available in the upstream GameContext.
   */
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !gameContext.drawing) return;
    // Clear any previous drawings, configure drawing attributes
    ctx.clearRect(0,0, 300, 300);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    // Reset the stroke (index and point index), this along with 
    // frameCount will trigger the drawing hook.
    setStroke({index: 0, point: 0});
    // Reset frameCount, used to animate the drawing process and
    // allows us to control the fps.
    setFrameCount(0);
  }, [gameContext.drawing]);


  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    requestAnimationFrame(() => {
      if (gameContext.state !== GameState.PLAYING) return;

      if (frameCount >= Math.round(60 / frameRate)) {
        if (gameContext.drawing && stroke.index < gameContext.drawing.strokes.length) {
          const newStroke = draw(ctx);
          if (newStroke && newStroke.index >= gameContext.drawing.strokes.length) {
            // console.log('finished drawing stroke.index=', stroke.index, new Date())
            onDone();
            return;
          }
        }
        setFrameCount(0);
      } else {
        setFrameCount(frameCount + 1);
      }  
    });
  }, [frameCount, stroke])

  return (
    <div className="Drawing-canvas-wrap w-100 tc">
      <canvas
        width="300"
        height="280"
        className="Drawing-canvas"
        ref={canvasRef}>
          Your browser does not support canvas
      </canvas>
    </div>
  )
}
