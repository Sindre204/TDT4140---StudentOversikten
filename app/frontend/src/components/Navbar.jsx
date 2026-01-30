import {Link} from "react-router-dom";
import './Navbar.css';


export function Navbar() {

  return (
    <>
      <Link to='/'><button> Home </button></Link>
      <Link to='/Events'><button> Events </button></Link>
      <Link to='/Listings'><button> Listings </button></Link>
      <Link to='/LogIn'><button> Log in </button></Link>
    </>
  )

}