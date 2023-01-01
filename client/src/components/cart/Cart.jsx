import { Divider } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./cart.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Logincontext } from "../context/ContextProvider";

const Cart = () => {
  const history = useNavigate("");
  const { account, setAccount } = useContext(Logincontext);

  const { id } = useParams("");
  const [inddata, setIndedata] = useState("");

  const getinddata = async () => {
    const res = await fetch(`/getproductsone/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
    if (res.status !== 201) {
      alert("no data available");
    } else {
      // console.log("ind mila hain");
      setIndedata(data);
    }
  };

  useEffect(() => {
    getinddata();
  }, [id]);

  //Add to cart
  const addtocart = async (id) => {
    console.log(id);
    try {
      const check = await fetch(`/addcart/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inddata, //send product detail
        }),
        credentials: "include",
      });
      const data1 = await check.json();
      console.log(data1 + "frontend data"); // data1 contains data of particular user

      if (check.status === 400 || !data1) {
        toast.error("data not added", {
          position: "top-center",
        });
      } else {
        toast.success("Data Added to cart", {
          position: "top-center",
        });
        setAccount(data1);
        history("/buynow");
      }
    } catch (error) {
      console.log("user invalid");
      history("/register");
    }
  };

  return (
    <div className="cart_section">
      {Object.keys(inddata).length && (
        <div className="cart_container">
          <div className="left_cart">
            <img src={inddata.detailUrl} alt="cart_img" />
            <div className="cart_btn">
              <button
                className="cart_btn1"
                onClick={() => addtocart(inddata.id)}
              >
                Add to Cart
              </button>
              <button className="cart_btn2">Buy Now</button>
            </div>
          </div>
          <div className="right_cart">
            <h3>{inddata.title.shortTitle}</h3>
            <h4>{inddata.title.longTitle}</h4>
            <Divider />
            <p className="mrp">M.R.P : ₨{inddata.price.mrp}</p>
            <p>
              Deal of The Day :
              <span style={{ color: "#B12704" }}> ₨{inddata.price.cost}</span>
            </p>
            <p>
              You Save :
              <span style={{ color: "#B12704" }}>
                {" "}
                ₨{inddata.price.mrp - inddata.price.cost} (
                {inddata.price.discount})
              </span>
            </p>
            <div className="discount_box">
              <h5>
                Discount:{" "}
                <span style={{ color: "#111" }}>{inddata.discount}</span>
              </h5>
              <h4>
                Free Delivery:
                <span style={{ color: "#111", fontWeight: 600 }}>
                  {" "}
                  Oct 8-21
                </span>{" "}
                Details
              </h4>
              <p>
                Fastest Delivery :{" "}
                <span style={{ color: "#111", fontWeight: 600 }}>
                  Tomorrow 11AM
                </span>
              </p>
              <p className="description">
                About the Item:{" "}
                <span
                  style={{
                    color: "#565959",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.4px",
                  }}
                >
                  {inddata.description}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;
