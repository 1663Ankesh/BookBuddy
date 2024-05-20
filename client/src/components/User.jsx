import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const User = () => {
  let navigate = useNavigate();

  let { curruseremail } = useContext(UserContext);

  const [user, setUser] = useState({});
  const [toupdate, setToupdate] = useState(false);
  const [newname, setnewname] = useState("");
  const [newphn, setnewphn] = useState("");
  const [newpwd, setnewpwd] = useState("");
  const [newplace, setnewplace] = useState("");
  const [newstate, setnewstate] = useState("");
  const [newpincode, setnewpincode] = useState("");

  const { curruser, setCurruser, setIsuser, isuser, id } =
    useContext(UserContext);

  useEffect(() => {
    getuser();
    setnewpwd("");
  }, [toupdate, curruser, curruseremail, setIsuser, id]);

  async function getuser() {
    try {
      if (!isuser || !curruseremail || !curruser || !id) {
        navigate("/");
      } else {
        let result = await fetch(process.env.React_App_Host_Api + `/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        result = await result.json();

        setUser(result);
        setnewname(result.username);
        setnewphn(result.phn);
        setnewplace(result.place);
        setnewstate(result.state);
        setnewpincode(result.pincode);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  async function update() {
    let result = await fetch(process.env.React_App_Host_Api + `/${id}`, {
      method: "POST",
      body: JSON.stringify({
        curruseremail,
        newname,
        newphn,
        newpwd,
        newplace,
        newstate,
        newpincode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    result = await result.json();
    alert("Updated");
    setToupdate(!toupdate);
    setCurruser(result.name);
  }

  return (
    <div className="userrootdiv">
      {!toupdate ? (
        <div className="userpage">
          <div className="username">
            <span>Name : </span>
            {user.username}
          </div>
          <div className="email">
            <span>Email : </span>
            {user.email}
          </div>
          <div className="phone">
            <span>Phone : </span>
            {user.phn}
          </div>
          <div className="place">
            <span>Place : </span>
            {user.place}
          </div>
          <div className="state">
            <span>State : </span>
            {user.state}
          </div>
          <div className="pincode">
            <span>Pincode : </span>
            {user.pincode}
          </div>
          <div className="formbtns">
            <div className="toupdate" onClick={() => setToupdate(!toupdate)}>
              <button>Update</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="updateformbackground">
          <div className="updateform">
            <div className="formheading">Update Your Profile</div>
            <div className="field formname">
              <label htmlFor="name">Name : </label>
              <input
                type="text"
                placeholder="Username"
                value={newname}
                onChange={(e) => setnewname(e.target.value)}
              />
            </div>
            <div className="field formemail">
              <label htmlFor="name">Email : </label>
              <input
                type="email"
                placeholder="Email"
                disabled
                value={curruseremail}
              />
            </div>
            <div className="field formphn">
              <label htmlFor="name">Phone : </label>
              <input
                type="Number"
                placeholder="Ph. No."
                value={newphn}
                maxLength={10}
                onChange={(e) => setnewphn(e.target.value)}
              />
            </div>
            <div className="field formplace">
              <label htmlFor="name">Place : </label>
              <input
                type="text"
                placeholder="Place"
                value={newplace}
                onChange={(e) => setnewplace(e.target.value)}
              />
            </div>
            <div className="field formstate">
              <label htmlFor="name">State : </label>
              <input
                type="text"
                placeholder="State"
                value={newstate}
                onChange={(e) => setnewstate(e.target.value)}
              />
            </div>
            <div className="field formpincode">
              <label htmlFor="name">Pincode : </label>
              <input
                type="Number"
                placeholder="Pincode"
                value={newpincode}
                maxLength={6}
                onChange={(e) => setnewpincode(e.target.value)}
              />
            </div>
            <div className="field formpwd">
              <label htmlFor="name">New Password : </label>
              <input
                type="password"
                placeholder="New Password"
                value={newpwd}
                onChange={(e) => setnewpwd(e.target.value)}
              />
            </div>
            <div className="formbtns">
              <div className="updatebtn" onClick={update}>
                Update
              </div>
              <div className="backbtn" onClick={() => setToupdate(!toupdate)}>
                Back
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
