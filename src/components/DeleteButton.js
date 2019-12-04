import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import FETCH_POSTS_QUERY from "../util/graphql";
import MyPopup from "../util/Popup";

const DeleteButton = ({ postId, callback, setPosts, commentId }) => {
  const [confirm, setConfirm] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirm(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });

        data.getPosts = data.getPosts.filter(post => post.id !== postId);

        if (setPosts) setPosts(data.getPosts);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: data
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });

  return (
    <>
      <MyPopup content={commentId ? "Delete a comment" : "Delete a post"}>
        <Button
          floated="right"
          as="div"
          color="red"
          onClick={() => setConfirm(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
