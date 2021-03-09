# CRUD Application, Strapi

CRUD === Create, Read, Update, Delete

During this project we will:

<ul>
    <li>Authenticate ourselves to an API using JWT</li>
    <li>Make GET requests to fetch listings from the API</li>
    <li>Make POST requests to add new listings to the API</li>
    <li>Make PUT requests to update listings in the API</li>
    <li>Make DELETE requests to delete listings from the API</li>
    <li>Create Custom Hooks</li>
    <li>Protect routes from unauthorized access</li>
    <li>Make use of .env variables in react</li>
</ul>

https://www.restapitutorial.com/lessons/httpmethods.html

(we are going to use put in this example, but feel free to try patch on your own)

## Resources

Base URL: `https://hidden-mountain-52913.herokuapp.com`

Auth Path: `/auth/local`

Products Path: `/products`

Auth Details:

```
email: admin@admin.com
password: Pass1234
```

### Packages to Install:

```
yarn add axios react-hook-form @hookform/resolvers yup react-router-dom
```

## Information about the API

This is a STRAPI based API with one collection of resources "Products".

This collection can not be accessed by any unauthorized users.

Each item or 'product' in this collection have the following properties:

```
title,
price,
description,
image_url
```

## Our goal for the CRUD App:

Make an authorization request to strapi to receive a JWT token.

Use this token as authorization to interact with the API.

Allow the authorized user to add new items (CREATE).

Display a listing for each item (READ).

Allow the authorized user to update each item (UPDATE).

Allow the authorized user to delete each item (DELETE).

## Prepwork and Authentication (Lesson1)

Prerequisites: a react application free of bloat.

### Env variables

In the root of your project (outside ./src) create a .env file.

In this file, add the path resources as given at the top of the document.

```js
REACT_APP_STRAPI_URL=https://hidden-mountain-52913.herokuapp.com
REACT_APP_AUTH_PATH=/auth/local
REACT_APP_PRODUCTS_PATH=/products
```

Notice how we are not using conventional strings here.

It is also worth noting that we are prefixing each one with `REACT_APP_`

This data will be saved to a process in our Node app that we can later read from.

The main usage here is to have separate .env files for development and production, so that we don't have to change our code each each time we swap from a development to a production environment.

for more details on env files please refer to the official documentation https://create-react-app.dev/docs/adding-custom-environment-variables/

...

To call our env variables we would do something like this:

```js
process.env.REACT_APP_AUTH_PATH;
```

These .env variables are not very pretty to look at, especially with the prefix they have. What I like to do is create a file to hold constants that will act as "aliases" to these .env variables.

Inside the ./src folder, create a new folder called `"utils"`, inside this folder create a `constants.js` file. Inside this file we want to export three constants, one for each env variable we made.

```js
export const BASE_URL = process.env.REACT_APP_STRAPI_URL;
export const AUTH_PATH = process.env.REACT_APP_AUTH_PATH;
export const PRODUCTS_PATH = process.env.REACT_APP_PRODUCTS_PATH;
```

Now we can import and call AUTH_PATH instead of process.env.REACT_APP_AUTH_PATH... Much much cleaner.

### Initial fetch

In `./src` make a new folder called `"pages"`

Under this folder we'll make a pagecomponent called `"HomePage.js"`

```jsx
const HomePage = () => {
  return (
    <>
      <h1>Homepage</h1>
    </>
  );
};

export default HomePage;
```

Before we try fetching anything here - let's get our Routing set up.

In App.js:

```jsx
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;
```

At this point, if you run your app, you should see "Homepage" printed in your browser.

Let's try to perform a get request to our API.

In homepage.js:

```jsx
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
```

In your browser console you should now see an error, 401 (Unauthorized) (update: this might have changed based on what changes has been made to the api in the last 24hr).

This is good, this is exactly what we want.

(even if this code is essentially useless, please keep it there as a reference.)

In the next steps we will authorize ourselves and actually get some results back from the API.

## Authentication

Let's make a super simple login page first.

In the pages folder create a new Page Component called `Login.js`

This is the point where you need full focus.

Create your page component as you otherwise would and then import yup and create a schema.

```jsx
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  identifier: yup.string().required('Please enter your username'),
  password: yup.string().required('Please enter your password')
});
```

The properties of this schema referst back to the STRAPI authentication documentation where a post request takes a data object where identifier and password is required.

For other API's / Backends this might differ.

Next we need to import the `useForm()` hook and the `yupResolver()`

```jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
```

Now let's initialize our useForm hook.

```jsx
const { register, handleSubmit, errors } = useForm({
  resolver: yupResolver(loginSchema)
});
```

So far so good..

Now import useState from react and set up the following state varaibles:

```jsx
const [submitting, setSubmitting] = useState(false);
const [loginError, setLoginError] = useState(null);
```

We'll use these state variables to control our login form and submit process.

Inside your return statement, please create a form like this:

```jsx
<form onSubmit={handleSubmit(onSubmit)}>
  {loginError && <p>{loginError}</p>}
  <fieldset disabled={submitting}>
    <div>
      <input name='identifier' placeholder='Username' ref={register} />
      {errors.identifier && <p>{errors.identifier.message}</p>}
    </div>

    <div>
      <input
        name='password'
        placeholder='Password'
        ref={register}
        type='password'
      />
      {errors.password && <p>{errors.password.message}</p>}
    </div>
    <button type='submit'>{submitting ? 'Loggin in...' : 'Login'}</button>
  </fieldset>
</form>
```

To break this down further, lets look at it from the top...

We initialized a form with an onSubmit action. this action does not exist yet, we'll make that next.

Next we have some error handling that will let our user know something went wrong with the login process. We

Then we wrap all of our inputs in the form inside a `<fieldset></fieldset>` which is disabled while the state variable `submitting` is true. This way we can prevent our user from spamming the submit button and causing a ruckus.

Each field is configured the same, but they write to different values. Let's take the first one as an example:

```jsx
<div>
  <input name='identifier' placeholder='Username' ref={register} />
  {errors.identifier && <p>{errors.identifier.message}</p>}
</div>
```

This input has the name identifier and therefore refers back to our `loginSchema` when this field has value written to it, that value will become part of the data object returned by useForm.

So later we can access and read the `identifier` field by calling data.identifier

Now let's add the onSubmit function...

```jsx
const onSubmit = async data => {
  setSubmitting(true);
  setLoginError(null);

  console.log(data);

  try {
    const response = await axios.post(`${BASE_URL}${AUTH_PATH}`, data);
    console.log('response', response.data);
  } catch (error) {
    console.log('error', error);
    setLoginError(error.toString());
  } finally {
    setSubmitting(false);
  }
};
```

When we submit the form, we are passing the data object into our onSubmit function. We then make a call to our API AUTH PATH and we pass this data on.

then we get a response object back, and by console.log'ing this we can see we get a JWT in return as well. We want to store this JWT in localstorage.

As you can see in the axios.post() request we are referring to BASE_URL and AUTH_PATH, we created these constants earlier so make sure to import them at the top of your document:

```jsx
import axios from 'axios';
import { BASE_URL, AUTH_PATH } from '../utils/constants';
```

### Login halftime

At this point your Login.js should look something like this:

```jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BASE_URL, AUTH_PATH } from '../utils/constants';
import axios from 'axios';

const loginSchema = yup.object().shape({
  identifier: yup.string().required('Please enter your username'),
  password: yup.string().required('Please enter your password')
});

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async data => {
    setSubmitting(true);
    setLoginError(null);

    console.log(data);

    try {
      const response = await axios.post(`${BASE_URL}${AUTH_PATH}`, data);
      console.log('response', response.data);
    } catch (error) {
      console.log('error', error);
      setLoginError(error.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {loginError && <p>{loginError}</p>}
        <fieldset disabled={submitting}>
          <div>
            <input name='identifier' placeholder='Username' ref={register} />
            {errors.identifier && <p>{errors.identifier.message}</p>}
          </div>

          <div>
            <input
              name='password'
              placeholder='Password'
              ref={register}
              type='password'
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <button type='submit'>{submitting ? 'Loggin in...' : 'Login'}</button>
        </fieldset>
      </form>
    </>
  );
};

export default Login;
```

Take some time to open your browser console, read through the response and wrap your head around what we just did.

Next we are going to create two custom hooks, one to store the JWT in local storage, and one to simplify our axios requests.

Then we are going to serve this auth data to our application using the Context API.

## Custom Hooks

Prerequisites: understanding of what we have done so far.

### useLocalStorage()

Let's start by creating the Hook we need to store our auth data to localstorage.

Create a new file under the `utils` folder called useLocalStorage.js

All custom hooks should start with the `use` prefix.

Start the hook off by typing this:

```jsx
import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {};
```

We are defining our hook, and we want it to take two values.

One is the key, this is the key that will be written to localstorage.

The other is the initialValue of the key.

So if we wanted to store a simple boolean called 'alive' we would call our hook like so:

```jsx
useLocalStorage('alive', true);
```

However we want to store the entire response object from our login request, and we want to return a getter and a setter, just like useState does.

So let's add some functionality to our hook (note, this is the same hook that is created in moodle).

```jsx
// State to store our value
// Pass initial state function to useState so logic is only executed once
const [storedValue, setStoredValue] = useState(() => {
  try {
    // Get from local storage by key
    const item = window.localStorage.getItem(key);
    // Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    // If error also return initialValue
    console.log(error);
    return initialValue;
  }
});

// Return a wrapped version of useState's setter function that ...
// ... persists the new value to localStorage.
const setValue = value => {
  try {
    // Allow value to be a function so we have same API as useState
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    // Save state
    setStoredValue(valueToStore);
    // Save to local storage
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  } catch (error) {
    // A more advanced implementation would handle the error case
    console.log(error);
  }
};
```

So far we have created a pretty simple but powerful hook that gets and sets keys and values to localStorage.

The last thing we need to do for this hook is give it a set of return values, just like useState.

```jsx
return [storedValue, setValue];
```

Your finished hook should look something like this:

```jsx
import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
```

It is time to put this hook to use.

### Context API

Earlier in the document I mentioned that we want to make this data available / accessible to the entire application using something called context.

It is in this context we will use our useLocalStorage() Hook.

In the `src` folder, please create a new folder called `context` and a file under `context` called `AuthContext.js`.

I will start off by showing you the finished AuthContext, then explain what is happening:

```jsx
import { createContext } from 'react';
import useLocalStorage from '../utils/useLocalStorage';

const AuthContext = createContext([null, () => {}]);

export const AuthProvider = props => {
  const [auth, setAuth] = useLocalStorage('auth', null);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```

At the top of `AuthContext.js` we need to import two things.

One is called `createContext` and is provided by react.

The other is called `useLocalStorage` and is our own custom Hook.

```jsx
import { createContext } from 'react';
import useLocalStorage from '../utils/useLocalStorage';
```

Let's initialize our AuthContext like so:

```jsx
const AuthContext = createContext([null, () => {}]);
```

Now we can extend our AuthContext by creating something called a Provider.

This Provider will allow us to access the state of our useLocalStorage globally as long as we wrap our entire component in it, effectively making our entire page a `'child'` of the Provider.

```jsx
export const AuthProvider = props => {
  const [auth, setAuth] = useLocalStorage('auth', null);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {props.children}
    </AuthContext.Provider>
  );
};
```

All the theory you need for the Context API is documented here: https://react-content.netlify.app/3ihde/1

Now that we have created our AuthProvider we can make it available to our entire application.

Let's start by importing it in our App.js

```jsx
import { AuthProvider } from './context/AuthContext';
```

Now wrap the entire app in these tags.

```jsx
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path='/' exact component={HomePage} />
          <Route path='/login' component={Login} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
```

### Writing responsedata to Local Storage

Perfect, now we can go to our Login.js and start writing to localStorage.

Start by importing the `AuthContext` in Login.js.

```jsx
import AuthContext from '../context/AuthContext';
```

Now we need to import the `useContext` Hook from react.

```jsx
import { useState, useContext } from 'react';
```

Now we need to initialize it.

```jsx
const [, setAuth] = useContext(AuthContext);
```

^notice how im not writing const [auth, setAuth] =...

As we are not going to access, the `auth` variable I simply omit it.

At this point the terminal will scream at you and say ''setAuth' is assigned a value but never used'

So let's do what they say.

Inside our onSubmit function we want to write response.data to auth.

So in the try{} block we use setAuth accordingly:

```jsx
try {
  const response = await axios.post(`${BASE_URL}${AUTH_PATH}`, data);
  console.log('response', response.data);
  setAuth(response.data);
}
```

Congratulations on making it this far. This was arguably the hardest part.

If you have not done so already, restart your node server and try logging in with the auth credentials given at the top of this document.

In your console you should see the data object from the form as before, as well as the response object given back to us from strapi.

The new addition here can be seen in localStorage.

There you can see a key of 'auth' with the response object given to us by strapi!

## Fetching data as an authenticated user (Lesson 2)

If we take away all the nitty gritty things we have done so far, we have done the following:

- Made a form used to make a request to strapi, to receive our JWT.

- Stored the response from strapi to localstorage.

Now it is time to use this JWT to perform a get request on the products endpoint.

### Navigation

So far we have not made any real navigation. So let's change that.

Make a new folder called `components` and inside that folder make a file called `Nav.js`

In Nav.js:

```jsx
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Nav() {
  const [auth, setAuth] = useContext(AuthContext);

  const history = useHistory();

  function logout() {
    setAuth(null);
    history.push('/');
  }

  return (
    <nav>
      <Link to='/'>Home</Link>
      {auth ? (
        <>
          | <Link to='/products'>Products</Link> |{' '}
          <button onClick={logout}>Log out</button>
        </>
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </nav>
  );
}

export default Nav;
```

Just by looking at this you should see that we are doing some checks on wether or not we are authorized and the navbar will change appearance based on that.

You might also notice I added a link to a route that does not exist yet, so lets create that route and the page it should resolve to.

Create a new page under `./pages` called Products.js

Return whatever you want in this file. After that, import it in App.js and create a route for it:

```jsx
<Route path='/products' component={Products} />
```

While in App.js we can import our Nav.js as well and display it. (Place it outside the switch statement but inside Router).

```jsx
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Products from './pages/Products';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Switch>
          <Route path='/' exact component={HomePage} />
          <Route path='/login' component={Login} />
          <Route path='/products' component={Products} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
```

Now we can see that if we are authenticated the navbar will show a link to the Products page, as well as a button to log out.

However, even when we log out we can still manually navigate (by pasting the url in our browser) to the products page.

We do not want this behaviour.

So what we need to do is to make a check on this page to see if we are authenticated, if we are not authenticated we want to be sent back to the login page.

In Products.js, lets import useHistory from react-router-dom and our context, as well as the useContext hook.

```jsx
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
```

Now let's initialize our context and history.

```jsx
const [auth] = useContext(AuthContext);
const history = useHistory();
```

The last thing we need to do here is push our users back to /login if they are not authenticated.

```jsx
if (!auth) {
  history.push('/login');
}
```

Your Products.js should now look something like this:

```jsx
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Products = () => {
  const [auth] = useContext(AuthContext);
  const history = useHistory();

  if (!auth) {
    history.push('/login');
  }
  return (
    <>
      <h1>Products</h1>
    </>
  );
};

export default Products;
```

Now you can try it for yourself, manually go to the /products path in your browser and notice yourself being redirected to /login.

### Second Custom Hook, making an authorized get

Now that we have access to the JWT we could start making get requests to our API that looks something like this:

```jsx
const options = {
  headers: { Authorization: `Bearer ${auth.jwt}` }
};

axios.get(`${BASE_URL}${PRODUCTS_PATH}`, options);
```

We COULD, write every single authenticated fetch from now on like this. But we want to create a new Custom Hook that omits the need for BASE_URL and Options.

In your `utils` folder, create a new file called `useAxios.js`

At the top of this file, we'll import the following:

```jsx
import { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { BASE_URL } from '../utils/constants';
```

Now let's define our hook.

```jsx
const useAxios = () => {};

export default useAxios;
```

Now we need to get auth from context:

```jsx
const [auth] = useContext(AuthContext);
```

The next step is to create an apiClient, this is made available to us through the axios.create() method.

We want our apiClient to target our BASE_URL. We'll define it as follows:

```jsx
const apiClient = axios.create({
  baseURL: BASE_URL
});
```

Your first instinct might be to now return apiClient from useAxios.

However we have one more step to do, we want to append the options as discussed earlier in the document.

```jsx
apiClient.interceptors.request.use(config => {
  const token = auth.jwt;
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});
```

In this piece of code we are intercepting the request before it is made, and then we slap a config/options on top of it with Authorization headers.

We access our auth object, and extract the jwt value from it and set that as our Bearer token.

Now to finish our hook off we return the apiClient.

Your hook should now look something like this:

```jsx
import { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { BASE_URL } from '../utils/constants';

const useAxios = () => {
  const [auth] = useContext(AuthContext);
  const apiClient = axios.create({
    baseURL: BASE_URL
  });
  apiClient.interceptors.request.use(config => {
    const token = auth.jwt;
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  return apiClient;
};

export default useAxios;
```

The above might seem like a lot of code, but it will save you a lot of code in the future.

Now instead of writing:

```jsx
const options = {
  headers: { Authorization: `Bearer ${auth.jwt}` }
};

axios.get(`${BASE_URL}${PRODUCTS_PATH}`, options);
```

every time we want to make an authorized request we can call the useAxios hook and specify the subpath. The rest is Hook magic, that you made!

So let's do that next.

### useAxios to fetch products

In Products.js we now need to import useAxios and put it to use.

once imported we can start making our useEffect and useState variables to hold the result. (remember to import useState and useEffect from react)

I will start off by initializing the products state variable and setting the initial value to null:

```jsx
const [products, setProducts] = useState(null);
```

Now let's make an alias for the apiClient returned by useAxios:

```jsx
const http = useAxios();
```

Next I will define the useEffect that will perform the fetch and then set the results to the products state variable. Remember to import PRODUCTS_PATH first.

```jsx
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
}, []);
```

Now go check your browser console

You should see a response object, with an array that contains some data.

### Displaying this data (should be familiar)

Let's display this data on our products page

Under the `components` folder please create a new component called `Item.js` in this file add the following:

```jsx
const Item = props => {
  const { title, description, image_url, price } = props;
  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <h2>{title}</h2>
      <img src={image_url} alt={title} style={{ width: '100%' }} />
      <h3>{price}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Item;
```

This is just destructuring some props and returning them in a div.

Import this Item component in your Products.js file and perform a map on the products array each map loop should return an Item component with a pre-Destructured product object.

If you are not wrapping each item yet, put a key on each Item component as well.

```jsx
<Item {...product} />
```

Do not stress out if the images are not displayed, there is two different methods of adding images to these products, and the oslo class might use the other method. (we are sharing strapi instance with them)

### Updating existing items

To update an existing item we want to be able to click on a product from the list, from there be taken to an "EditProduct" page, and from that page perform a put request to change existing data.

So let's start with the familiar and easy stuff.

In Products.js add `Link` to the import list for react-router-dom

```jsx
import { useHistory, Link } from 'react-router-dom';
```

While loading our products we want to return "loading". So I'll add an early return based on an if statement:

```jsx
if (!products) {
  return <p>loading</p>;
}
```

Now let's wrap our returned Item components in a Link that takes us to a new page (we'll add the page right after.)

```jsx
{
  products.map(product => {
    return (
      <Link key={product.id} to={`/edit/${product.id}`}>
        <Item {...product} />
      </Link>
    );
  });
}
```

Your Products.js should now look something like this:

```jsx
import { useContext, useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useAxios from '../utils/useAxios';
import { PRODUCTS_PATH } from '../utils/constants';
import Item from '../components/Item';

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
  }, []);

  if (!auth) {
    history.push('/login');
  }

  if (!products) {
    return <p>loading</p>;
  }

  return (
    <>
      <h1>Products</h1>
      {products.map(product => {
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
```

In your `pages` folder, create a new page called EditProduct.js.

I will set up mine like this for now:

```jsx
import { useParams } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import { useState, useEffect } from 'react';
import Item from '../components/Item';

const EditProduct = () => {
  return (
    <>
      <h1>Edit Product</h1>
    </>
  );
};

export default EditProduct;
```

Now let's import this page and set up a route for it in App.js:

```jsx
<Route path='/edit/:id' component={EditProduct} />
```

If we click either of the rendered product listings now, we should be sent to a new page, and we should see the product ID in the URL.

Let's extract the ID from the url and make a get request for that specific item.

In your EditProduct.js:

```jsx
import { useParams } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import { useState, useEffect } from 'react';
import Item from '../components/Item';
import { PRODUCTS_PATH } from '../utils/constants';

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const http = useAxios();

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
  }, [id]);

  if (!product) {
    return <p>loading product</p>;
  }

  return (
    <>
      <h1>Edit Product</h1>
      <Item {...product} />
    </>
  );
};

export default EditProduct;
```

Here we are performing a get request to /products/id and writing the response.data object to the statevariable product

then we are passing this product state variable into the Item component to render what is there currently.

Next we'll add a form to be used to update the Product.

Please keep in mind this is just a bigger version of the login component we made.

Import useForm and yupResolver to start it off:

```jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
```

Next we'll add some state varaibles to handle our form flow.

```jsx
const [submitting, setSubmitting] = useState(false);
const [updateError, setUpdateError] = useState(null);
const [success, setSuccess] = useState(null);
```

Now we'll add the schema and set up our useForm hook:

Remember that schema should be defined outside the page component definition.

```jsx
const productSchema = yup.object().shape({
  title: yup.string().required('Please provide a title'),
  price: yup.number().required('Please provide a price'),
  description: yup.string().required('Please provide a description'),
  image_url: yup.string().required('Please provide an image url')
});
```

```jsx
const { register, handleSubmit, errors } = useForm({
  resolver: yupResolver(productSchema)
});
```

Now let's create the onSubmit function:

```jsx
const onSubmit = async data => {
  setSubmitting(true);
  setUpdateError(null);

  console.log(data);

  try {
    const response = await http.put(`${PRODUCTS_PATH}/${id}`, data);
    console.log('response', response.data);
    setProduct(response.data);
    setSuccess(true);
  } catch (error) {
    console.log('error', error);
    setUpdateError(error.toString());
  } finally {
    setSubmitting(false);
  }
};
```

Notice how we use http.put() instead of http.get(). put is a method we can use to update items in our rest API's.

Next we need to add the form:

```jsx
<form onSubmit={handleSubmit(onSubmit)}>
  {updateError && <p>{updateError}</p>}
  <fieldset disabled={submitting}>
    <div>
      <input
        name='title'
        placeholder='Title'
        ref={register}
        defaultValue={product.title}
      />
      {errors.title && <p>{errors.identifier.message}</p>}
    </div>

    <div>
      <input
        name='price'
        placeholder='Price'
        defaultValue={product.price}
        ref={register}
        type='number'
      />
      {errors.price && <p>{errors.price.message}</p>}
    </div>
    <div>
      <textarea
        name='description'
        placeholder='Description'
        defaultValue={product.description}
        ref={register}
        type='text'
      />
      {errors.description && <p>{errors.description.message}</p>}
    </div>
    <div>
      <input
        name='image_url'
        placeholder='Image URL'
        ref={register}
        defaultValue={product.image_url}
        type='text'
      />
      {errors.image_url && <p>{errors.image_url.message}</p>}
    </div>

    <button type='submit'>{submitting ? 'Updating ...' : 'Update'}</button>
  </fieldset>
</form>;
{
  success ? <p>Listing of {product.title} was updated</p> : null;
}
```

At the end of the form I added a little success check. If the update is successful it wil give our users some visual feedback that tells them it was completed successfully.

Congratulations, you have now learned to authenticate yourself using a JWT. You have learned how to make get requests with a JWT in your Authorization header. And you have learned how to perform authenticated updates to this API.

Next Lesson will cover the Create (post) and Delete (delete) operations

## Lesson 3, adding and deleting
