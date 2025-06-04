import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Routine from "./pages/Routine";
import News from "./pages/News";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";

import PrivateRoute from './pages/PrivateRoute';

function MainRoutes() {
  return (
    <Routes> 
      <Route path="/cadastro" element={ <Register /> }/>
      <Route path="/login" element={ <Login /> }/>

      <Route path="/" element={ <PrivateRoute><Home /></PrivateRoute> }/>
      <Route path="/rotina" element={ <PrivateRoute><Routine /></PrivateRoute> }/>
      <Route path="/noticias" element={ <PrivateRoute><News/></PrivateRoute> }/>
      <Route path="/dashboard" element={ <PrivateRoute><Dashboard /></PrivateRoute> }/>
      
    </Routes>
  );
}

export default MainRoutes;