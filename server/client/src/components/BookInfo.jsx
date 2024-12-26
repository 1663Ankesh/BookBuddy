import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const Book = () => {
  let navigate = useNavigate();
  let { curruser, curruseremail, isuser, id } = useContext(UserContext);

  let params = useParams();

  const [book, setBook] = useState({});
  const [owner, setOwner] = useState({});

  const getdata = useCallback(async () => {
    try {
      const result = await fetch(
        process.env.REACT_APP_Host_Api + `/api/book/${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const book = await result.json();

      if (book.error) {
        alert(book.error);
        navigate("/");
      } else {
        setBook(book.result);
        setOwner(book.owner);
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
      alert("Failed to fetch book details.");
    }
  }, [params.id, navigate]);

  useEffect(() => {
    getdata();
  }, [curruser, curruseremail, isuser, id, getdata]);

  async function handlebook() {
    let owner_id = owner.owner_id;

    console.log(id, owner_id);

    let result = await fetch(
      process.env.REACT_APP_Host_Api + `/api/book/${params.id}`,
      {
        method: "POST",
        body: JSON.stringify({ id, owner_id }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    result = await result.json();

    if (result.error) {
      alert(result.error);
    } else {
      alert("Booked");
      navigate(`/${id}/bookings`);
    }
  }

  return (
    <div className="bookbackground">
      <div className="bookblock">
        <div className="book">
          <img
            src={`${process.env.REACT_APP_Host_Api}/uploads/${book.img}`}
            alt="PIC"
            className="bookimage"
          />
          <div className="bookdetailsparent">
            <div className="bookdetails">
              <div className="booktitle">
                <span>Title : </span>
                {book.booktitle}
              </div>
              <div className="author">
                <span>Author : </span>
                {book.author}
              </div>
              <div className="edition">
                <span>Edition : </span>
                {book.edition}
              </div>
              <div className="genre">
                <span>Genre : </span>
                {book.genre}
              </div>
              <div className="condition">
                <span>Condition : </span>
                {book.condition}
              </div>
              <div className="mrp">
                <span>
                  MRP of book :{" "}
                  <CurrencyRupeeIcon style={{ fontSize: "20px" }} />
                </span>
                {book.mrp}
              </div>
            </div>
            <div className="bookownerdetails">
              <div className="ownername">
                <span>Owner : </span>
                {owner.owner_name}
              </div>
              <div className="ownerphn">
                <span>Owner Phone : </span>
                {owner.owner_phn}
              </div>
              <div className="ownerplace">
                <span>Owner Place : </span>
                {owner.owner_place}
              </div>
              <div className="ownerstate">
                <span>Owner State : </span>
                {owner.owner_state}
              </div>
              <div className="ownerpincode">
                <span>Pincode : </span>
                {owner.owner_pincode}
              </div>
            </div>
          </div>
        </div>

        <div className="bookbuttondiv">
          {id !== undefined && id.length ? (
            <>
              {id === owner.owner_id ? (
                <>
                  <div className="cannotbookbtn">Cannot Book Own Book</div>
                  <div
                    className="updatebook"
                    onClick={() => navigate(`/book/${params.id}/update`)}
                  >
                    Update Book Info
                  </div>
                </>
              ) : (
                <>
                  <div className="bookbtn" onClick={handlebook}>
                    Book
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="loginbtn" onClick={() => navigate("/login")}>
                Login to Book
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
