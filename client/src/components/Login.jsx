import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Login = () => {
  const { curruser, curruseremail, isuser, setCurruser } =
    useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("1663ankesh@gmail.com");
  const [pwd, setPwd] = useState("abc");

  useEffect(() => {
    if (curruser) {
      navigate("/");
    }
  }, [curruser, curruseremail, isuser]);

  async function handleSubmit() {
    let result = await fetch(process.env.React_App_Host_Api + "/login", {
      method: "POST",
      body: JSON.stringify({ email, pwd }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    result = await result.json();
    if (result.error) {
      alert(result.error);
      navigate("/");
      return;
    }

    setCurruser(result.username);
    navigate("/");
  }

  return (
    <div className="loginpage">
      <div className="form">
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
            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <div className="field">
            <button
              type="submit"
              className="submit-btn"
              onClick={() => (setEmail(""), setPwd(""))}
            >
              Reset
            </button>
          </div>

          <div className="field">
            <button
              type="submit"
              className="submit-btn"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>

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
