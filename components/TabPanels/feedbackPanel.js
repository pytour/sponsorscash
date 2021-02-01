import React, { useState, useEffect } from "react";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import styles from "./feedbackPanel.module.css";
import CommentCard from "../CommentCard/commentCard";
import { useDispatch, useSelector } from "react-redux";
import getConfig from "next/config";
import axios from "axios";
const { publicRuntimeConfig } = getConfig();

const feedbackPanel = (props) => {
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([
    // {
    //   _id: "someidasdqwqc",
    //   projectId: "asdqwqc",
    //   userId: "asdqwqc",
    //   username: "john",
    //   name: "John Doe",
    //   date: "2 days ago",
    //   avatar: "user-avatar.png",
    //   text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad aliquam
    //   animi assumenda
    //   atque, consequatur consequuntur deleniti, earum illum incidunt, inventore libero
    //   omnis optio
    //   quia rerum similique sit temporibus tenetur!`,
    // },
  ]);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const token = useSelector((state) => state.token);
  const username = useSelector((state) => state.username);
  const name = useSelector((state) => state.name);
  const avatar = useSelector((state) => state.image);
  const userId = useSelector((state) => state.id);

  // Get comments
  useEffect(() => {
    getComments();
  }, [props.projectId]);

  const getComments = () => {
    axios
      .post(publicRuntimeConfig.APP_URL + "/comments/getProjectComments", {
        projectId: props.projectId,
      })
      .then((res) => {
        const savedComments = res.data.comments;
        setComments([...savedComments]);
        props.onChangeCommentCount(savedComments.length);
      })
      .catch((err) => console.log(err));
  };

  const saveComment = (event) => {
    event.preventDefault();
    if (message.length > 0) {
      console.log("Save comment:", message);
      axios
        .post(
          publicRuntimeConfig.APP_URL + "/comments/saveComment",
          {
            projectId: props.projectId,
            userId: userId,
            avatar: avatar,
            name: name,
            username: username,
            text: message,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      setMessage("");
      // Update component
      //getComments();
      setComments([
        ...comments,
        {
          projectId: props.projectId,
          userId: userId,
          avatar: avatar,
          name: name,
          username: username,
          text: message,
        },
      ]);
    } else if (message.length > 3000) {
      alert(
        "Sorry, your message too long. Try shorter message or split it in 2 messages. Thanks!"
      );
    } else if (message.length === 0) {
      alert("Sorry, your message empty.");
    }
  };

  const commentInput = () => {
    if (isLoggedIn) {
      return (
        <form onSubmit={(event) => saveComment(event)} className="clearfix">
          <div className="form-group">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={`${styles.textArea} form-control`}
            ></textarea>
          </div>
          <button type="submit" className={`${styles.btnSend} btn float-right`}>
            Send
          </button>
        </form>
      );
    } else {
      return <p>Please login to leave a comment</p>;
    }
  };
  return (
    <MDBContainer className="mb-4">
      <MDBRow>
        <MDBCol size="12" className={styles.feedback}>
          <div className="col-12 p-4">{commentInput()}</div>
        </MDBCol>
        <MDBCol>
          {comments[0] ? (
            comments.map((comment) => (
              <CommentCard
                key={comment._id}
                name={comment.name}
                username={comment.username}
                image={comment.avatar}
                date={comment.date}
                text={comment.text}
              />
            ))
          ) : (
            <p className={`${styles.textArea}`}>No comments</p>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default feedbackPanel;
