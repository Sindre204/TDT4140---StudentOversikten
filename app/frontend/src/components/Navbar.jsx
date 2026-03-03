import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import './Navbar.css';


export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to='/'><button> Hjem </button></Link>
        <Link to='/Events'><button> Arrangementer </button></Link>
        <Link to='/Listings'><button> Jobbannonser </button></Link>
      </div>



      <div className="navbar-login">
        {user ? (
          <>
            {user.role === 'company' && <span className="role-badge">Bedrift</span>}
            <Link to='/MyProfile'><button> Min profil </button></Link>
          </>
        ) : (
          <Link to='/LogIn'><button> Logg inn </button></Link>
        )}

        {user && user.role === 'company' && (
          <Link to='/administration'>
            <button id="admin"> Administrasjon </button>
          </Link>
        )}

        {user && user.role === 'admin' && (
          <a href="http://127.0.0.1:8000/admin/">
            <button id="admin"> Admin </button>
          </a>
        )}
      </div>
    </nav>
  )

} 
