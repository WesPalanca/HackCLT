import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Auth from "./pages/auth";


const App = () =>{
  return(
  <Router>
      <Routes>
        <Route path="/auth" element={<Auth />}></Route>

      </Routes>
  </Router>
  )
}





export default App;