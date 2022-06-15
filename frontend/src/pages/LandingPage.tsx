import { Link } from "react-router-dom";

export default function LandingPage () {
  return <>
    <div className="w-100">
      <h3 className="f2 tc mt5-ns mt2">
        <span className="bg-yellow lh-copy near-black ph4 pv2 tracked-tight">
          Quick, Guess!
        </span>
      </h3>
    </div>
    <div className="w-100 tc mt4 ph6-ns ph5-m ph2">
      Welcome to <span className="b">Quick, Guess</span>. A guessing game similiar to pictionary, but you do the guessing while the computer
      does the drawing. The computer listens to your guesses using <a href="https://deepgram.com/" target="_new">Deepgram's Speech-to-text API</a> and draws pictures using the <a href="https://github.com/googlecreativelab/quickdraw-dataset" target="_new">Quick, Draw!</a>  data set. 
    </div>
    <div className="w-100 tc mt5 flex justify-center f3 fw6">
      <Link to="/quick-guess" className="no-wrap near-black no-underline ph4 pv2 bg-light-blue dim">
        Play!
      </Link>
    </div> 
    <div className="w-100 tc mt2 i black-60 f5 ph6-ns ph5-m ph2">
        Note: this game requires the use of your devices microphone and speaker.
    </div>
    <div className="bottom-1 absolute right-1 pointer dim dn" onClick={() => console.log('hello')}>
      <img src="/static/outline_egg_black_36dp.png" height="48"></img>
    </div>
  </>;
}
