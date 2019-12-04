import React, { useContext, useState, useEffect, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Grid, Card, Image, Button, Icon, Form } from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../util/Popup";

const SinglePost = props => {
  const postId = props.match.params.postId;
  const [post, setPost] = useState(null);

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  let deletePostCallback = () => {
    props.history.push("/");
  };

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (data) {
      setPost(data.getPost);
    }
  }, [data]);

  let postMarkup;
  if (!post) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount
    } = post;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="left"
              size="tiny"
              src="https://fitnessclone.com/wp-content/uploads/2019/04/Cristiano-Ronaldo.png"
            />
            <Card.Header>{username}</Card.Header>
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <Card.Content>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content="Comment on post">
                  <Button
                    labelPosition="right"
                    as="div"
                    onClick={() => console.log("comment")}
                  >
                    <Button basic color="blue">
                      <Icon name="comment" />
                      Comments
                    </Button>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button blue"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        body
        username
        createdAt
        id
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
