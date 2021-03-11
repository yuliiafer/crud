import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Nav() {
  const [auth, setAuth] = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [click, setClick] = useState(false);
  const history = useHistory();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  async function logout() {
    const confirmLogOut = window.confirm("Do you want to log out?");
    if (confirmLogOut) {
      try {
        setAuth(null);
        history.push("/");
      } catch (error) {
        setError(error);
      }
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link className="nav-links" onClick={closeMobileMenu} to="/">
              Home
            </Link>
          </li>
          {auth ? (
            <>
              <li className="nav-item">
                <Link
                  className="nav-links"
                  onClick={closeMobileMenu}
                  to="/products"
                >
                  Products
                </Link>{" "}
              </li>
              <li className="nav-item">
                <Link to="/add" className="nav-links" onClick={closeMobileMenu}>
                  Add product
                </Link>
              </li>
             
              <li className="nav-links nav-links--mod nav-item" onClick={closeMobileMenu}>
                {error ? "Error" : <button className = "btn--outline btn--medium" onClick={logout}>Log out</button>}
              </li>
              <li className="nav-links nav-links--mod nav-item" onClick={closeMobileMenu}>
                {`Hi, ${
                auth.user.username + " "
              }`}</li>
            </>
          ) : (
            <li className="nav-item nav-links">
              <Link to="/login"><button className = "btn--outline btn--medium" onClick={closeMobileMenu}>Login</button></Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
