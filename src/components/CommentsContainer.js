import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegHeart, FaShare } from "react-icons/fa";

function CommentsContainer() {
  const [comments, setComments] = useState([]);

  const getComments = () => {
    axios
      .get("https://62207dfdce99a7de195b3ec5.mockapi.io/commenty")
      .then((res) => setComments(res.data))
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div>
      <div className="comments-container">
        {comments.map((comment) => {
          return (
            <div className="comment">
              <div className="comment-text">{comment.text}</div>
              <div className="action-icons">
                <FaRegHeart className={comment.like ? "like" : ""} />
                <FaShare />
              </div>
            </div>
          );
        })}
        <div className="comment">
          <div className="comment-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit,
            consectetur.
          </div>
          <div className="action-icons">
            <FaRegHeart />
            <FaShare />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsContainer;
