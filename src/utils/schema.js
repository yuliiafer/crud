import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    identifier: yup.string().required('Please enter your username'),
    password: yup.string().required('Please enter your password')
  });