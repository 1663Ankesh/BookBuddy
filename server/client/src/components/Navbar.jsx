import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [todisplay, setTodisplay] = useState(false);

  const {
    curruser,
    setCurruser,
    curruseremail,
    setCurruseremail,
    isuser,
    setIsuser,
    id,
    setId,
  } = useContext(UserContext);
  const navigate = useNavigate();

  async function profile() {
    let result = await fetch(process.env.React_App_Host_Api + "/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    result = await result.json();

    setCurruseremail(result?.email);
    if (result.username) {
      setCurruser(result?.username);
      setId(result?.userId);
      setIsuser(true);
    } else {
      setIsuser(false);
    }
  }

  useEffect(() => {
    profile();
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [curruser, curruseremail, isuser, id]);

  async function logout() {
    await fetch(process.env.React_App_Host_Api + "/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setCurruseremail("");
    setCurruser("");
    setId("");
    setIsuser(false);
    navigate("/");
  }

  console.log("Id is ", id);

  return (
    <>
      {windowWidth > 500 && (
        <div className="navbar">
          <div className="navbarleft">
            <li className="item take-books">Take Books!!!</li>
            <li className="item" onClick={() => navigate("/")}>
              Home Page
            </li>
          </div>

          {isuser ? (
            <div className="navbarleft2">
              <li className="item" onClick={() => navigate(`/${id}`)}>
                {curruser}
              </li>
              <li className="item" onClick={() => navigate(`/${id}/mybooks`)}>
                My Books
              </li>
              <li
                className="item"
                onClick={() => navigate(`/${id}/lendedbooks`)}
              >
                Lended Books
              </li>
              <li className="item" onClick={() => navigate(`/${id}/bookings`)}>
                My Bookings
              </li>
              <li className="item" onClick={() => logout()}>
                LogOut
              </li>
            </div>
          ) : (
            <div className="navbarright">
              <li className="item" onClick={() => navigate("/login")}>
                LogIn
              </li>
            </div>
          )}
        </div>
      )}

      {windowWidth <= 500 && (
        <div className="navbar">
          <div className="navbarleft">
            <li className="item">
              <MenuIcon
                style={{ fontSize: "10px" }}
                className="icon"
                onClick={() => setTodisplay(!todisplay)}
              />
            </li>
            <li className="item take-books2">Take Books!!!</li>
            <li className="item" onClick={() => navigate("/")}>
              Home Page
            </li>
          </div>
        </div>
      )}
      {windowWidth <= 500 && todisplay && (
        <div className="dropdown">
          {isuser ? (
            <div className="navbarleft2">
              <li
                className="item"
                onClick={() => {
                  setTodisplay(false);
                  navigate(`/${id}`);
                }}
              >
                {curruser}
              </li>
              <li
                className="item"
                onClick={() => {
                  setTodisplay(false);
                  navigate(`/${id}/mybooks`);
                }}
              >
                My Books
              </li>
              <li
                className="item"
                onClick={() => {
                  setTodisplay(false);
                  navigate(`/${id}/lendedbooks`);
                }}
              >
                Lended Books
              </li>
              <li
                className="item"
                onClick={() => {
                  setTodisplay(false);
                  navigate(`/${id}/bookings`);
                }}
              >
                My Bookings
              </li>
              <li
                className="item"
                onClick={() => {
                  setTodisplay(false);
                  logout();
                }}
              >
                LogOut
              </li>
            </div>
          ) : (
            <div className="navbarright">
              <li
                className="item"
                onClick={() => {
                  setTodisplay(false);
                  navigate("/login");
                }}
              >
                LogIn
              </li>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
