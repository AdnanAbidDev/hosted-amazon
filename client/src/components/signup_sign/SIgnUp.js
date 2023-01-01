import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SIgnUp = () => {
  const [udata, setUdata] = useState({
    fname: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });

  const adddata = (e) => {
    const { name, value } = e.target;
    // console.log(name,value);
    setUdata(() => {
      return {
        ...udata,
        [name]: value,
      };
    });
  };

  const senddata = async (e) => {
    e.preventDefault();

    const { fname, email, mobile, password, cpassword } = udata;
    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          email,
          mobile,
          password,
          cpassword,
        }),
      });

      const data = await res.json();
      // console.log(data);

      if (res.status === 422 || !data) {
        toast.error("Invalid Details 👎!", {
          position: "top-center",
        });
      } else {
        setUdata({
          ...udata,
          fname: "",
          email: "",
          mobile: "",
          password: "",
          cpassword: "",
        });
        toast.success("Registration Successfully done 😃!", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("front end catch error" + error.message);
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
            <h1>Create account</h1>
            <div className="form_data">
              <label htmlFor="fname">Your name</label>
              <input
                type="text"
                value={udata.fname}
                onChange={adddata}
                name="fname"
                id="fname"
              />
            </div>
            <div className="form_data">
              <label htmlFor="email">email</label>
              <input
                type="text"
                value={udata.email}
                onChange={adddata}
                name="email"
                id="email"
              />
            </div>
            <div className="form_data">
              <label htmlFor="number">Mobile number</label>
              <input
                type="text"
                value={udata.mobile}
                onChange={adddata}
                name="mobile"
                id="mobile"
              />
            </div>
            <div className="form_data">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={udata.password}
                onChange={adddata}
                name="password"
                id="password"
                placeholder="At least 6 characters"
              />
            </div>
            <div className="form_data">
              <label htmlFor="cpassword">Password again</label>
              <input
                type="password"
                value={udata.cpassword}
                onChange={adddata}
                name="cpassword"
                id="cpassword"
              />
            </div>
            <button className="signin_btn" onClick={senddata}>
              Continue
            </button>
            <div className="signin_info">
              <p>Already have an account?</p>
              <NavLink to="/login">Sign in</NavLink>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </section>
  );
};

export default SIgnUp;
