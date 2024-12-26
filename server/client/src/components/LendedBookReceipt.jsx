import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import BookingReceipt from "./BookingReceipt";

const LendedBookReceipt = () => {
  let { curruser, curruseremail, isuser, id } = useContext(UserContext);
  let navigate = useNavigate();
  let params = useParams();

  const [booking, setBooking] = useState({});
  const [book, setBook] = useState({});
  const [owner, setOwner] = useState({});
  const [buyer, setBuyer] = useState({});

  const getdata = useCallback(async () => {
    try {
      let result = await fetch(
        process.env.REACT_APP_Host_Api +
          `/api/user/${params.id}/lendedbookreceipt/${params.id1}`,
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
        setBooking(result.booking);
        setBook(result.book);
        setOwner(result.owner);
        setBuyer(result.buyer);
      }
    } catch (e) {
      console.error("Error fetching lended book data:", e);
      alert("Failed to fetch lended book details.");
    }
  }, [params.id, params.id1, navigate]);

  useEffect(() => {
    if (!curruser || !curruseremail || !isuser || !id) {
      navigate("/login");
    } else {
      getdata();
    }
  }, [curruser, curruseremail, isuser, id, navigate, getdata]);

  return (
    <>
      <div className="booking">
        <BookingReceipt
          booking={booking}
          book={book}
          owner={owner}
          buyer={buyer}
        />
      </div>
    </>
  );
};

export default LendedBookReceipt;
