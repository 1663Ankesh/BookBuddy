import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Login = () => {
  const { curruser, curruseremail, isuser, setCurruser } =
    useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    if (curruser) {
      navigate("/");
    }
  }, [curruser, curruseremail, isuser]);

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(email, pwd);
    let result = await fetch(
      process.env.React_App_Host_Api + "/api/user/login",
      {
        method: "POST",
        body: JSON.stringify({ email, pwd }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    result = await result.json();

    if (result.error) {
      alert(result.error);

      if (result.donavigate & (result.donavigate === true)) navigate("/");
      return;
    }

    setCurruser(result.username);
    navigate("/");
  }

  return (
    <div className="loginpage">
      <form className="form" onSubmit={handleSubmit}>
        <div className="formheading">User Log In</div>

        <div className="field">
          <label>Email : </label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Password : </label>
          <input
            type="password"
            placeholder="Enter Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div className="formbtns">
          <div className="field">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>

          <div className="field">
            <button
              type="button"
              className="submit-btn"
              onClick={() => {
                setEmail("");
                setPwd("");
              }}
            >
              Reset
            </button>
          </div>

          <div className="field">
            <button
              type="button"
              className="submit-btn"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password
            </button>
          </div>
        </div>
      </form>

      <div className="loginpagesignup">
        <span>
          Do not have an account :{" "}
          <button className="gotosignup" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </span>
      </div>
    </div>
  );
};

export default Login;
