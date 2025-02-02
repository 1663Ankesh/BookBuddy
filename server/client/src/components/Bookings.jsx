import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  let { curruser, curruseremail, isuser, id } = useContext(UserContext);
  let navigate = useNavigate();

  let [bookings, setBookings] = useState([]);

  const getdata = useCallback(async () => {
    try {
      let result = await fetch(
        process.env.REACT_APP_Host_Api + `/api/user/${id}/bookings`,
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
        setBookings(result);
      }
    } catch (e) {
      console.error("Error fetching bookings data:", e);
      alert("Failed to fetch bookings details.");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!curruser || !curruseremail || !isuser || !id) {
      navigate("/login");
    } else {
      getdata();
    }
  }, [curruser, curruseremail, isuser, id, navigate, getdata]);

  return (
    <div className="bookingbackground">
      <div className="bookings">
        {!bookings.length ? (
          <>No Bookings</>
        ) : (
          bookings.map((booking, bookingid) => {
            let date = booking.dateofbooking;
            date = date.split("T")[0];

            return (
              <div
                className="booking"
                key={bookingid}
                onClick={() => navigate(`/${id}/bookings/${booking._id}`)}
              >
                <img
                  src={`${process.env.REACT_APP_Host_Api}/uploads/${booking.bookid}_img.jpg`}
                  alt="PIC"
                  className="bookimage"
                />
                <div className="bookingdetails">
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
                    <span>Owner ID : </span>
                    {booking.ownerid}
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

export default Bookings;
