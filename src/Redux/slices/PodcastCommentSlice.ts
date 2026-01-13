import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { use } from "react";
import { json } from "stream/consumers";

export type Comment = {
  sanityPodcastId: string;
  PodcastId: number;
  CommentId: number;
  userId: number;
  comment: string;
  parentCommentId?: number | null;
  likeCount: number;
  likedBy: number[];
  replies?: Comment[];
  createdAt: string;
};

type EpisodeCommentsState = {
  loading: boolean;
  error: string | null;
  tree: Comment[];
};

type CommentsState = {
  byEpisode: Record<string, EpisodeCommentsState>;
};

const initialState: CommentsState = {
  byEpisode: {},
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

const updateCommentLikesInTree = (
  tree: Comment[],
  commentId: number,
  likeCount: number,
  likedBy: number[]
): Comment[] => {
  return tree.map((c) => {
    if (c.CommentId === commentId) {
      return {
        ...c,
        likeCount,
        likedBy,
      };
    }

    if (c.replies?.length) {
      return {
        ...c,
        replies: updateCommentLikesInTree(
          c.replies,
          commentId,
          likeCount,
          likedBy
        ),
      };
    }

    return c;
  });
};

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (
    { episodeId, token }: { episodeId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}podcasts/comments?sanityPodcastId=${episodeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load comments");

      const data = await res.json();
      return { episodeId, comments: data.data };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

type PostCommentResult = {
  episodeId: string;
  comment: Comment;
};

export const postComment = createAsyncThunk<
  PostCommentResult,
  {
    episodeId: string;
    token: string;
    comment: string;
    parentCommentId?: number;
  }
>(
  "comments/post",
  async (
    { episodeId, token, comment, parentCommentId },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}podcasts/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sanityPodcastId: episodeId,
            comment,
            parentCommentId: parentCommentId ?? null,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to post comment");

      const data = await res.json();
      console.log(data);
      

      return {
        episodeId,
        comment: {
          ...data.data,
          likeCount: 0,
          likedBy: [],
          replies: [],
        },
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
      const alreadyLiked = c.likedBy.includes(userId);

      return {
        ...c,
        likedBy: alreadyLiked
          ? c.likedBy.filter((id) => id !== userId)
          : [...c.likedBy, userId],
        likeCount: alreadyLiked ? c.likeCount - 1 : c.likeCount + 1,
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
      episodeId,
      commentId,
      token,
      isLiked,
      userId,
    }: {
      episodeId: string;
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

      return { episodeId, commentId, isLiked: !isLiked, userId };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCommentLikeCount = createAsyncThunk(
  "comments/fetchLikeCount",
  async (
    {
      episodeId,
      commentId,
      token,
    }: {
      episodeId: string;
      commentId: number;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}podcasts/comments/count?CommentId=${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch like count");

      const data = await res.json();

      return {
        episodeId,
        commentId,
        likeCount: data.likeCount,
        likedBy: data.likedBy,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCommentLikes = createAsyncThunk(
  "comments/fetchLikes",
  async (
    {
      episodeId,
      commentId,
      token,
    }: {
      episodeId: string;
      commentId: number;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}podcasts/comments/count?CommentId=${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch likes");

      const data = await res.json();

      return {
        episodeId,
        commentId,
        likeCount: data?.data?.likeCount,
        likedBy: data?.data?.likedUsers,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetch comments */
      .addCase(fetchComments.pending, (state, action) => {
        const id = action.meta.arg.episodeId;
        state.byEpisode[id] = {
          loading: true,
          error: null,
          tree: [],
        };
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { episodeId, comments } = action.payload;

        const normalized = comments.map((c: Comment) => ({
          ...c,
          likeCount: c.likeCount ?? 0,
          likedBy: c.likedBy ?? [],
        }));

        state.byEpisode[episodeId] = {
          loading: false,
          error: null,
          tree: buildCommentTree(normalized),
        };
      })

      .addCase(fetchComments.rejected, (state, action) => {
        const id = action.meta.arg.episodeId;
        state.byEpisode[id] = {
          loading: false,
          error: action.payload as string,
          tree: [],
        };
      })

      /* like / unlike comment */
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { episodeId, commentId, isLiked, userId } = action.payload;

        const episodeComments = state.byEpisode[episodeId];
        if (!episodeComments) return;

        episodeComments.tree = updateCommentLike(
          episodeComments.tree,
          commentId,
          isLiked,
          userId
        );
      })

      .addCase(fetchCommentLikes.fulfilled, (state, action) => {
        const { episodeId, commentId, likeCount, likedBy } = action.payload;

        const episode = state.byEpisode[episodeId];
        if (!episode) return;

        episode.tree = updateCommentInTree(episode.tree, commentId, (c) => ({
          ...c,
          likeCount,
          likedBy,
        }));
      })
      .addCase(postComment.fulfilled, (state, action) => {
        const { episodeId, comment } = action.payload;

        const episode = state.byEpisode[episodeId];
        if (!episode) return;

        // Root comment
        if (!comment.parentCommentId) {
          episode.tree.unshift(comment);
          return;
        }

        // Reply comment
        episode.tree = updateCommentInTree(
          episode.tree,
          comment.parentCommentId,
          (parent) => ({
            ...parent,
            replies: [...(parent.replies || []), comment],
          })
        );
      });
  },
});

export default commentsSlice.reducer;

export const { reducer: commentsReducer } = commentsSlice;
