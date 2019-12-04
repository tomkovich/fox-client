import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/Popup";

const PostCard = ({ setPosts, post }) => {
  const {
    username,
    body,
    createdAt,
    id,
    likeCount,
    commentCount,
    likes
  } = post;

  const { user } = useContext(AuthContext);

  let commentPost = e => {};

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="left"
          size="tiny"
          src="https://fitnessclone.com/wp-content/uploads/2019/04/Cristiano-Ronaldo.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <MyPopup content="Comment on post">
          <Button
            labelPosition="right"
            as={Link}
            to={`/posts/${id}`}
            onClick={commentPost}
          >
            <Button basic color="blue">
              <Icon name="comment" />
              Comments
            </Button>
            <Label as="div" basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && (
          <DeleteButton postId={id} setPosts={setPosts} />
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
