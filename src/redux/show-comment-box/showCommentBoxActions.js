import { SHOW_COMMENT_BOX } from "./showCommentBoxTypes";

const showCommentBox = (id = "") => {
  return {
    type: SHOW_COMMENT_BOX,
    payload: id,
  };
};

export { showCommentBox };
