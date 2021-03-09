import { useParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { useState, useEffect } from "react";
import Item from "../components/Item";
import { PRODUCTS_PATH } from "../utils/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const http = useAxios();
  const [submitting, setSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [success, setSuccess] = useState(null);

  const productSchema = yup.object().shape({
    title: yup.string().required("Please provide a title"),
    price: yup.number().required("Please provide a price"),
    description: yup.string().required("Please provide a description"),
    image_url: yup.string().required("Please provide an image url"),
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(productSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setUpdateError(null);

    console.log(data);

    try {
      const response = await http.put(`${PRODUCTS_PATH}/${id}`, data);
      console.log("response", response.data);
      setProduct(response.data);
      setSuccess(true);
    } catch (error) {
      console.log("error", error);
      setUpdateError(error.toString());
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await http.get(`${PRODUCTS_PATH}/${id}`);
        console.log(response);
        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);

  if (!product) {
    return <p>loading product</p>;
  }

  return (
    <>
      <h1>Edit Product</h1>
      <Item {...product} />
      <form onSubmit={handleSubmit(onSubmit)}>
        {updateError && <p>{updateError}</p>}
        <fieldset disabled={submitting}>
          <div>
            <input
              name="title"
              placeholder="Title"
              ref={register}
              defaultValue={product.title}
            />
            {errors.title && <p>{errors.identifier.message}</p>}
          </div>

          <div>
            <input
              name="price"
              placeholder="Price"
              defaultValue={product.price}
              ref={register}
              type="number"
            />
            {errors.price && <p>{errors.price.message}</p>}
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Description"
              defaultValue={product.description}
              ref={register}
              type="text"
            />
            {errors.description && <p>{errors.description.message}</p>}
          </div>
          <div>
            <input
              name="image_url"
              placeholder="Image URL"
              ref={register}
              defaultValue={product.image_url}
              type="text"
            />
            {errors.image_url && <p>{errors.image_url.message}</p>}
          </div>

          <button type="submit">
            {submitting ? "Updating ..." : "Update"}
          </button>
          <div>
            {success ? <p>Listing of {product.title} was updated</p> : null}
          </div>
        </fieldset>
      </form>
      ;
    </>
  );
};

export default EditProduct;
