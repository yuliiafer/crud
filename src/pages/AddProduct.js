import useAxios from "../utils/useAxios";
import { useState } from "react";
import { PRODUCTS_PATH } from "../utils/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../utils/schema";
import { useHistory } from "react-router-dom";

const AddProduct = () => {
  const [submitting, setSubmitting] = useState(false);
  const [postError, setPostError] = useState(null);
  const history = useHistory();
  const http = useAxios();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(productSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setPostError(null);
    console.log(data);
    data.status = "publish";

    if (data === "") {
      data = null;
    }
    try {
      const response = await http.post(`${PRODUCTS_PATH}`, data);
      console.log("response", response.data);
      history.push("/add");
    } catch (error) {
      console.log("error", error);
      setPostError(error.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={submitting}>
          {postError && <p className="error">Something was wrong...</p>}
          <div>
            <input name="title" placeholder="Title" ref={register} />
            {errors.title && <p>{errors.title.message}</p>}
          </div>

          <div>
            <input
              name="price"
              placeholder="Price"
              ref={register}
              type="number"
            />
            {errors.price && <p>{errors.price.message}</p>}
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Description"
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
              type="text"
            />
            {errors.image_url && <p>{errors.image_url.message}</p>}
          </div>

          <button type="submit">{submitting ? "Adding ..." : "Add"}</button>
        </fieldset>
      </form>
    </>
  );
};

export default AddProduct;
