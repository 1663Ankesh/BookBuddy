import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const HomePage = () => {
  useEffect(() => {
    getdata();
    console.log(books);
  }, []);

  let navigate = useNavigate();
  const [books, setBooks] = useState([]);

  async function getdata() {
    let result = await fetch(process.env.React_App_Host_Api + "/api/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    result = await result.json();
    if (result.error) {
      alert(result.error);
    } else {
      setBooks(result);
    }
  }

  console.log(books[0]);
  return (
    <>
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
                  src={`${process.env.React_App_Host_Api}/uploads/${value.img}`}
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
                  <div className="downblock">
                    <div className="left">
                      <div className="edition">
                        <span>Edition : {value.edition}</span>
                      </div>
                      <div className="genre">
                        <span>Genre : {value.genre}</span>
                      </div>
                    </div>
                    <div className="right">
                      <div className="condition">
                        <span>Condition : {value.condition}</span>
                      </div>
                      <div className="mrp">
                        <span>
                          Book MRP :{" "}
                          <CurrencyRupeeIcon style={{ fontSize: "14px" }} />
                          {value.mrp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default HomePage;
