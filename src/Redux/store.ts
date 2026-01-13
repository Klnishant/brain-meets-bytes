import { configureStore } from "@reduxjs/toolkit";
import { commentsReducer } from "./slices/PodcastCommentSlice";
import { article } from "../../sanity/schemaTypes/article";
import { articleCommentsReducer } from "./slices/ArticleCommentSlice";
import { threadCommentsReducer } from "./slices/ThreadCommentSlice";

export const store = configureStore({
  reducer: {
    comments: commentsReducer,
    articleComments: articleCommentsReducer,
    threadComments: threadCommentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
