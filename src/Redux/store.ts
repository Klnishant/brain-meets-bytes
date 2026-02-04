import { configureStore } from "@reduxjs/toolkit";
import { commentsReducer } from "./slices/PodcastCommentSlice";
import { article } from "../../sanity/schemaTypes/article";
import { articleCommentsReducer } from "./slices/ArticleCommentSlice";
import { threadCommentsReducer } from "./slices/ThreadCommentSlice";
import { categoriesReducer } from "./slices/CategorySlice";
import { pollsReducer } from "./slices/PollSlice";
import { authReducer } from "./slices/AuthSlice";
import { membershipReducer } from "./slices/MemberShipSlice";
import { loginReducer } from "./slices/LogInSlice";

export const store = configureStore({
  reducer: {
    comments: commentsReducer,
    articleComments: articleCommentsReducer,
    threadComments: threadCommentsReducer,
    categories: categoriesReducer,
    polls: pollsReducer,
    auth: authReducer,
    membership: membershipReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
