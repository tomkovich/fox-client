import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  let pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);

  let state = {
    activeItem: path
  };

  let [activeItem, setActiveItem] = useState(state.activeItem);

  let handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const menuBar = user ? (
    <Menu secondary size="massive" color="orange">
      <Menu.Item name="username" active={activeItem === "home"}>
        <strong>{user.username}</strong>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout}>
          Logout
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu secondary size="massive" color="orange">
      <Menu.Item
        name="home"
        as={Link}
        to="/"
        active={activeItem === "home"}
        onClick={handleItemClick}
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          as={Link}
          to="/login"
          active={activeItem === "login"}
          onClick={handleItemClick}
        >
          Login
        </Menu.Item>
        <Menu.Item
          name="register"
          as={Link}
          to="/register"
          active={activeItem === "register"}
          onClick={handleItemClick}
        >
          Register
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
};

export default Navbar;
