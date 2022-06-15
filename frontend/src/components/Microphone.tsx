export default function Microphone({enabled} : {enabled: boolean}) {
  const style = enabled ? 'App-microphone App-microphone-enabled' : 'App-microphone';
  return (
    <div className={`w-100 tc`}>
        <img className={`mic pv4 ph3 ${style}`} src={`/static/outline_mic_${enabled ? '' : 'off_'}black_48dp.png`}></img>
    </div>
  )
}
