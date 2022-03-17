import React, { useEffect, useState, useRef } from "react";
import { showCommentBox } from "../redux";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddCommentBox(props) {
  const [commentMsg, setCommentMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addCommentToState, addReplyToState } = props;
  const handleLoading = props.handleLoading;

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
    if (commentMsg && !replyCommentId) {
      handleLoading(true);
      dispatch(showCommentBox());
      axios
        .post("https://62207dfdce99a7de195b3ec5.mockapi.io/commenty", {
          text: commentMsg,
          like: false,
        })
        .then((res) => {
          // dispatch(showCommentBox());
          addCommentToState(res.data);
        })
        .then((res) => handleLoading(false))
        .catch((err) => alert(err));
    } else if (commentMsg && replyCommentId) {
      dispatch(showCommentBox());
      handleLoading(true);
      axios
        .post("https://62207dfdce99a7de195b3ec5.mockapi.io/reply", {
          text: commentMsg,
          like: false,
          subid: Number(replyCommentId),
        })
        .then((res) => {
          // dispatch(showCommentBox());
          addReplyToState(res.data);
        })
        .then((res) => handleLoading(false));
    } else {
      alert("Please add Something");
    }

    if (editCommentText && editCommentId && !editCommentIfSubId) {
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

    if (editCommentText && editCommentId && editCommentIfSubId) {
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

  // For Focus the textarea
  const focusTextArea = useRef(null);
  useEffect(() => {
    focusTextArea.current.focus();
  }, []);

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
          ref={focusTextArea}
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
