import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Sessions.css";
import { s3Upload } from "../libs/awsLib";

export default function Sessions(props) {
    const img = useRef(null);
    const k = useRef(null);
    const [session, setSession] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadSession() {
      return API.get("sessions", `/sessions/${props.match.params.id}`);
    }

    async function onLoad() {
      try {
        const session = await loadSession();
        const { name, description, img, k } = session;

        if (img) {
          session.imageURL = await Storage.vault.get(img);
        }
        if (k) {
            session.keyURL = await Storage.vault.get(k);
          }
        setName(name);
        setSession(session);
      } catch (e) {
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id]);

  function validateForm() {
    return name.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleImageChange(event) {
    img.current = event.target.files[0];
  }
  function handleKeyChange(event) {
    k.current = event.target.files[0];
  } 
  function saveSession(session) {
    return API.put("sessions", `/sessions/${props.match.params.id}`, {
      body: session
    });
  }
  
  async function handleSubmit(event) {
    let image;
    let key;
  
    event.preventDefault();
  
    if (img.current && img.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      if (img.current) {
        image = await s3Upload(img.current);
      }
      if (k.current) {
        key = await s3Upload(k.current);
      }
      await saveSession({
        name,
        description,
        image: image || session.image,
        key: key || session.key
      });
      props.history.push("/");
    } catch (e) {
        console.log(e)
      alert(e);
      setIsLoading(false);
    }
  }
  
  function deleteSession() {
    return API.del("sessions", `/sessions/${props.match.params.id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this session?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteSession();
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="Sessions">
      {session && (
        <form onSubmit={handleSubmit}>
        <div id ="name"><h3>Name:  </h3></div>
        <div id = "nameform">
          <FormGroup controlId="name">
            <FormControl
              value={name}
              componentClass="textarea"
              onChange={e => setName(e.target.value)}
            />
          </FormGroup>
        </div>
        <br></br>
        <div id ="description"><h3>Description:  </h3></div>
        <div id ="desform">
          <FormGroup controlId="description">
            <FormControl
              value={description}
              componentClass="textarea"
              onChange={e => setDescription(e.target.value)}
            />
          </FormGroup>
        </div>
        <FormGroup controlId="images">
          <ControlLabel>Image</ControlLabel>
          <FormControl onChange={handleImageChange} type="file" />
        </FormGroup>
        <FormGroup controlId="keys">
          <ControlLabel>Key</ControlLabel>
          <FormControl onChange={handleKeyChange} type="file" />
        </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}