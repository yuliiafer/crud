import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Products from './pages/Products';
import { AuthProvider } from './context/AuthContext';
import EditProduct from "./pages/EditProduct";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Switch>
          <Route path='/' exact component={HomePage} />
          <Route path='/login' component={Login} />
          <Route path='/products' component={Products} />
          <Route path='/edit/:id' component={EditProduct} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
