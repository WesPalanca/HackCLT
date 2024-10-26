import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Auth from "./pages/auth";
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";
import Journal from "./pages/Journal";
import Feeling from "./pages/Feeling";


const App = () =>{
  return(
  <Router>
      <Routes>
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/Tracker" element={<Tracker />}></Route>
        <Route path='/Journal' element={<Journal />}></Route>
        <Route path='/Feeling' element={<Feeling />}></Route>
      </Routes>
  </Router>
  )
}





export default App;