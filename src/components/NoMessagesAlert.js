import React from "react";
import Alert from "react-bootstrap/Alert";

const NoMessagesAlert = () => {
  return (
    <Alert variant="info">
      You have no messages.
    </Alert>
  );
};

export default NoMessagesAlert;
