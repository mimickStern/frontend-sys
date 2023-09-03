import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessagesBoxScreen from "./screens/MessagesBoxScreen";
import SingleMessage from "./screens/SingleMessage";
import SigninScreen from "./screens/SignInScreen";
import SignupScreen from "./screens/SignUpScreen";
import CreateMessageScreen from "./screens/CreateMessageScreen";
import { useContext, useState } from "react";
import { Store } from "./Store";
import { Container, Nav, Navbar, Tab, Tabs } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [activeTab, setActiveTab] = useState("received");

  

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const signoutHandler = () => {
    localStorage.removeItem("userInfo");
    ctxDispatch({ type: "USER_SIGNOUT" });
    window.location.href = "/signin";
  };

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position="top-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/signup">
                <Navbar.Brand> Message System</Navbar.Brand>
              </LinkContainer>
              {!userInfo ? (
                <Nav>
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                </Nav>
              ) : (
                <Nav>
                    <Link
                      className="nav-link"
                      to="/signin"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </Nav>
              )}
            </Container>
          </Navbar>
        </header>
        <main>
          {userInfo && (
            <Tabs
              defaultActiveKey={activeTab}
              onSelect={(tab) => handleTabChange(tab)}
              animation={false}
              id="noanim-tab-example"
              justify
            >
              <Tab eventKey="received" title="Received Messages">
                {activeTab === "received" && (
                  <MessagesBoxScreen messageType="received" />
                )}{" "}
              </Tab>
              <Tab eventKey="sent" title="Sent Messages">
                {activeTab === "sent" && (
                  <MessagesBoxScreen messageType="sent" />
                )}
              </Tab>
              <Tab eventKey="read" title="Read Messages">
                {activeTab === "read" && (
                  <MessagesBoxScreen messageType="read" />
                )}
              </Tab>
              <Tab eventKey="unread" title="Unread Messages">
                {activeTab === "unread" && (
                  <MessagesBoxScreen messageType="unread" />
                )}
              </Tab>
              <Tab eventKey="create" title="Create Message">
                {activeTab === "create" && (
                  <MessagesBoxScreen messageType="create" />
                )}
              </Tab>
            </Tabs>
          )}
          <Container>
        <Routes>
          <Route path="/add-message" element={<CreateMessageScreen />} />
          <Route path="/messages/:id" element={<SingleMessage />} />
          <Route path="/messages" element={<MessagesBoxScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/signin" element={<SigninScreen />} />
          {/* <Route path="/" element={<HomeScreen/>}/> */}

        </Routes>
        </Container>
        </main>
        <footer>
          <div className="text-center">@2023 All rights reserved</div>
        </footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
