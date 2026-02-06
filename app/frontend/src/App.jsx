import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from "./components/Layout";
import { Events } from './pages/Events';
import { Listings } from './pages/Listings';
import { LogIn } from './pages/LogIn';
import { Home } from './pages/Home';
import { Norgesbank } from './pages/listingPages/Norgesbank';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/Events' element={<Events />} />
          <Route path='/Listings' element={<Listings />} />
          <Route path='/Listings/Norgesbank' element={<Norgesbank />} />
          <Route path='/LogIn' element={<LogIn />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
