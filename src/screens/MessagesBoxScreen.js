import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ListMessages from "../components/ListMessages";
import { Store } from "../Store";

const MessagesBoxScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fecthData = async () => {
      const result = await axios.get(
        "/api/received-messages/",
        // after adding authentication and signing in
        {
          headers: { Authorization: `Bearer ${userInfo.access}` },
        }
      );
      console.log(result.data);
      setMessages(result.data);
    };

    fecthData();
  }, []);

  return (
    <div>
      {messages.map((message, id) => (
        <ListMessages key={id} message={message} />
      ))}
    </div>
  );
};

export default MessagesBoxScreen;
