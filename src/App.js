import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Styled
import "semantic-ui-css/semantic.min.css";
import "./App.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";

// Components
import Navbar from "./components/Navbar";

// UI
import { Container } from "semantic-ui-react";

//  Util
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

const App = () => {
  return (
    <AuthProvider>
      <div className="containerApp">
        <Router>
          <Container>
            <Navbar />
            <Route exact path="/" render={() => <Home />} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <Route exact path="/posts/:postId" component={SinglePost} />
          </Container>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
