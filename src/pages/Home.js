import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { AuthContext } from "./../context/auth";
import PostForm from "../components/PostForm";
import FETCH_POSTS_QUERY from "../util/graphql";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  useEffect(() => {
    if (data) {
      setPosts(data.getPosts);
    }
  }, [data]);

  return (
    <Grid columns={3} divided stretched>
      <Grid.Row>
        <h1 className="pageTitle">Recent posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <Transition.Group>
           {posts.length > 0 && posts.map(post => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} setPosts={setPosts}/>
            </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
