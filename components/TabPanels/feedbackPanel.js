import React, { useEffect, useState } from 'react';
import CommentCard from '../CommentCard/commentCard';
import { useSelector } from 'react-redux';
import getConfig from 'next/config';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig();

const feedbackPanel = props => {
    const [message, setMessage] = useState('');
    const [comments, setComments] = useState([]);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const token = useSelector(state => state.token);
    const username = useSelector(state => state.username);
    const name = useSelector(state => state.name);
    const avatar = useSelector(state => state.image);
    const userId = useSelector(state => state.id);

    // Get comments
    useEffect(() => {
        getComments();
    }, [props.projectId]);

    const getComments = () => {
        axios
            .post(publicRuntimeConfig.APP_URL + '/comments/getProjectComments', {
                projectId: props.projectId
            })
            .then(res => {
                const savedComments = res.data.comments;
                setComments([...savedComments]);
                props.onChangeCommentCount(savedComments.length);
            })
            .catch(err => console.log(err));
    };

    const saveComment = event => {
        event.preventDefault();
        if (message.length > 0) {
            // console.log('Save comment:', message);
            axios
                .post(
                    publicRuntimeConfig.APP_URL + '/comments/saveComment',
                    {
                        projectId: props.projectId,
                        userId: userId,
                        avatar: avatar,
                        name: name,
                        username: username,
                        text: message
                    },
                    {
                        headers: { Authorization: 'Bearer ' + token }
                    }
                )
                .then(res => {
                    console.log(res);
                })
                .catch(err => console.log(err));
            setMessage('');
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
                    text: message
                }
            ]);
        } else if (message.length > 3000) {
            alert(
                'Sorry, your message too long. Try shorter message or split it in 2 messages. Thanks!'
            );
        } else if (message.length === 0) {
            alert('Sorry, your message empty.');
        }
    };

    const commentInput = () => {
        if (isLoggedIn) {
            return (
                <div>
                    <p className="px-2 text-md text-funded text-bold pt-4 pb-2 ">
                        Write a comment{' '}
                    </p>
                    <form
                        onSubmit={event => saveComment(event)}
                        className="px-4  md:px-4 pb-14 pt-6 md:pb-14  bg-gray-100  border-1  rounded-lg h-auto">
                        <div className=" ">
                            <textarea
                                value={message}
                                onChange={event => setMessage(event.target.value)}
                                className="h-16 px-4 py-2  w-full rounded-3xl  text-outline-color placeholder-outline-color
                                     outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-200
                                   focus:border-purple-200  focus:outline-none
                                    border-1 focus:border-0  bg-white mb-2 "
                            />
                        </div>
                        <button
                            type="submit"
                            className="md:w-auto w-half float-right   inline-flex justify-center text-base  text-white border-1 border-branding-text-color text-xl rounded-full py-1 px-16 bg-branding-text-color shadow-md hover:shadow-lg uppercase">
                            Send
                        </button>
                    </form>
                </div>
            );
        } else {
            return <p>Please login to leave a comment</p>;
        }
    };
    return (
        <div className="grid grid-cols mb-4 pt-4">
            <div className="col-span-1 ">
                <div className="">{commentInput()}</div>
            </div>
            <div className="col-span-1 ">
                {comments[0] ? (
                    comments.map(comment => (
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
                    <p className="h-16 rounded-xl py-4 text-lg font-lg px-0 ">No comments</p>
                )}
            </div>
        </div>
    );
};

export default feedbackPanel;
