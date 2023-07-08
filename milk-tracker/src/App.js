import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import InsertView from './components/InsertView';
import InsertCow from './components/InsertCow';
import InsertMilk from './components/InsertMilk';
import InsertProduct from './components/InsertProduct';
import LoginView from './components/LoginView';
import React from 'react';
import './App.css';
import ViewView from "./components/ViewView";


function App() {
  return (
        <Router>
            <Navbar/>
            <Routes>
            <Route key="SplashScreen" path="/" element={<SplashScreen />} />
            <Route key="LoginView" path="/Login" element={<LoginView />} />
            <Route key="InsertView" path="/Insert" element={<InsertView />} />
            <Route key="InsertCow" path="/Cow" element={<InsertCow />} />
            <Route key="InsertMilk" path="/Milk" element={<InsertMilk />} />
            <Route key="InsertProducts" path="/Products" element={<InsertProduct />} />
            <Route key="ViewView" path="/View" element={<ViewView />} />
            </Routes>
        </Router>
  );
}

export default App;
