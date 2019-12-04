import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { useForm } from "./../util/hooks";
import { AuthContext } from "../context/auth";

const Login = props => {
  const context = useContext(AuthContext);
  const [error, setError] = useState({});

  const { changeInput, formSubmit, values } = useForm(loginCallback, {
    username: "",
    password: ""
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setError(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginCallback() {
    loginUser();
  }

  return (
    <div className="formContainer">
      <Form
        onSubmit={formSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1 className="pageTitle">Login</h1>
        <Form.Input
          label="username"
          type="text"
          value={values.username}
          placeholder="Username"
          name="username"
          error={error.username ? true : false}
          onChange={changeInput}
        />
        <Form.Input
          label="password"
          type="password"
          value={values.password}
          placeholder="password"
          name="password"
          error={error.password ? true : false}
          onChange={changeInput}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(error).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(error).map(err => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      createdAt
      username
      token
    }
  }
`;

export default withRouter(Login);
