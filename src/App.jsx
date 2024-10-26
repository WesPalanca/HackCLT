import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Auth from "./pages/auth";
import Home from "./pages/Home";


const App = () =>{
  return(
  <Router>
      <Routes>
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/Home" element={<Home />}></Route>
      </Routes>
  </Router>
  )
}





export default App;