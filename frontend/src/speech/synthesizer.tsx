
export type Synthesizer = {cancel: () => void, speak: (props: SpeakProps) => void};

export type SpeakProps = {
  msg: string,
  onend: (this: SpeechSynthesisUtterance, evt: SpeechSynthesisEvent) => any,
  onerror: (this: SpeechSynthesisUtterance, evt: SpeechSynthesisErrorEvent) => any
}

export function synthesizer() {
  let synth = window.speechSynthesis;
  let voices : SpeechSynthesisVoice[];

  const getVoices = () => voices = synth.getVoices();

  getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
   window.speechSynthesis.onvoiceschanged = getVoices;
  }
  
  const speak = ({msg, onend, onerror} : SpeakProps) => {
    if (synth.speaking) {
      console.warn('already speaking...'); return;
    }

    var utter = new SpeechSynthesisUtterance(msg);
    if (onend) utter.onend = onend;
    if (onerror) utter.onerror = onerror;
    utter.voice = voices[0];
    utter.rate = 1;
    synth.speak(utter);
  }

  return {
    speak,
    cancel: () => {
      if (synth) synth.cancel();
    }
  }
}
