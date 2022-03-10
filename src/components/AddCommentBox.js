import React, { useEffect, useState } from "react";
import { showCommentBox } from "../redux";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddCommentBox(props) {
  const [commentMsg, setCommentMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addCommentToState, addReplyToState } = props;
  const replyCommentId = useSelector(
    (state) => state.showCommentBox.replyCommentId
  );

  const editCommentText = replyCommentId?.text || "";
  const editCommentId = replyCommentId?.id || null;
  const editCommentIfSubId = replyCommentId?.subid;

  useEffect(() => {
    setCommentMsg(editCommentText);
  }, [editCommentText]);

  const handleSubmitButton = () => {
    if (commentMsg !== "" && replyCommentId === "") {
      axios
        .post("https://62207dfdce99a7de195b3ec5.mockapi.io/commenty", {
          text: commentMsg,
          like: false,
        })
        .then((res) => {
          dispatch(showCommentBox());
          addCommentToState(res.data);
        })
        .catch((err) => alert(err));
    } else if (commentMsg !== "" && replyCommentId !== "") {
      axios
        .post("https://62207dfdce99a7de195b3ec5.mockapi.io/reply", {
          text: commentMsg,
          like: false,
          subid: Number(replyCommentId),
        })
        .then((res) => {
          dispatch(showCommentBox());
          addReplyToState(res.data);
        });
    } else {
      alert("Please add Something");
    }

    if (
      editCommentText !== "" &&
      editCommentId !== null &&
      editCommentIfSubId === undefined
    ) {
      axios
        .put(
          `https://62207dfdce99a7de195b3ec5.mockapi.io/commenty/${editCommentId}`,
          {
            text: commentMsg,
          }
        )
        .then((res) => {
          addCommentToState(res.data);
        });
    }

    if (
      editCommentText !== "" &&
      editCommentId !== null &&
      editCommentIfSubId !== undefined
    ) {
      axios
        .put(
          `https://62207dfdce99a7de195b3ec5.mockapi.io/reply/${editCommentId}`,
          {
            text: commentMsg,
          }
        )
        .then((res) => {
          addReplyToState(res.data);
        });
    }

    navigate("/");
  };

  return (
    <div className="add-comment">
      <div>
        <h2>Add Comment</h2>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          onChange={(e) => setCommentMsg(e.target.value)}
          value={commentMsg}
        ></textarea>
        <br />
        <button
          className="add-comment-btn popup-btn"
          onClick={handleSubmitButton}
        >
          Submit
        </button>
        <button
          className="close-btn"
          onClick={() => dispatch(showCommentBox())}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default AddCommentBox;
