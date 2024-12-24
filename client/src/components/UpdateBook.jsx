import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

const UpdateBook = () => {
  let {
    curruser,
    setCurruser,
    curruseremail,
    setCurruseremail,
    isuser,
    setIsuser,
    id,
  } = useContext(UserContext);

  let navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    if (!curruser || !curruseremail || !isuser) {
      alert("Please Login");
      navigate("/login");
    } else {
      getdata();
    }
  }, [curruser, curruseremail, isuser]);

  const [book, setBook] = useState({});

  async function getdata() {
    let result = await fetch(
      process.env.React_App_Host_Api + `/api/book/${params.id}/update`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    let book = await result.json();
    console.log(book);

    if (book.error) {
      alert(book.error);
      navigate(`/book/${params.id}`);
    } else {
      setBook(book);

      if (id === undefined || book.ownerId !== id) {
        console.log("id : ", id);
        console.log("owner : ", book.ownerId);
        alert("You cannot visit this page");
        navigate("/");
      } else {
        setBooktitle(book.booktitle);
        setEdition(book.edition);
        setAuthor(book.author);
        setGenre(book.genre);
        setCondition(book.condition);
        setMrp(book.mrp);
      }
    }
  }

  const [booktitle, setBooktitle] = useState("");
  const [edition, setEdition] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [condition, setCondition] = useState("");
  const [mrp, setMrp] = useState("");
  const [img, setImg] = useState("");

  const onImgChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("booktitle", booktitle);
    formData.append("edition", edition);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("condition", condition);
    formData.append("mrp", mrp);
    formData.append("img", img);
    formData.append("curruseremail", curruseremail);

    let result = await fetch(
      process.env.React_App_Host_Api + `/api/book/${params.id}/update`,
      {
        method: "POST",
        body: formData,
        // headers: {
        //   "Content-Type": "application/json",
        // },
        credentials: "include",
      }
    );
    result = await result.json();
    if (result.error) {
      alert(result.error);
    } else {
      alert("Book Updated");
      navigate(`/book/${params.id}`);
    }
  }

  return (
    <>
      <div className="addbookbackground">
        <form className="addbook" onSubmit={handleSubmit}>
          <div className="formheading">Update Book</div>

          <div className="field">
            <span>Title : </span>
            <input
              type="text"
              placeholder="Book Title"
              value={booktitle}
              onChange={(e) => setBooktitle(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <span>Edition :</span>
            <input
              type="number"
              placeholder="Edition"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <span>Author : </span>
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <span>Genre : </span>
            <input
              type="text"
              placeholder="Genre/Category of Book"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <span>Condition : </span>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="new">New</option>
              <option value="like new">Like New</option>
              <option value="old">Old</option>
              <option value="little torn">Little Torn</option>
            </select>
          </div>

          <div className="field">
            <span>MRP : </span>
            <input
              type="number"
              placeholder="MRP"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              required
            />
          </div>

          <div className="field image1">
            <span>Select Image :</span>
            <input
              type="file"
              id="img"
              name="img"
              accept=".jpg, .jpeg, .png"
              onChange={onImgChange}
            />
          </div>

          <div className="formbtns">
            <div className="submitbtn">
              <button type="submit">Submit</button>
            </div>
            <div className="back_btn">
              <button
                type="button"
                onClick={() => navigate(`/book/${params.id}`)}
              >
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateBook;
