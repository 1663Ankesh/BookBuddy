import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

const LendedBooks = () => {
  let { curruser, curruseremail, isuser, id } = useContext(UserContext);
  let navigate = useNavigate();
  let params = useParams();

  const [lendedbooks, setLendedbooks] = useState([]);

  const getdata = useCallback(async () => {
    try {
      let result = await fetch(
        process.env.REACT_APP_Host_Api + `/api/user/${id}/lendedbooks`,
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
        setLendedbooks(result);
      }
    } catch (e) {
      console.error("Error fetching lended books data:", e);
      alert("Failed to fetch lended books details.");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!curruser || !curruseremail || !isuser || !id) {
      alert("Please Login");
      navigate("/login");
    } else {
      getdata();
    }
  }, [curruser, curruseremail, isuser, id, navigate, getdata]);

  return (
    <div className="lendedbackground">
      <div className="homepage">
        {!lendedbooks.length ? (
          <>No Books</>
        ) : (
          lendedbooks.map((booking, id) => {
            console.log(booking);

            let date = booking.dateofbooking;
            date = date.split("T")[0];

            return (
              <div
                className="books"
                key={id}
                onClick={() =>
                  navigate(`/${params.id}/lendedbookreceipt/${booking._id}`)
                }
              >
                <img
                  src={`${process.env.REACT_APP_Host_Api}/uploads/${booking.bookid}_img.jpg`}
                  alt="PIC"
                  className="bookimage"
                />
                <div className="lendedbookdetails">
                  <div className="bookingid">
                    <span>Booking ID : </span>
                    {booking._id}
                  </div>
                  <div className="dateofbooking">
                    <span>Date of Booking : </span>
                    {date}
                  </div>
                  <div className="timeofbooking">
                    <span>Time of Booking : </span>
                    {booking.timeofbooking}
                  </div>
                  <div className="bookid">
                    <span>Book ID : </span>
                    {booking.bookid}
                  </div>
                  <div className="ownerid">
                    <span>Buyer ID : </span>
                    {booking.buyerid}
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

export default LendedBooks;
