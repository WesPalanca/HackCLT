import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Auth from "./pages/auth";
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";


const App = () =>{
  return(
  <Router>
      <Routes>
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/Tracker" element={<Tracker />}></Route>
      </Routes>
  </Router>
  )
}





export default App;