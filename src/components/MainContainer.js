import React from "react";
import { Routes, Route } from "react-router";
import AddCommentButton from "./AddCommentButton";
import CommentsContainer from "./CommentsContainer";
import Header from "./Header";

function MainContainer() {
  return (
    <div>
      <div className="main-container">
        <Header />
        <AddCommentButton />
        <Routes>
          <Route path="/" element={<CommentsContainer />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainContainer;
