import React, { useRef, useState } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewSession.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default function NewNote(props) {
  const img = useRef(null);
  const k = useRef(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return name.length > 0;
  }

  function handleImageChange(event) {
    img.current = event.target.files[0];
  }

  function handleKeyChange(event) {
    k.current = event.target.files[0];
  }

  async function handleSubmit(event) {
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

      const image = img.current
      ? await s3Upload(img.current)
      : null;

      const key = k.current
      ? await s3Upload(k.current)
      : null;
      
      await createSession({ name, description, image ,key});
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }
  
  function createSession(session) {
    return API.post("sessions", "/sessions", {
      body: session
    });
  }

  return (
    <div className="NewSession">
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
          Create
        </LoaderButton>
      </form>
    </div>
  );
}