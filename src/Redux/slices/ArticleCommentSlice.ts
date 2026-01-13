import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { use } from "react";
import { json } from "stream/consumers";
import { article } from "../../../sanity/schemaTypes/article";

export type Comment = {
  sanityArticleId: string;
  ArticleId: number;
  CommentId: number;
  userId: number;
  comment: string;
  parentCommentId?: number | null;
  level: number;
  likeCount: number;
  likedBy: number[];
  replies?: Comment[];
  createdAt: string;
};

type articleCommentsState = {
  loading: boolean;
  error: string | null;
  tree: Comment[];
};

type ArticleCommentsState = {
  byArticle: Record<string, articleCommentsState>;
};

const initialState: ArticleCommentsState = {
  byArticle: {},
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
        replies: updateCommentInTree(
          comment.replies,
          commentId,
          updater,
        ),
        ...comment,
      };
    }

    return comment;
  });
}


export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (
    { articleId, token }: { articleId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}articles/comments?sanityArticleId=${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load comments");

      const data = await res.json();
      return { articleId, comments: data.data };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const postComment = createAsyncThunk(
  "comments/post",
  async (
    {
      articleId,
      token,
      comment,
      parentCommentId,
    }: {
      articleId: string;
      token: string;
      comment: string;
      parentCommentId?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}articles/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sanityArticleId: articleId,
            comment,
            parentCommentId: parentCommentId ?? null,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to post comment");

      return {
        articleId,
        comment: data.data, // 👈 VERY IMPORTANT
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
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
        likedBy: isLiked ? [...c.likedBy, userId] : c.likedBy.filter((id) => id !== userId),
        likeCount: isLiked ? c.likeCount - 1 : c.likeCount + 1,
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


const articleCommentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetch comments */
      .addCase(fetchComments.pending, (state, action) => {
        const id = action.meta.arg.articleId;
        state.byArticle[id] = {
          loading: true,
          error: null,
          tree: [],
        };
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { articleId, comments } = action.payload;
        state.byArticle[articleId] = {
          loading: false,
          error: null,
          tree: buildCommentTree(comments),
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const id = action.meta.arg.articleId;
        state.byArticle[id] = {
          loading: false,
          error: action.payload as string,
          tree: [],
        };
      })

      /* like / unlike comment */
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { articleId, commentId, isLiked, userId } = action.payload;

        const episodeComments = state.byArticle[articleId];
        if (!episodeComments) return;

        episodeComments.tree = updateCommentLike(
          episodeComments.tree,
          commentId,
          isLiked,
          userId
        );
      })
      .addCase(postComment.fulfilled, (state, action) => {
  const { articleId, comment } = action.payload;

  const articleComments = state.byArticle[articleId];
  if (!articleComments) return;

  // Root comment
  if (!comment.parentCommentId) {
    articleComments.tree.unshift({
      ...comment,
      replies: [],
    });
  } 
  // Reply
  else {
    articleComments.tree = updateCommentInTree(
      articleComments.tree,
      comment.parentCommentId,
      (parent) => ({
        ...parent,
        replies: [...(parent.replies || []), comment],
      })
    );
  }
});

  },
});


export default articleCommentsSlice.reducer;

export const { reducer: articleCommentsReducer } = articleCommentsSlice;