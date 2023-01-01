import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import "./signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Logincontext } from "../context/ContextProvider";

const Sign_in = () => {
  const { account, setAccount } = useContext(Logincontext);
  const [logdata, setData] = useState({
    email: "",
    password: "",
  });
  const adddata = (e) => {
    const { name, value } = e.target;
    setData(() => {
      return { ...logdata, [name]: value };
    });
  };

  const senddata = async (e) => {
    e.preventDefault();

    const { email, password } = logdata;
    // console.log(email);
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      // console.log(data);

      if (res.status === 400 || !data) {
        console.log("invalid details");
        toast.warn("Invalid Details 👎!", {
          position: "top-center",
        });
      } else {
        setData({ ...logdata, email: "", password: "" });
        toast.success("Login Successfully done 😃!", {
          position: "top-center",
        });
        setAccount(data);
      }
    } catch (error) {
      console.log("login page error" + error.message);
    }
  };

  return (
    <section>
      <div className="sign_container">
        <div className="sign_header">
          <img src="./blacklogoamazon.png" alt="signupimg" />
        </div>
        <div className="sign_form">
          <form method="POST">
            <h1>Sign-In</h1>
            <div className="form_data">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                onChange={adddata}
                value={logdata.email}
                name="email"
                id="email"
              />
            </div>
            <div className="form_data">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={logdata.password}
                onChange={adddata}
                name="password"
                id="password"
                placeholder="At least 6 characters"
              />
            </div>
            <button className="signin_btn" onClick={senddata}>
              Continue
            </button>
          </form>
        </div>
        <div className="create_accountinfo">
          <p>New to Amazon?</p>
          <NavLink to="/register">
            {" "}
            <button>Create your Amazon Account</button>
          </NavLink>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Sign_in;
