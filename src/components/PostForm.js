import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";

import { useForm } from "./../util/hooks";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import FETCH_POSTS_QUERY from "../util/graphql";

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        username
        body
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;

const PostForm = () => {
  const { values, changeInput, formSubmit } = useForm(createPostCallback, {
    body: ""
  });
  const [error, setError] = useState("");

  const [createPost, { err }] = useMutation(CREATE_POST, {
    variables: values,

    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      const new_post = result.data.createPost;

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [new_post, ...data.getPosts] }
      });
      values.body = "";
      setError("")
    },
    onError(e) {
      console.log(err)
      setError(e.graphQLErrors[0].message);
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <div>
      <h2>Create a post: </h2>
      {error !== "" && <div className="ui error message">{error}</div>}
      <Form onSubmit={formSubmit} noValidate>
        <Form.Field>
          <Form.Input
            placeholder="What's up?"
            name="body"
            onChange={changeInput}
            value={values.body}
            error={error ? true : false}
          />

          <Button type="submit" color="orange">
            Post
          </Button>
        </Form.Field>
      </Form>
    </div>
  );
};

export default PostForm;
