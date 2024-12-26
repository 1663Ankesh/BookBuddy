import React from "react";

const BookingReceipt = ({ booking, book, owner, buyer }) => (
  <div className="bookingreceiptbackground">
    <div className="bookingreceipt">
      <div className="receiptdiv1">
        <img
          src={`${process.env.REACT_APP_Host_Api}/uploads/${booking.bookid}_img.jpg`}
          alt="PIC"
          className="bookimage"
        />
        <div className="div1details">
          <div className="bookingid">
            <span>Booking ID:</span> {booking._id}
          </div>
          <div className="dateofbooking">
            <span>Date of Booking: </span>
            {booking.dateofbooking}
          </div>
          <div className="timeofbooking">
            <span>Time of Booking: </span>
            {booking.timeofbooking}
          </div>

          <div className="bookid">
            <span>Book ID:</span> {booking.bookid}
          </div>
          <div className="bookname">
            <span>Book : </span>
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
        </div>
      </div>

      <div className="receiptdiv2">
        <div className="bookownerdetails">
          <div className="ownerid">
            <span>Owner ID :</span> {booking.ownerid}
          </div>
          <div className="ownername">
            <span>Owner Name :</span> {owner.owner_name}
          </div>
          <div className="ownerphn">
            <span>Owner Phone :</span> {owner.owner_phn}
          </div>
          <div className="ownerplace">
            <span>Owner Place :</span> {owner.owner_place}
          </div>
          <div className="ownerstate">
            <span>Owner State :</span> {owner.owner_state}
          </div>
          <div className="ownerpincode">
            <span>Owner Pincode :</span> {owner.owner_pincode}
          </div>
        </div>

        <div className="bookbuyerdetails">
          <div className="buyerid">
            <span>Buyer ID : </span>
            {buyer.buyer_id}
          </div>
          <div className="buyername">
            <span>Buyer Name : </span>
            {buyer.buyer_name}
          </div>
          <div className="buyerphn">
            <span>Buyer Phone : </span>
            {buyer.buyer_phn}
          </div>
          <div className="buyerplace">
            <span>Buyer Place :</span> {buyer.buyer_place}
          </div>
          <div className="buyerstate">
            <span>Buyer State :</span> {buyer.buyer_state}
          </div>
          <div className="buyerpincode">
            <span>Buyer Pincode :</span> {buyer.buyer_pincode}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BookingReceipt;
