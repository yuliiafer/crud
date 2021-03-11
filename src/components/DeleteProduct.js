import { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import { PRODUCTS_PATH } from "../utils/constants";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

const DeleteProduct = async () => {
  const [error, setError] = useState(null);
  const [render, setRender] = useState([]);
  const [deleted, setDelete] = useState(false);
  const { id } = useParams();
  const http = useAxios();
  const history = useHistory();

    setDelete(true);
    setError(null);
    console.log(id);
    const confirmDelete = window.confirm(`Delete this post ${id}?`);
    if (confirmDelete) {
      try {
        const response = await http.delete(`${PRODUCTS_PATH}/${id}`);
        console.log(response.data);
        alert(`${id} has been deleted.`);
      } catch (error) {
        setError(error);
      } finally {
        setRender(render + 1);
      }
    } else {
        history.push("/products");
    }
  
  useEffect(() => {
    const setRender = async () => {
      try {
        const response = await http.delete(`${PRODUCTS_PATH}/${id}`);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    setRender();
    // eslint-disable-next-line
  }, []);

  return (
    <div disabled={deleted}>
        {error}
      <button type="button" onClick={() => setDelete(id)}>
        {deleted ? "deleting" : "Delete"}
      </button>
    </div>
  );
};

export default DeleteProduct;
