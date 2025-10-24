import React, { useState, useEffect, useRef, useCallback } from "react";
import AppLayout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Search,
  MoreHorizontal,
  MessageCircle,
  UserCircle,
  Trash2,
  EyeOff,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BiUpvote } from "react-icons/bi";
import * as communityAPI from "@/apis/community";
import useStore from "@/store";

/**
 * CommentSection
 * - shows comments for a post
 * - optimistic comment addition
 * - optimistic delete for comment owned by current user
 */
const CommentSection = ({ post, isExpanded, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [optimisticComments, setOptimisticComments] = useState([]);
  const { user } = useStore((state) => state.auth);

  useEffect(() => {
    if (isExpanded && post?.id) fetchComments();
    else if (!isExpanded) setOptimisticComments([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, post?.id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getComments(post.id);
      if (response.success) setComments(response.data || []);
      else {
        toast.error("Failed to load comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const commentContent = newComment;
    const tempComment = {
      id: `temp-${Date.now()}`,
      post_id: post.id,
      user_id: user.id,
      content: commentContent,
      created_at: new Date().toISOString(),
      name: user.name||"You",
    };

    // optimistic add
    setOptimisticComments((prev) => [...prev, tempComment]);
    setNewComment("");
    setSubmitting(true);

    try {
      const response = await communityAPI.createComment(
        post.id,
        commentContent
      );
      if (response.success) {
        // remove optimistic and append actual
        setOptimisticComments((prev) =>
          prev.filter((c) => c.id !== tempComment.id)
        );
        setComments((prev) => [...prev, response.data]);
        toast.success("Comment added successfully");
      } else {
        // remove optimistic
        setOptimisticComments((prev) =>
          prev.filter((c) => c.id !== tempComment.id)
        );
        toast.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      setOptimisticComments((prev) =>
        prev.filter((c) => c.id !== tempComment.id)
      );
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Optimistic delete for comments owned by current user
  const handleDeleteComment = async (commentId) => {
    // do nothing for optimistic comment id (temp-) because it's local only
    if (commentId.startsWith("temp-")) {
      setOptimisticComments((prev) => prev.filter((c) => c.id !== commentId));
      return;
    }

    const deleted = comments.find((c) => c.id === commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId)); // optimistic remove

    toast.loading("Deleting comment...", { id: `del-comment-${commentId}` });

    try {
      const response = await communityAPI.deleteComment(commentId);
      if (response.success) {
        toast.success("Comment deleted", { id: `del-comment-${commentId}` });
      } else {
        // revert
        setComments((prev) => [...prev, deleted]);
        toast.error("Failed to delete comment", {
          id: `del-comment-${commentId}`,
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setComments((prev) => [...prev, deleted]);
      toast.error("Failed to delete comment", {
        id: `del-comment-${commentId}`,
      });
    }
  };

  // merge real and optimistic comments; optimistic ones appear last here
  const allComments = [...comments, ...optimisticComments];

  if (!isExpanded) return null;

  return (
    <div className="ml-13 mt-3 pt-3 border-t border-gray-100">
      {/* Add comment */}
      <div className="space-y-3 mb-4">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px]"
        />
        <Button
          onClick={handleSubmitComment}
          disabled={submitting || !newComment.trim()}
          className="w-full"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      {/* Comments list */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">Loading comments...</p>
          </div>
        ) : allComments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No comments yet</div>
        ) : (
          allComments.map((comment) => (
            <div
              key={comment.id}
              className={`flex space-x-3 p-3 rounded-lg ${
                comment.id.startsWith("temp-")
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50"
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                  <UserCircle className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-green-700">
                    {comment.name}
                    {comment.id.startsWith("temp-") && (
                      <span className="ml-2 text-xs text-blue-600">
                        (Posting...)
                      </span>
                    )}
                  </span>

                  {/* Show delete only to owner (non-temp comments). For temp comments user can 'cancel' by removing locally above */}
                  {comment.user_id === currentUserId &&
                    !comment.id.startsWith("temp-") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    )}
                </div>

                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * PostInput - create post with optimistic item shown as Anonymous
 */
const PostInput = ({ onPostCreated }) => {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useStore((state) => state.auth);

  const handleSubmit = async () => {
    if (!postContent.trim()) {
      toast.error("Please enter some content");
      return;
    }

    const tempPost = {
      id: `temp-${Date.now()}`,
      user_id: "current-user",
      content: postContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        name: user?.name || "Anonymous", // Use user's actual name
        program: user?.program || "Current Program",
        semester: user?.semester || 1,
        department: user?.department || "Current Department",
      },
      comments: [],
      score: 0,
      user_vote: 0,
    };

    // Add optimistic post immediately
    onPostCreated(tempPost);
    setPostContent("");
    setIsSubmitting(true);
    toast.loading("Uploading post...", { id: "create-post" });

    try {
      const response = await communityAPI.createPost(postContent);
      if (response.success) {
        // Replace optimistic with server response
        onPostCreated(response.data, tempPost.id);
        toast.success("Post uploaded successfully", { id: "create-post" });
      } else {
        onPostCreated(null, tempPost.id);
        toast.error("Failed to create post", { id: "create-post" });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      onPostCreated(null, tempPost.id);
      toast.error("Failed to create post", { id: "create-post" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm p-4  py-6 rounded-lg">
      <CardContent className="p-0 flex items-center gap-4 ">
        <div className="flex items-center  flex-1">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarFallback className="bg-gray-300 text-gray-600">
              <UserCircle className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <Input
            type="text"
            placeholder="What do you want to ask or share?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="flex-1  bg-[#f0f8ff] border-0 text-gray-700 placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 h-auto py-2.5 px-3 text-base"
          />
        </div>

        <div className="flex justify-start space-x-3 h-full ">
          <Button
            size="sm"
            className="bg-primary px-8 h-9.5  hover:bg-green-700 font-poppins text-[17px]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Post component - shows a single post, voting, comment toggle, etc.
 */
const Post = ({
  post,
  onVote,
  onCommentToggle,
  isCommentsExpanded,
  onDeletePost,
  onHidePost,
  currentUserId,
}) => {
  const [optimisticVote, setOptimisticVote] = useState(null);
  const [optimisticScore, setOptimisticScore] = useState(null);
  const [voteRequestController, setVoteRequestController] = useState(null);

  const currentVote =
    optimisticVote !== null ? optimisticVote : post.user_vote || 0;
  const currentScore =
    optimisticScore !== null ? optimisticScore : post.score || 0;

  const handleVote = async (value) => {
    if (voteRequestController) {
      voteRequestController.abort();
    }
    const controller = new AbortController();
    setVoteRequestController(controller);

    let newVote;
    let scoreChange = 0;
    if (currentVote === value) {
      newVote = 0;
      scoreChange = -value;
    } else {
      newVote = value;
      scoreChange = value - currentVote;
    }

    // optimistic update
    setOptimisticVote(newVote);
    setOptimisticScore(currentScore + scoreChange);

    try {
      await onVote(post.id, value, controller.signal);
      // server will update the proper state in page-level handler
    } catch (error) {
      if (error.name !== "AbortError") {
        // revert
        setOptimisticVote(null);
        setOptimisticScore(null);
        console.error("Error voting:", error);
      }
    } finally {
      setVoteRequestController(null);
    }
  };

  const handleDeletePost = async () => {
    toast.loading("Deleting post...", { id: "delete-post" });
    try {
      await onDeletePost(post.id);
      toast.success("Post deleted successfully", { id: "delete-post" });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post", { id: "delete-post" });
    }
  };

  const handleHidePost = () => {
    onHidePost(post.id);
    toast.success("Post hidden");
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 5) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white py-1">
      <CardContent className="py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Avatar className="w-10 h-10 mr-3">
              <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                <UserCircle className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-semibold text-green-700 text-sm block">
                {post.user?.name || "Anonymous"}
              </span>
              <p className="text-xs text-gray-500">
                {formatTimestamp(post.created_at)}
              </p>
            </div>
          </div>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-600 w-8 h-8"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currentUserId && post.user_id === currentUserId && (
                <DropdownMenuItem
                  onClick={handleDeletePost}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleHidePost}
                className="text-gray-600 hover:text-gray-700"
              >
                <EyeOff className="w-4 h-4 mr-2" /> Hide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Body */}
        <div className="ml-13">
          <p className="text-gray-700 text-sm leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6 ml-13 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote(1)}
              className="flex items-center text-sm font-medium h-auto !p-0"
            >
              <BiUpvote
                className="w-4.5 h-4.5 hover:text-green-400"
                color={currentVote === 1 ? "green" : "#8e94a0"}
              />
            </button>
            <button
              onClick={() => handleVote(-1)}
              className="flex items-center h-auto !p-0"
            >
              <BiUpvote
                className="w-4.5 h-4.5 rotate-180 hover:text-red-500"
                color={currentVote === -1 ? "red" : "#8e94a0"}
              />
            </button>
            <span className="text-xs">{currentScore}</span>
          </div>

          <Button
            variant="ghost"
            onClick={() => onCommentToggle(post.id)}
            className="flex items-center text-gray-500 hover:text-green-600 text-sm font-medium h-auto px-2 py-1"
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            <span className="text-xs">{post.comments?.length || 0}</span>
          </Button>
        </div>

        {/* Comments */}
        <CommentSection
          post={post}
          isExpanded={isCommentsExpanded}
          currentUserId={currentUserId}
        />
      </CardContent>
    </Card>
  );
};

/**
 * AskSeniorsPage - main page with feed, infinite scroll pagination
 */
export default function AskSeniorsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // initial loader control
  const [loadingMore, setLoadingMore] = useState(false); // subsequent page loader
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("newest");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  const initialLoad = useRef(true); // used to decide which loader to show
  const observerRef = useRef(null);

  // placeholder current user id (replace with actual auth context)
  const [currentUserId] = useState("8dfc1bbf-2e7a-42f0-8fe5-3df478298c21");

  // fetch posts (pageToLoad default is page state)
  const fetchPosts = useCallback(
    async (pageToLoad = 1, reset = false) => {
      if (!hasMore && !reset) return;
      try {
        // determine whether to show initial loader or 'load more' loader
        if (reset) {
          setPosts([]);
          setPage(1);
          setHasMore(true);
        }

        if (initialLoad.current && pageToLoad === 1) {
          // first ever load -> show main loader
          setLoading(true);
        } else if (pageToLoad === 1) {
          // explicit reset (e.g., filter changed) but not initial mount
          setLoading(true);
        } else {
          // loading more pages
          setLoadingMore(true);
        }

        // call API (your communityAPI.getPosts expects (page, limit, filter))
        const response = await communityAPI.getPosts(pageToLoad, limit, filter);
        if (response.success) {
          // support both response.data.posts and response.data shapes
          const fetched = response.data?.posts ?? response.data ?? [];

          setPosts((prev) => {
            if (reset || pageToLoad === 1) {
              return fetched;
            }
            // append but dedupe by id
            const existingIds = new Set(prev.map((p) => p.id));
            const newItems = fetched.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newItems];
          });

          // if returned fewer than limit -> no more pages
          setHasMore(fetched.length === limit);
          setPage(pageToLoad);
        } else {
          toast.error("Failed to load posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      } finally {
        // always turn off loaders
        initialLoad.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter, hasMore]
  );

  // initial load
  useEffect(() => {
    fetchPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when filter changes -> reset feed and fetch first page
  useEffect(() => {
    // reset initialLoad so we show main loader on filter change
    initialLoad.current = true;
    fetchPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // infinite scroll observer
  const sentinelRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore &&
            !loadingMore &&
            !loading
          ) {
            // load next page
            fetchPosts(page + 1, false);
          }
        },
        { rootMargin: "200px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [fetchPosts, hasMore, loadingMore, loading, page]
  );

  const handleVote = async (postId, value, signal) => {
    try {
      const response = await communityAPI.castVote(postId, value);
      if (response.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  score: response.data?.score ?? post.score,
                  user_vote: response.data?.user_vote ?? 0,
                }
              : post
          )
        );
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error voting:", error);
        throw error; // bubble to revert optimistic changes in child if needed
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await communityAPI.deletePost(postId);
      if (response.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        throw new Error("delete failed");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  const handleHidePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleCommentToggle = (postId) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  // onPostCreated: if tempPostId provided -> replace or remove; else add optimistic at top
  const handlePostCreated = (newPost, tempPostId = null) => {
    if (tempPostId) {
      if (newPost) {
        setPosts((prev) =>
          prev.map((p) => (p.id === tempPostId ? newPost : p))
        );
      } else {
        setPosts((prev) => prev.filter((p) => p.id !== tempPostId));
      }
    } else if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Search & Filter */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Your Question"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full px-5 py-3 rounded-md
                    bg-[#f0f8ff]
                    text-green-900 placeholder-green-700
                    focus:ring-2 focus:ring-green-400 focus-visible:ring-offset-0
                  "
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-700 pointer-events-none" />
              </div>
            </div>

            <Select onValueChange={(value) => setFilter(value)} value={filter}>
              <SelectTrigger className="w-[150px] bg-[#f0f8ff]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#f0f8ff]">
                <SelectGroup>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Feed */}
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          <PostInput onPostCreated={handlePostCreated} />

          <div className="space-y-5">
            {/* Single loader for initial load */}
            {loading && posts.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto" />
                <p className="mt-2 text-gray-600">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {searchQuery
                    ? "No posts match your search."
                    : "No posts yet. Be the first to ask a question!"}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                  onCommentToggle={handleCommentToggle}
                  isCommentsExpanded={expandedComments.has(post.id)}
                  onDeletePost={handleDeletePost}
                  onHidePost={handleHidePost}
                  currentUserId={currentUserId}
                />
              ))
            )}

            {/* loading more indicator */}
            {loadingMore && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto" />
                <p className="mt-2 text-sm text-gray-600">
                  Loading more posts...
                </p>
              </div>
            )}

            {/* sentinel element for infinite scroll */}
            <div ref={sentinelRef} />

            {/* no more */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center text-sm text-gray-500 py-4">
                You're all caught up
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
