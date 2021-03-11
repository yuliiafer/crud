import * as yup from "yup";

export const loginSchema = yup.object().shape({
  identifier: yup.string().required("Please enter your username"),
  password: yup.string().required("Please enter your password"),
});

export const productSchema = yup.object().shape({
  title: yup.string().required("Please provide a title"),
  price: yup.number().required("Please provide a price"),
  description: yup.string().required("Please provide a description"),
  image_url: yup.string().required("Please provide an image url"),
});
