import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { useForm } from "./../util/hooks";
import { AuthContext } from "../context/auth";

const Register = props => {
  const context = useContext(AuthContext)
  const [error, setError] = useState({});

  const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
    email: ""
  };

  const { changeInput, formSubmit, values } = useForm(
    registerUser,
    initialState
  );

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData)
      props.history.push("/");
    },
    onError(err) {
      setError(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className="formContainer">
      <Form
        onSubmit={formSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1 className="pageTitle">Register</h1>
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
          label="email"
          type="email"
          error={error.email ? true : false}
          value={values.email}
          placeholder="Email"
          name="email"
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
        <Form.Input
          label="confirmPassword"
          type="password"
          value={values.confirmPsername}
          placeholder="Confirm Password"
          name="confirmPassword"
          error={error.confirmPassword ? true : false}
          onChange={changeInput}
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $password: String!
    $confirmPassword: String!
    $email: String!
  ) {
    register(
      registerInput: {
        username: $username
        password: $password
        confirmPassword: $confirmPassword
        email: $email
      }
    ) {
      id
      email
      createdAt
      username
      token
    }
  }
`;

export default withRouter(Register);
