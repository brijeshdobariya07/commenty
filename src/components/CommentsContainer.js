import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShare, FaHeart } from "react-icons/fa";
// import { BsHeart } from "react-icons/bs";
import { IoTrashOutline } from "react-icons/io5";
import { ImPencil2 } from "react-icons/im";
import AddCommentBox from "./AddCommentBox";
import { useSelector, useDispatch } from "react-redux";
import { showCommentBox } from "../redux";

function CommentsContainer() {
  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoading = (value) => {
    setLoading(value);
  };

  useEffect(() => {
    setLoading(true);
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
      .then((res) => {
        setComments(res.data);
        setLoading(false);
      })
      .catch((err) => alert(err));
  };

  const getReplyComments = () => {
    axios
      .get("https://62207dfdce99a7de195b3ec5.mockapi.io/reply")
      .then((res) => {
        setReplyComments(res.data);
      })
      .catch((err) => alert(err));
  };

  const doLike = (index) => {
    const isThisCommentLike = comments[index].like;
    const commentId = comments[index].id;

    axios
      .put(
        `https://62207dfdce99a7de195b3ec5.mockapi.io/commenty/${commentId}`,
        {
          like: !isThisCommentLike,
        }
      )
      .then((res) => {
        let data = [...comments];
        data[index] = res.data;
        setComments(data);
      })
      .catch((err) => alert("cannot like"));
  };

  const handleDeleteButton = (index) => {
    alert("This Comment Will be delete");
    setLoading(true);

    const commentId = comments[index].id;

    axios
      .delete(
        `https://62207dfdce99a7de195b3ec5.mockapi.io/commenty/${commentId}`
      )
      .then((res) => {
        let data = [...comments];
        data.splice(index, 1);
        alsoDeleteReplyComments(commentId);
        setComments(data);
      })
      .then((res) => setLoading(false))
      .catch((err) => alert("cannot delete"));
  };

  const alsoDeleteReplyComments = (id) => {
    const thisDeleteReplyComments = replyComments.filter(
      (item) => Number(item.subid) === Number(id)
    );
    let replyCommentsData = [...replyComments];

    thisDeleteReplyComments?.forEach((reply) => {
      const deleteReplyCommentIndex = replyComments.findIndex(
        (item) => +item.id === +reply.id
      );

      axios
        .delete(`https://62207dfdce99a7de195b3ec5.mockapi.io/reply/${reply.id}`)
        .then((res) => {
          replyCommentsData.splice(deleteReplyCommentIndex, 1);
          setReplyComments([...replyCommentsData]);
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
      {loading ? (
        <div className="spineer">
          {/* <img src={process.env.PUBLIC_URL + "/Spinner-2.gif"} alt="" /> */}
          {/* <img
          src="https://cdn.dribbble.com/users/66340/screenshots/3089041/media/aa30c93ee2bc90a11dd699e9fdf8292d.gif"
          alt=""
          className="spinner-img"
        /> */}
        </div>
      ) : (
        ""
      )}
      <div className="comments-container">
        {comments.map((comment, index) => {
          return (
            <div key={comment.id} className="maped-comment">
              <div className="comment">
                <div className="comment-text">{comment.text}</div>
                <div className="action-icons">
                  <FaHeart
                    className={comment.like ? "like" : "unlike"}
                    onClick={() => doLike(index)}
                  />
                  <FaShare onClick={() => handleReplyButton(comment.id)} />
                  <ImPencil2
                    onClick={() => handleCommentEdit(comment)}
                    className="edit-icon"
                  />
                  <IoTrashOutline
                    onClick={() => handleDeleteButton(index)}
                    className="trash-icon"
                  />
                </div>
              </div>

              <div className="reply-comments">
                {replyComments
                  ?.filter((reply) => reply?.subid === Number(comment.id))
                  ?.map((reply) => (
                    <div className="reply-comment" key={reply.id}>
                      <div className="comment-text">{reply.text}</div>
                      <div className="action-icons">
                        <FaHeart
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
                  ))}
              </div>
            </div>
          );
        })}

        {isShowCommentBox && (
          <AddCommentBox
            addCommentToState={addCommentToState}
            addReplyToState={addReplyToState}
            handleLoading={handleLoading}
          />
        )}
      </div>
    </div>
  );
}

export default CommentsContainer;
