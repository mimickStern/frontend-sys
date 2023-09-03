import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { getError } from "../utilis";
import CreateMessageScreen from "./CreateMessageScreen";
import Table from "react-bootstrap/Table";
import NoMessagesAlert from "../components/NoMessagesAlert";
import ListMessages from "../components/ListMessages";


const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        const messages = Array.isArray(action.payload) ? action.payload : [];
        return { ...state, messages, loading: false };
      case "FETCH_FAIL":
        return { ...state, error: action.payload, loading: false };
      case "DELETE_REQUEST":
        return { ...state, loadingDelete: true, successDelete: false };
      case "DELETE_SUCCESS":
        const updatedMessages = state.messages.filter(
          (message) => message.id === action.payload
        );
        if (updatedMessages.length === 0) {
          return { ...state, loadingDelete: false, successDelete: true };
        } else {
          return {
            ...state,
            messages: updatedMessages,
            loadingDelete: false,
            successDelete: true,
          };
        }
      case "DELETE_FAIL":
        return { ...state, loadingDelete: false };
  
      default:
        return state;
    }
  };

const MessagesBoxScreen = ({messageType}) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const accessToken = userInfo ? userInfo.access : null;
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [unread, setUnread] = useState(true);
  const [{ loading, error, messages, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      messages: [],
      loading: true,
      error: "",
    })
  ;


  const markReadHandler = async (message) => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
    
          const endpoint = message.unread ? "read" : "unread";
          await axios.get(`/api/${endpoint}-a-message/${message.id}/`, {
            headers: { Authorization: `Bearer ${userInfo.access}` },
          });
    
          const updatedMessages = messages.filter((msg) => 
          msg.id !== message.id);
    
          dispatch({ type: "FETCH_SUCCESS", payload: updatedMessages });
    
          const actionText = message.unread ? "marked as read" : "marked as unread";
          toast.success(`Message ${actionText} successfully`);
        } catch (err) {
          toast.error(getError(err));
          dispatch({ type: "FETCH_FAIL" });
        }
      };
    
    
    
      const deleteHandler = async (message) => {
        console.log(message);
        if (window.confirm("Are you sure you want to delete this message?")) {
          try {
            dispatch({ type: "DELETE_REQUEST" });
            await axios.delete(`/api/delete-message/${message.id}/`, {
              headers: { Authorization: `Bearer ${userInfo.access}` },
            });
            toast.success("message deleted successfully");
            dispatch({ type: "DELETE_SUCCESS" });
          } catch (err) {
            toast.error(getError(err));
            dispatch({
              type: "DELETE_FAIL",
            });
          }
        }
      };

  // useEffect(() => {
  //   const fecthData = async () => {
  //     const result = await axios.get(
  //       "/api/received-messages/",
  //       // after adding authentication and signing in
  //       {
  //         headers: { Authorization: `Bearer ${userInfo.access}` },
  //       }
  //     );
  //     console.log(result.data);
  //     setMessages(result.data);
  //   };

  //   fecthData();
  // }, []);

  useEffect(() => {
        const fetchData = async () => {
          dispatch({ type: "FETCH_REQUEST" });
          try {
            let url = "";
            if (messageType === "create") {
              setLoadingCreate(true);
            } else if (messageType === "received") {
              url = "/api/received-messages/";
            } else if (messageType === "sent") {
              url = "/api/sent-messages/";
            } else if (messageType === "read") {
              url = "/api/read-messages/";
            } else if (messageType === "unread") {
              url = "/api/unread-messages/";
            }
            const result = await axios.get(url, {
              headers: { Authorization: `Bearer ${userInfo.access}` },
            });
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          } catch (err) {
            dispatch({ type: "FETCH_FAIL", payload: err.message });
          }
        };
        if (successDelete) {
          dispatch({ type: "DELETE_RESET" });
        } else {
          fetchData();
        }
      }, [userInfo, successDelete, messageType]);

  // return (
  //   <div>
  //     {messages.map((message, id) => (
  //       <ListMessages key={id} message={message} />
  //     ))}
  //   </div>
  // );

  return (
        <div>
          <Helmet>
            <title>Messages</title>
          </Helmet>
    
          {loadingCreate ? (
            <CreateMessageScreen />
          ) : loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : messages?.length === 0 ? (
            <NoMessagesAlert />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>SUBJECT</th>
                  <th>CONTENT</th>
                  <th>DATE</th>
                  <th>SENDER</th>
                  <th>RECEIVER</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {messages?.map((message) => (
                  <tr key={message.id}>
                    <td>{message.subject}</td>
                    <td>{message.content}</td>
                    <td>{message.creation_date.substring(0, 10)}</td>
                    <td>{message.sender}</td>
                    <td>{message.receiver}</td>
                    <td>
                      {(messageType !== "sent" && messageType !=="received") && (
                        <Button
                          type="button"
                          variant="dark"
                          onClick={() => markReadHandler(message)}
                        >
                          {message.unread ? "Mark as Read" : "Mark as Unread"}
                        </Button>
                      )}
                      &nbsp;
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(message)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      );
};

export default MessagesBoxScreen;
