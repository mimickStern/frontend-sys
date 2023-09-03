import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utilis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";

const CreateMessageScreen = () => {
  const contentRef = useRef();
  const subjectRef = useRef();
  const receiverRef = useRef();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState("");
  const { state } = useContext(Store);
  const { userInfo } = state;


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(subject, content, receiver);
    try {
      const { data } = await axios.post(
        "/api/add-message/",
        { subject, content, receiver },
        { headers: { Authorization: `Bearer ${userInfo.access}` } }
      );
      toast.success("message sent successfully");
      console.log("New message created:", data);
      contentRef.current.value = "";
      subjectRef.current.value = "";
      receiverRef.current.value = "";

      // Handle success and update message list if needed
    } catch (err) {
      toast.error(getError(err));
      console.error("Error creating message:", getError(err));
      // Handle error if needed
    }
  };

  return (
    <Container className="small-container mt-4">
      <Helmet>
        <title>Create Message</title>
      </Helmet>
      <Form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center"
      >
        <Form.Group className="mb-3 w-50" controlId="receiver">
          <Form.Control
            type="text"
            placeholder="receiver"
            required
            ref={receiverRef}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3 w-50" controlId="Subject">
          <Form.Control
            type="text"
            placeholder="Subject"
            required
            ref={subjectRef}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3 w-50" controlId="Content">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Content"
            required
            ref={contentRef}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Send</Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateMessageScreen;
