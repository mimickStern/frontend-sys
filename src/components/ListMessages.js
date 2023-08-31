import React from "react";

const ListMessages = ({ message }) => {
  return (
    <div>
      <h2>{message.id}</h2>
      <h2>{message.subject}</h2>
      <h2>{message.content}</h2>
      <h2>{message.creation_date.substring(0, 10)}</h2>
      <h2>{message.sender}</h2>
      <h2>{message.receiver}</h2>
    </div>
  );
};

export default ListMessages;
