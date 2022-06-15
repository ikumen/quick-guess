import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="w-100 flex justify-between items-center">
      <div className="fl w-20 f5 f4-m f4-ns fw7"><Link to={"/"} className="fl no-underline">&lt; back</Link></div>
      <h3 className="f4 ">
        <span className="bg-yellow lh-copy near-black ph4 pv2 tracked-tight no-wrap">
          Quick, Guess!
        </span>
      </h3>
      <div className="w-20 tr f5 f4-m f4-ns fw7 mr1"><a href="https://github.com/kellychen04/quick-guess" target="_new" className="no-underline">about</a></div>
    </div>
  );
}
