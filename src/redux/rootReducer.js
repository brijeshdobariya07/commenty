import { combineReducers } from "redux";

import showCommentBoxReducer from "./show-comment-box/showCommentBoxReducer";

const rootReducer = combineReducers({
  showCommentBox: showCommentBoxReducer,
});

export default rootReducer;
