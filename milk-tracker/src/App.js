import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import InsertView from './components/InsertView';
import InsertCow from './components/InsertCow';
import InsertMilk from './components/InsertMilk';
import InsertProduct from './components/InsertProduct';
import React from 'react';
import './App.css';

function App() {
  return (
    <Router>
        <Navbar/>
        <Routes>
          <Route key="InsertView" path="/" element={<InsertView />} />
          <Route key="SplashScreen" path="/Splash" element={<SplashScreen />} />
          <Route key="InsertCow" path="/Cow" element={<InsertCow />} />
          <Route key="InsertMilk" path="/Milk" element={<InsertMilk />} />
          <Route key="InsertProducts" path="/Products" element={<InsertProduct />} />
        </Routes>
      </Router>
  );
}

export default App;
