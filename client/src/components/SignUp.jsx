import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Signup = () => {
  const { curruser, curruseremail, isuser, setCurruser, id, setId } =
    useContext(UserContext);

  const [username, setUsername] = useState("");
  const [pwd, setpwd] = useState("");
  const [email, setEmail] = useState("");
  const [phn, setPhn] = useState("");
  const [place, setPlace] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (curruser) {
      navigate("/");
    }
  }, [curruser, curruseremail, isuser, id]);

  async function handleSubmit(e) {
    e.preventDefault();

    let result = await fetch(
      process.env.React_App_Host_Api + "/api/user/signup",
      {
        method: "POST",
        body: JSON.stringify({
          username,
          pwd,
          email,
          phn,
          place,
          state,
          pincode,
        }),
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
      setCurruser(result.username);
      navigate("/");
    }
  }

  return (
    <div className="signuppage">
      <form className="form" onSubmit={handleSubmit}>
        <div className="formheading">User Sign Up</div>

        <div className="field">
          <label htmlFor="user">Username : </label>
          <input
            type="text"
            placeholder="Enter User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="field">
          {" "}
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
          {" "}
          <label>Phone Number :</label>
          <input
            type="number"
            placeholder="Enter Phone Number"
            value={phn}
            onChange={(e) => setPhn(e.target.value)}
            maxLength={10}
            required
          />
        </div>

        <div className="field">
          {" "}
          <label>Password : </label>
          <input
            type="password"
            placeholder="Enter Password"
            value={pwd}
            onChange={(e) => setpwd(e.target.value)}
            required
          />
        </div>

        <div className="field">
          {" "}
          <label>Place : </label>
          <input
            type="text"
            placeholder="Enter Plcae"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
          />
        </div>

        <div className="field">
          {" "}
          <label>State : </label>
          <input
            type="text"
            placeholder="Enter State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>

        <div className="field">
          {" "}
          <label>Pincode : </label>
          <input
            type="number"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
        </div>

        <div className="formbtns">
          <div className="field">
            {" "}
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>

          <div className="field">
            <button
              type="button"
              className="submit-btn"
              onClick={() => {
                setUsername("");
                setEmail("");
                setPhn("");
                setpwd("");
                setPlace("");
                setState("");
                setPincode("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
      <div className="signuppagelogin">
        <span>
          Have an account :{" "}
          <button className="gotologin" onClick={() => navigate("/login")}>
            Log In
          </button>
        </span>
      </div>
    </div>
  );
};

export default Signup;
