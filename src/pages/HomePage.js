import { useEffect } from 'react';
import { BASE_URL, PRODUCTS_PATH } from '../utils/constants';
import axios from 'axios';
const HomePage = () => {
  useEffect(() => {
    axios
      .get(`${BASE_URL}${PRODUCTS_PATH}`)
      .then(response => console.log(response));
  }, []);
  return (
    <>
      <h1>Homepage</h1>
    </>
  );
};

export default HomePage;