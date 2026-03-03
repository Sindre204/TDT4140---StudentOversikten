import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from "./components/Layout";
import { Events } from './pages/Events';
import { Listings } from './pages/Listings';
import { Companies } from './pages/Companies';
import { LogIn } from './pages/LogIn';

import { CreateUser } from './pages/CreateUser';

import { ListingDetail } from './components/ListingDetail';
import { EventDetail } from './components/EventDetail';

import { CompanyDetail } from './components/CompanyDetail';
import { Administration } from './pages/Administration';
import { CreateEventAdmin } from './pages/CreateEventAdmin';
import { CreateListingAdmin } from './pages/CreateListingAdmin';


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
            <Route path='/Companies' element={<Companies />} />
            <Route path='/events/:id' element={<EventDetail />} />
            <Route path='/listings/:id' element={<ListingDetail />} />
            <Route path='/companies/:id' element={<CompanyDetail />} />
            <Route path='/LogIn' element={<LogIn />} />
            <Route path='/CreateUser' element={<CreateUser />} />
            <Route path='/MyProfile' element={<MyProfile />} />
            <Route path='/administration' element={<Administration />} />
            <Route path='/administration/events/new' element={<CreateEventAdmin />} />
            <Route path='/administration/events/:id/edit' element={<CreateEventAdmin />} />
            <Route path='/administration/ads/new' element={<CreateListingAdmin />} />
            <Route path='/administration/ads/:id/edit' element={<CreateListingAdmin />} />

          </Route>

        </Routes>

      </Router>
    </AuthProvider>
  )

}

export default App;
