import { useEffect, useState } from "react";
import PostForm from "../../components/PostForm";
import axiosInstance from "../../lib/axios";
import PostCard from "../../components/PostCard";
const PostHome = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatedPost = (newPost) => {
    // so sánh 2 cách 
    setPosts([newPost, ...posts]);
    // setPosts((prev) => [newPost, ...prev]);
    fetchPosts();
  };
  const handleUpdatedPost = (newPost) => {
    // setPosts([newPost, ...posts]);
    fetchPosts();
  };
  // const handleDeletedPost = (newPost) => {
  //   setPosts(newPost);

  //   fetchPosts();
  // };
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <PostForm onPostCreated={handleCreatedPost} />
      <div>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onUpdatePost={handleUpdatedPost}
          />
        ))}
      </div>
    </div>
  );
};

export default PostHome;
