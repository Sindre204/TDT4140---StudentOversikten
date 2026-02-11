import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import './Navbar.css';


export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to='/'><button> Home </button></Link>
        <Link to='/Events'><button> Events </button></Link>
        <Link to='/Listings'><button> Listings </button></Link>
      </div>
      <div className="navbar-login">
        {user ? (
          <Link to='/MyProfile'><button> My profile </button></Link>
        ) : (
          <Link to='/LogIn'><button> Log in </button></Link>
        )}
      </div>
    </nav>
  )

}