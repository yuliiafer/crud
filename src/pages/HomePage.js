import { useEffect } from 'react';
import { BASE_URL, PRODUCTS_PATH } from '../utils/constants';
import axios from 'axios';
import HeroSection from '../components/HeroSection';

const HomePage = () => {
  useEffect(() => {
    axios
      .get(`${BASE_URL}${PRODUCTS_PATH}`)
      .then(response => console.log(response));
  }, []);
  
  return (
    <>
      <HeroSection />
    </>
  );
};

export default HomePage;