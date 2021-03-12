import { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { useEffect, useState } from "react";
import Item from "../components/Item";
import { PRODUCTS_PATH } from "../utils/constants";
import Loading from "../components/Loading";

const Products = () => {
  const [auth] = useContext(AuthContext);
  const history = useHistory();
  const [products, setProducts] = useState(null);
  const http = useAxios();
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await http.get(PRODUCTS_PATH);
        console.log(response);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
    // eslint-disable-next-line
  }, []);
  if (!auth) {
    history.push("/login");
  }
  if (!products) {
    return <Loading />;
  }
  return (
    <>
      <h1>Products</h1>
      {products.map((product) => {
        return (
          <Link key={product.id} to={`/edit/${product.id}`}>
            <Item {...product} />
          </Link>
        );
      })}
    </>
  );
};

export default Products;
