import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

export default function Home(props) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }
  
      try {
        const sessions = await loadSessions();
        setSessions(sessions);
      } catch (e) {
        alert(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [props.isAuthenticated]);
  
  function loadSessions() {
    return API.get("sessions", "/sessions");
  }

  function renderSessionsList(sessions) {
    return [{}].concat(sessions).map((session, i) =>
    i !== 0 ? (
      <LinkContainer key={session.sessionId} to={`/sessions/${session.sessionId}`}>
        <ListGroupItem header={session.name.trim().split("\n")[0]}>
          {"Created: " + new Date(session.createdAt).toLocaleString()}
        </ListGroupItem>
      </LinkContainer>
    ) : (
      <LinkContainer key="new" to="/sessions/new">
        <ListGroupItem>
          <h4>
            <b>{"\uFF0B"}</b> Create a new session
          </h4>
        </ListGroupItem>
      </LinkContainer>
    )
  );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Squire</h1>
        <p>Decentralized Cloud Platform</p>
      </div>
    );
  }

  function renderSessions() {
    return (
      <div className="sessions">
        <PageHeader>Your Sessions</PageHeader>
        <ListGroup>
          {!isLoading && renderSessionsList(sessions)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderSessions() : renderLander()}
    </div>
  );
}