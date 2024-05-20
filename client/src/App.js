import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import Homepage from "./components/HomePage";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import AddBook from "./components/AddBook";
import MyBooks from "./components/MyBooks";
import Book from "./components/Book";
import Bookings from "./components/Bookings";
import Booking from "./components/Booking";
import User from "./components/User";
import LendedBooks from "./components/LendedBooks";
import LendedBookReceipt from "./components/LendedBookReceipt";
import UpdateBook from "./components/UpdateBook";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <UserContextProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
            <Route path="/:id/mybooks" element={<MyBooks />}></Route>
            <Route path="/addbook" element={<AddBook />}></Route>
            <Route path="/book/:id" element={<Book />}></Route>
            <Route path="/:id/bookings" element={<Bookings />}></Route>
            <Route path="/:id/bookings/:id1" element={<Booking />}></Route>
            <Route path="/:id" element={<User />}></Route>
            <Route path="/:id/lendedbooks" element={<LendedBooks />}></Route>
            <Route
              path="/:id/lendedbookreceipt/:id1"
              element={<LendedBookReceipt />}
            ></Route>
            <Route path="book/:id/update" element={<UpdateBook />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
      <Footer />
    </div>
  );
};

export default App;
