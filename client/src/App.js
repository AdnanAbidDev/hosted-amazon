import "./App.css";
import NavBaar from "./components/header/NavBaar";
import Newnav from "./components/newnavbaar/Newnav";
import Maincomp from "./components/home/Maincomp";
import Footer from "./components/home/footer/Footer";
import Sign_in from "./components/signup_sign/Sign_in";
import SIgnUp from "./components/signup_sign/SIgnUp";
import Cart from "./components/cart/Cart";
import Buynow from "./components/buynow/Buynow";
import { Routes, Route } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
function App() {
  const [data, setData] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setData(true);
    }, 500);
  });
  return (
    <>
      {data ? (
        <div>
          <NavBaar />
          <Newnav />
          <Routes>
            <Route path="/" element={<Maincomp />} />
            <Route path="/login" element={<Sign_in />} />
            <Route path="/register" element={<SIgnUp />} />
            <Route path="/getproductsone/:id" element={<Cart />} />
            <Route path="/buynow" element={<Buynow />} />
          </Routes>
          <Footer />
        </div>
      ) : (
        <div className="circle">
          <CircularProgress />
          <h2>Loading</h2>
        </div>
      )}
    </>
  );
}

export default App;
