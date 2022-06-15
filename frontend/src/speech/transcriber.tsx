import { Fn } from "../helpers";

export type Transcriber = {stop: Fn, start: Fn, isOn: () => boolean};

export function transcriber({fetchApiKey, onMessage, onStart, onStop, onError} : {
  fetchApiKey: () => string|undefined, 
  onMessage: (ev: MessageEvent) => void, 
  onStart: Fn,
  onStop: Fn,
  onError: (err?: any) => void
}) {
  
  let audioRecorder : MediaRecorder;
  let socket : WebSocket;

  function stop() {
    //console.log('trying to stop transcriber')
    if (socket && socket.readyState === WebSocket.OPEN) socket.close();
    if (audioRecorder && audioRecorder.state !== 'inactive') audioRecorder.stop();
    if (onStop) onStop();
  }

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    audioRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm'
    });

    const apiKey = fetchApiKey();
    if (!apiKey) {
      onError('Unable to get apikey');
      return;
    }

    socket = new WebSocket('wss://api.deepgram.com/v1/listen', ['token', apiKey]);
    socket.addEventListener('close', function() {
      if (audioRecorder) {
        audioRecorder.stream.getTracks().forEach(track => track.stop());
        if (audioRecorder.state !== 'inactive') audioRecorder.stop();
      }
      if (onStop) onStop();
    });

    socket.addEventListener('open', function() {
      audioRecorder.addEventListener('dataavailable', function(evt: BlobEvent) {
        if (evt.data.size && socket && socket.readyState === WebSocket.OPEN)
          socket.send(evt.data);
      });
      audioRecorder.start(500);
      if (onStart) onStart();
    });

    socket.addEventListener('message', onMessage);
  }

  return {
    start,
    stop,
    isOn: () => audioRecorder && audioRecorder.state === 'recording'
  }
}