import React, { useContext, useEffect, useState } from "react";
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
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!curruser || !curruseremail || !isuser || !id) {
      navigate("/login");
    } else {
      getdata();
    }
  }, [curruser, curruseremail, isuser, id]);

  async function getdata() {
    let result = await fetch(
      process.env.React_App_Host_Api +
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
  }
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
