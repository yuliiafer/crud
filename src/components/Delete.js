import { useState } from "react";
import useAxios from "../utils/useAxios";
import { PRODUCTS_PATH } from "../utils/constants";
import Item from "./Item";

export default function DeleteProduct({ id }) {
  const [error, setError] = useState(null);
  const http = useAxios();
  const url = `${PRODUCTS_PATH}/${id}`;
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete this post ${Item.title}?`);
    if (confirmDelete) {
      try {
        await http.delete(url);
        alert(`Product #${id} has been deleted.`);
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <button
      type="button"
      classname="delete"
      onClick={() => handleDelete({ id })}
    >
      {error ? "Error" : "Delete"}
    </button>
  );
}
