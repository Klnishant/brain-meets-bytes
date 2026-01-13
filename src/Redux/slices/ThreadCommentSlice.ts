import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { use } from "react";
import { json } from "stream/consumers";
import { article } from "../../../sanity/schemaTypes/article";
import toast from "react-hot-toast";

export type Comment = {
  _id: string;
  ThreadId: number;
  userId: number;
  comments: string;
  parentCommentId: number;
  CommentId: number;
  likes: number;
  isLikedByMe: false;
  replies?: Comment[];
  createdAt: string;
};

type threadCommentsState = {
  loading: boolean;
  error: string | null;
  tree: Comment[];
};

type ThreadCommentsState = {
  byThread: Record<string, threadCommentsState>;
};

const initialState: ThreadCommentsState = {
  byThread: {},
};

const buildCommentTree = (comments: Comment[]): Comment[] => {
  const map = new Map<number, Comment>();
  const roots: Comment[] = [];

  comments.forEach((c) => {
    map.set(c.CommentId, { ...c, replies: [] });
  });

  comments.forEach((c) => {
    if (c.parentCommentId) {
      map.get(c.parentCommentId)?.replies?.push(map.get(c.CommentId)!);
    } else {
      roots.push(map.get(c.CommentId)!);
    }
  });

  return roots;
};

const updateCommentInTree = (
  tree: Comment[],
  commentId: number,
  updater: (c: Comment) => Comment
): Comment[] => {
  return tree.map((comment) => {
    if (comment.CommentId === commentId) {
      return updater(comment);
    }

    if (comment.replies?.length) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, updater),
      };
    }

    return comment;
  });
};

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (
    { ThreadId, token }: { ThreadId: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}threads/comments/like?ThreadId=${ThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load comments");

      const data = await res.json();
      return { ThreadId, comments: data.data };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const postComment = createAsyncThunk(
  "comments/post",
  async (
    {
      ThreadId,
      token,
      comments,
      userId,
    }: {
      ThreadId: number;
      token: string;
      comments: string;
      userId?: number;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}threads/comments?ThreadId=${ThreadId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comments,
            userId,
          }),
        }
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error("Failed to post comment");

      // Re-sync comments
      return {
        ThreadId,
        comment: data.data, // newly created comment
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const replyComment = createAsyncThunk(
  "comments/reply",
  async (
    {
      userId,
      token,
      comment,
      parentCommentId,
      ThreadId,
    }: {
      userId: number;
      token: string;
      comment: string;
      parentCommentId: number;
      ThreadId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/comments/reply?ThreadId=${ThreadId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            parentCommentId,
            comments: comment,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to send reply");

      const data = await res.json();

      toast.success("Message sent successfully!");
      return {
        ThreadId,
        comment: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const updateCommentLike = (
  comments: Comment[],
  commentId: number,
  isLiked: boolean,
  userId: number
): Comment[] => {
  return comments.map((c) => {
    if (c.CommentId === commentId) {
      return {
        ...c,
        likes: isLiked ? c.likes - 1 : c.likes + 1,
      };
    }

    if (c.replies?.length) {
      return {
        ...c,
        replies: updateCommentLike(c.replies, commentId, isLiked, userId),
      };
    }

    return c;
  });
};

export const toggleCommentLike = createAsyncThunk(
  "comments/toggleLike",
  async (
    {
      articleId,
      commentId,
      token,
      isLiked,
      userId,
    }: {
      articleId: string;
      commentId: number;
      token: string;
      isLiked: boolean;
      userId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}podcasts/comments/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CommentId: commentId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to like comment");
      const data = await res.json();
      console.log(data?.message);

      return { articleId, commentId, isLiked: !isLiked, userId };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const threadCommentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetch comments */
      .addCase(fetchComments.pending, (state, action) => {
        const id = action.meta.arg.ThreadId;
        state.byThread[id] = {
          loading: true,
          error: null,
          tree: [],
        };
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { ThreadId, comments } = action.payload;
        state.byThread[ThreadId] = {
          loading: false,
          error: null,
          tree: comments,
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const id = action.meta.arg.ThreadId;
        state.byThread[id] = {
          loading: false,
          error: action.payload as string,
          tree: [],
        };
      })

      /* like / unlike comment */
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { articleId, commentId, isLiked, userId } = action.payload;

        const episodeComments = state.byThread[articleId];
        if (!episodeComments) return;

        episodeComments.tree = updateCommentLike(
          episodeComments.tree,
          commentId,
          isLiked,
          userId
        );
      })
      .addCase(postComment.fulfilled, (state, action) => {
        const { ThreadId, comment } = action.payload;

        const thread = state.byThread[ThreadId];
        if (!thread) return;

        // root comment
        if (!comment.parentCommentId) {
          thread.tree.unshift({ ...comment, replies: [] });
          return;
        }

        // reply comment → insert into tree
        thread.tree = updateCommentInTree(
          thread.tree,
          comment.parentCommentId,
          (parent) => ({
            ...parent,
            replies: [...(parent.replies || []), { ...comment, replies: [] }],
          })
        );
      })

      .addCase(replyComment.fulfilled, (state, action) => {
        const { ThreadId, comment } = action.payload;

        const thread = state.byThread[ThreadId];
        if (!thread) return;

        thread.tree = updateCommentInTree(
          thread.tree,
          comment.parentCommentId,
          (parent) => ({
            ...parent,
            replies: [...(parent.replies || []), { ...comment, replies: [] }],
          })
        );
      });
  },
});

export default threadCommentsSlice.reducer;

export const { reducer: threadCommentsReducer } = threadCommentsSlice;
