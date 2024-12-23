import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const MyBooks = () => {
  let {
    curruser,
    setCurruser,
    curruseremail,
    setCurruseremail,
    isuser,
    setIsuser,
  } = useContext(UserContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (!curruser || !curruseremail || !isuser) {
      alert("Please Login");
      navigate("/login");
    } else {
      getdata();
    }
  }, [curruser, curruseremail, isuser]);

  const [books, setBooks] = useState([]);

  let params = useParams();

  async function getdata() {
    let result = await fetch(
      process.env.React_App_Host_Api + `/api/user/${params.id}/mybooks`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    result = await result.json();
    if (result.error) {
      alert(result.error);
      navigate("/");
    } else {
      setBooks(result);
    }
  }

  return (
    <div className="mybookspage">
      <div className="addbookbtn">
        <button onClick={() => navigate("/addbook")}>Add Your Book</button>
      </div>
      <div className="homepage">
        {!books.length ? (
          <>No Books</>
        ) : (
          books.map((value, id) => {
            return (
              <div
                className="books"
                key={id}
                onClick={() => navigate(`/book/${value._id}`)}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/${value.img}`}
                  alt="PIC"
                  className="bookimage"
                />
                <div className="book-otherinfo">
                  <div className="booktitle">
                    <span>Title : {value.booktitle}</span>
                  </div>
                  <div className="author">
                    <span>Author : {value.author}</span>
                  </div>
                  <div className="edition">
                    <span>Edition : {value.edition}</span>
                  </div>
                  <div className="genre">
                    <span>Genre : {value.genre}</span>
                  </div>
                  <div className="condition">
                    <span>Condition : {value.condition}</span>
                  </div>
                  <div className="mrp">
                    <span>
                      MRP : <CurrencyRupeeIcon style={{ fontSize: "14px" }} />
                      {value.mrp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyBooks;
