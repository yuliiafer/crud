import { Button } from './Button';
import video2 from '../video/video2.mp4';
function HeroSection() {
  return (
    <div className='hero-container'>
      <video src={video2} autoPlay loop muted />
      <h1>Music World</h1>
      <p>Only for autorized users</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          Log In
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;