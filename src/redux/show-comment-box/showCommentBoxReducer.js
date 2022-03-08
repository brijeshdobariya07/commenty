import { SHOW_COMMENT_BOX } from "./showCommentBoxTypes";

const initialState = {
  isShowCommentBox: false,
};

const showCommentBoxReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_COMMENT_BOX:
      return {
        ...state,
        isShowCommentBox: !state.isShowCommentBox,
        replyCommentId: action.payload,
      };

    default:
      return state;
  }
};

export default showCommentBoxReducer;
