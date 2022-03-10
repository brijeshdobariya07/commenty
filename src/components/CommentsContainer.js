import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShare } from "react-icons/fa";
import { BsHeart } from "react-icons/bs";
import { IoTrashOutline } from "react-icons/io5";
import { ImPencil2 } from "react-icons/im";
import AddCommentBox from "./AddCommentBox";
import { useSelector, useDispatch } from "react-redux";
import { showCommentBox } from "../redux";

function CommentsContainer() {
  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    getComments();
    getReplyComments();
  }, []);

  const isShowCommentBox = useSelector(
    (state) => state.showCommentBox.isShowCommentBox
  );

  const dispatch = useDispatch();

  const handleReplyButton = (id) => {
    dispatch(showCommentBox(id));
  };

  const getComments = () => {
    axios
      .get("https://62207dfdce99a7de195b3ec5.mockapi.io/commenty")
      .then((res) => setComments(res.data))
      .catch((err) => alert(err));
  };

  const getReplyComments = () => {
    axios
      .get("https://62207dfdce99a7de195b3ec5.mockapi.io/reply")
      .then((res) => setReplyComments(res.data))
      .catch((err) => alert(err));
  };

  const doLike = (id) => {
    const commentLike = comments.findIndex((comment) => comment.id === id);
    const isThisCommentLike = comments[commentLike].like;
    axios
      .put(`https://62207dfdce99a7de195b3ec5.mockapi.io/commenty/${id}`, {
        like: !isThisCommentLike,
      })
      .then((res) => {
        let data = [...comments];
        data[commentLike] = res.data;
        setComments(data);
      })
      .catch((err) => alert("cannot like"));
  };

  const handleDeleteButton = (id) => {
    alert("This Comment Will be delete");

    const commentDelete = comments.findIndex((comment) => comment.id === id);
    axios
      .delete(`https://62207dfdce99a7de195b3ec5.mockapi.io/commenty/${id}`)
      .then((res) => {
        let data = [...comments];
        data.splice(commentDelete, 1);
        alsoDeleteReplyComments(id);
        setComments(data);
      })
      .catch((err) => alert("cannot like"));
  };

  const alsoDeleteReplyComments = (id) => {
    const thisDeleteReplyComments = replyComments.filter(
      (item) => Number(item.subid) === Number(id)
    );
    let replyCommentsData = [...replyComments];

    thisDeleteReplyComments.forEach((reply) => {
      const deleteReplyCommentIndex = replyComments.findIndex(
        (item) => +item.id === +reply.id
      );

      axios
        .delete(`https://62207dfdce99a7de195b3ec5.mockapi.io/reply/${reply.id}`)
        .then((res) => {
          replyCommentsData.splice(deleteReplyCommentIndex, 1);
          setReplyComments(replyCommentsData);
        })
        .catch((err) => console.log(err));
    });
  };

  const handleCommentEdit = (comment) => {
    dispatch(showCommentBox(comment));
  };

  const addCommentToState = (data) => {
    const findThisCommentIndex = comments.findIndex(
      (item) => +item.id === +data.id
    );

    if (findThisCommentIndex !== -1) {
      let tempComments = [...comments];
      tempComments[findThisCommentIndex].text = data?.text || "";
      setComments(tempComments);
    } else {
      setComments((item) => [...item, data]);
    }
  };

  // Reply section

  const replyLike = (id) => {
    const commentLike = replyComments.findIndex((comment) => comment.id === id);
    const isThisCommentLike = replyComments[commentLike].like;
    axios
      .put(`https://62207dfdce99a7de195b3ec5.mockapi.io/reply/${id}`, {
        like: !isThisCommentLike,
      })
      .then((res) => {
        let data = [...replyComments];
        data[commentLike] = res.data;
        setReplyComments(data);
      })
      .catch((err) => alert(err));
  };

  const replyEdit = (reply) => {
    console.log(reply);
    dispatch(showCommentBox(reply));
  };

  const replyDelete = (id) => {
    alert("This Comment Will be delete");

    const commentDelete = replyComments.findIndex(
      (comment) => comment.id === id
    );
    axios
      .delete(`https://62207dfdce99a7de195b3ec5.mockapi.io/reply/${id}`)
      .then((res) => {
        let data = [...replyComments];
        data.splice(commentDelete, 1);
        setReplyComments(data);
      })
      .catch((err) => alert(err));
  };

  const addReplyToState = (data) => {
    const findThisCommentIndex = replyComments.findIndex(
      (item) => +item.id === +data.id
    );
    if (findThisCommentIndex !== -1) {
      let tempReplyComments = [...replyComments];
      tempReplyComments[findThisCommentIndex].text = data?.text || "";
      setReplyComments(tempReplyComments);
    } else {
      setReplyComments((item) => [...item, data]);
    }
  };

  return (
    <div>
      <div className="comments-container">
        {comments.map((comment) => {
          const { id, text, like } = comment;
          return (
            <div key={id} className="maped-comment">
              <div className="comment">
                <div className="comment-text">{text}</div>
                <div className="action-icons">
                  <BsHeart
                    className={like ? "like" : "unlike"}
                    onClick={() => doLike(id)}
                  />
                  <FaShare onClick={() => handleReplyButton(id)} />
                  <ImPencil2
                    onClick={() => handleCommentEdit(comment)}
                    className="edit-icon"
                  />
                  <IoTrashOutline
                    onClick={() => handleDeleteButton(id)}
                    className="trash-icon"
                  />
                </div>
              </div>

              <div className="reply-comments">
                {replyComments
                  .filter((reply) => reply.subid === Number(comment.id))
                  .map((reply) => {
                    return (
                      <div className="reply-comment" key={reply.id}>
                        <div className="comment-text">{reply.text}</div>
                        <div className="action-icons">
                          <BsHeart
                            className={reply.like ? "like" : "unlike"}
                            onClick={() => replyLike(reply.id)}
                          />
                          <ImPencil2
                            onClick={() => replyEdit(reply)}
                            className="edit-icon"
                          />
                          <IoTrashOutline
                            className="trash-icon"
                            onClick={() => replyDelete(reply.id)}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {isShowCommentBox ? (
          <AddCommentBox
            addCommentToState={addCommentToState}
            addReplyToState={addReplyToState}
          />
        ) : null}
      </div>
    </div>
  );
}

export default CommentsContainer;
