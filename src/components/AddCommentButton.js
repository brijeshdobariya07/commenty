import React from "react";
import { useDispatch } from "react-redux";
import { showCommentBox } from "../redux";

function AddCommentButton() {
  const dispatch = useDispatch();

  const handleButton = () => {
    dispatch(showCommentBox());
  };

  return (
    <div>
      <div className="add-comment-btn-container">
        <button onClick={handleButton} className="add-comment-btn">
          Add +
        </button>
      </div>
    </div>
  );
}

export default AddCommentButton;
