import { useState } from "react";
import useAxios from "../utils/useAxios";
import { PRODUCTS_PATH } from "../utils/constants";
import Item from './Item';
import { useParams } from "react-router-dom";

const DeleteProduct = () => {
  const [error, setError] = useState(null);
  const [render, setRender] = useState([]);
  const http = useAxios();
  const { id } = useParams();
  const handleDelete = async () => {
    
    const confirmDelete = window.confirm(`Delete this post ${Item.title}?`);
    if (confirmDelete) {
      try {
        const response = await http.delete(`${PRODUCTS_PATH}/${id}`);
        console.log(response);
        alert(`${Item.title} has been deleted.`);
        
      } catch (error) {
        setError(error);
      } finally {
        setRender(render + 1);
      }
    }
    Item();
  };
  handleDelete();


  return (
    <>
     {id.map((item) => {
         
         return (<><p>{item.title}</p>
                         <button type="button" onClick={() => handleDelete(item.id)}>
              {error ? "Error" : "Delete"}
            </button>
            </>
         );
         

     })}
        

       
      
    </>
  );
};

export default DeleteProduct;
