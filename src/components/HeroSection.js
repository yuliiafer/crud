import video2 from "../video/video2.mp4";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="hero-container">
      <video src={video2} autoPlay loop muted />
      <h1>Music World</h1>
      <p>Only for autorized users</p>
      <div className="hero-btns">
        <Link to="/login">
          <button className="btn--outline btn--medium">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
