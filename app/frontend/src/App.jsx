import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from "./components/Layout";
import { Events } from './pages/Events';
import { Listings } from './pages/Listings';
import { LogIn } from './pages/LogIn';
import { ListingDetail } from './components/ListingDetail';

import { Home } from './pages/home';
import { MyProfile } from './pages/MyProfile';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <AuthProvider>
      <Router>

        <Routes>

          <Route element={<Layout />}>

            <Route path='/' element={<Home />} />
            <Route path='/Events' element={<Events />} />
            <Route path='/Listings' element={<Listings />} />
            <Route path='/listings/:id' element={<ListingDetail />} />
            <Route path='/LogIn' element={<LogIn />} />
            <Route path='/MyProfile' element={<MyProfile />} />

          </Route>

        </Routes>

      </Router>
    </AuthProvider>
  )

}

export default App;
