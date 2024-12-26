import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const ForgotPassword = () => {
  let navigate = useNavigate();
  const { curruser, curruseremail, isuser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");

  useEffect(() => {
    if (curruser || curruseremail || isuser) {
      navigate("/");
    }
  }, [curruser, curruseremail, isuser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (pwd === cpwd) {
      let result = await fetch(
        process.env.REACT_APP_Host_Api + `/api/user/forgotpassword`,
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
      } else {
        navigate("/login");
      }
    } else {
      alert("Do Not Enter Different Passwords in different fields");
    }
  }

  return (
    <div className="loginpage forgotpassword">
      <form className="form" onSubmit={handleSubmit}>
        <div className="formheading">User Password Recovery</div>

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
          <label>New Password : </label>
          <input
            type="password"
            placeholder="Enter Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Confirm Password : </label>
          <input
            type="password"
            placeholder="Enter Password"
            value={cpwd}
            onChange={(e) => setCpwd(e.target.value)}
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
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
