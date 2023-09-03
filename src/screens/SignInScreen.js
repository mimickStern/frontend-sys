import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getError } from "../utilis.js";
import { Store } from "../Store";
import axios from "axios";
import { toast } from "react-toastify";

const SigninScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/signin/", {
        username,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err) {
      toast.error(getError(err));
    }
  };

  
  useEffect(() => {
    if (userInfo) {
      navigate('/messages');
    }
  }, [navigate, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler} className="d-flex flex-column align-items-center">
        <Form.Group className="mb-3 w-50" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-3 w-50" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?{" "}
          <Link to={`/signup`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SigninScreen;
