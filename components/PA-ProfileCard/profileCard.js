import React, {useEffect, useState} from "react";
import axios from "axios";
import getConfig from "next/config";
import {useSelector} from "react-redux";
import AvatarEditor from "react-avatar-editor";

const {publicRuntimeConfig} = getConfig();

const profileCard = (props) => {
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState({});
    const [isImageSet, setIsImageSet] = useState(false);
    const [imageEditor, setImageEditor] = useState();
    const token = useSelector((state) => state.token);

    console.log("....userData",userData)
    //Called only if the props change.
    useEffect(() => {
        setUserData(props.userData);
    }, [props.userData]);

    const updateValue = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        if (value[0] !== '@') {
            let reFacebook = /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?/
            let reTwitter = /(?:(http|https):\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/
            let reTelegram = /(?:(http|https):\/\/)?(?:www\.)?(telegram|t)\.(com|me)\/(?:(?:\w)*#!\/)?([\w\-]*)/
            if (name === 'facebook' && value.match(reFacebook)) {
                value = value.match(reFacebook)[0]
            } else if (name === 'twitter' && value.match(reTwitter)) {
                value = value.match(reTwitter)[0]
            } else if (name === 'telegram' && value.match(reTelegram)) {
                value = value.match(reTelegram)[0]
            }
        } else if (value[0] === '@') {
            // Set username
            let username = value.substr(1);
            if (name === 'facebook') {
                value = 'https://www.facebook.com/' + username
            } else if (name === 'twitter') {
                value = 'https://twitter.com/' + username
            } else if (name === 'telegram') {
                value = 'https://t.me/' + username
            }
        }
        setUserData({
            ...userData,
            [name]: value,
        });
    };
    // const imageSelect = (e) => {
    //   setUserData({
    //     ...userData,
    //     imageInput: URL.createObjectURL(e.target.files[0]),
    //   });
    //   console.log('image URL', userData.imageInput);
    //   setIsImageSet(!isImageSet);
    // };
    const imageSelect = async (e) => {
        let image = "";
        // let name = e.target.name;
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = await function () {
            image = reader.result;
            setUserData({...userData, imageURI: image});
        };
    };
    const setImageToState = () => {
        let imageDataURI = "";
        if (imageEditor) {
            const canvas = imageEditor.getImage();
            imageDataURI = canvas.toDataURL();
            setUserData({...userData, imageURI: imageDataURI});
        }
    };

    const submitChanges = async () => {
        // console.log("REQUEST", userData);
        axios
            .post(
                publicRuntimeConfig.APP_URL + "/users/updateUserProfile",
                userData,
                {
                    headers: {Authorization: "Bearer " + token},
                }
            )
            .then((res) => {
                setEditMode(false);
                setIsImageSet(false);
            })
            .catch((err) => console.log(err));
    };

    const setEditor = (editor) => {
        setImageEditor(editor);
    };
    return (
        <div className="my-7 max-w-screen-xl mx-auto container">
            <div className={" grid grid-cols-12   " + (editMode ? "px-4 md:px-4 lg:px-4" : "px-4 md:px-8 lg:px-4")}>
                <div className={"col-span-12 lg:col-span-2"}>
                    <div
                        className={"relative w-48 h-48  overflow-hidden m-auto rounded-full border-8 border-outline-color shadow-md z-20 md:z-20  left-0  md:top-customCalc md:shadow-lg justify-items-center " + (editMode ? 'lg:left-0' : '   xl:mt-1 lg:left-0')}>
                        {isImageSet && (
                            <AvatarEditor
                                ref={setEditor}
                                image={userData.imageInput}
                                onImageReady={setImageToState}
                                onImageChange={setImageToState}
                                className="cursor-grab relative w-44 h-44 overflow-hidden m-auto rounded-full shadow-sm z-20"
                                borderRadius={50}
                                scale={1}
                                rotate={0}
                            />
                        )}
                        {editMode ? (
                            <>
                                <input
                                    onChange={imageSelect}
                                    type="file"
                                    id="myfile"
                                    name="myfile"
                                    accept="image/*"
                                    className="hidden"
                                />
                                <label htmlFor="myfile"
                                       className="flex h-full bg-gray-100 bg-opacity-50 cursor-pointer">
                                    <p className="w-full text-center relative top-40">
                                        Choose Image
                                    </p>
                                </label>
                            </>
                        ) : (
                            <img
                                src={
                                    userData.image
                                        ? `${publicRuntimeConfig.APP_URL}/media/user/${userData.image}`
                                        : `${publicRuntimeConfig.APP_URL}/media/user/user-avatar.png`
                                }
                                className="w-48 h-48 overflow-hidden m-auto"
                                alt="user"
                            />
                        )}
                    </div>
                </div>
                <div  className={" -my-6 lg:my-2 col-span-12 lg:col-span-10 text-center py-4 shadow-md border  rounded-50px  w-full" + (editMode ? 'lg:-ml-12 xl:-ml-12 ml-0' : '-ml-12  lg:-ml-12 xl:-ml-12 ')}>
                    <div className="flex flex-row  pt-12  lg:py-2 relative">
                        {props.showEditButton && (
                            <button
                                onClick={() => {
                                    setEditMode(!editMode);
                                    setIsImageSet(false);
                                }}
                                type="button"
                                className="shadow-sm hover:bg-branding-color border absolute top-4p right-4 lg:right-4p border border-branding-text-color rounded-full w-8 h-8 p-0 hover:shadow-xl "
                            >
                                <i
                                    className="text-branding-text-color fas fa-pencil-alt"
                                />
                            </button>
                        )}
                        {editMode && (
                            <button
                                onClick={submitChanges}
                                type="button"
                                className="shadow hover:bg-branding-color border border-green-600 absolute top-4p right-12 lg:right-9p border border-branding-text-color rounded-full w-8 h-8 p-0 hover:shadow-xl "

                            >
                                <i className="text-green-600 hover:text-white fas fa-save"/>
                            </button>
                        )}
                    </div>
                    <div className={"grid grid-cols-12 pt-2 " + (editMode ? "px-2 lg:px-0  gap-x-8 mt-4 " : "px-4")}>
                       <div className={editMode ?  "lg:col-span-1  " : "lg:col-span-1 "}>

                        </div>
                        <div className={editMode ? 'col-span-12 lg:col-span-5 ' : 'col-span-12 lg:col-span-4'}>
                            {editMode ? (
                                <div className="">
                                    <p className="text-left text-outline-color  text-md  overflow-hidden  mb-2">User Name</p>
                                    <input
                                    onChange={updateValue}
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    placeholder={"User name"}
                                    className="w-full p-1.5   rounded-xl text-leftrounded-sm border-1 border-outline-color focus:outline-none"

                                    />

                                </div>
                                    ) : (
                                <h3 className="text-outline-color pt-6 lg:pt-0 text-3xl overflow-hidden ">{userData.name}</h3>
                            )}

                            {/*<p className="text-placeholder pt-2 pb-1 overflow-hidden ">{userData.username}</p>*/}
                            {!editMode &&  <p className="text-percentage text-sm overflow-hidden ">
                                member since:{" "}
                                {userData.memberSince
                                    ? userData.memberSince.split("T")[0]
                                    : ""}
                            </p> }
                            {editMode ? (
                                <div className="py-4">
                                    <p className=" text-left text-outline-color  text-md  overflow-hidden  mb-2">You website url</p>

                                    <input
                                    type="text"
                                    onChange={updateValue}
                                    value={userData.websiteURL}
                                    name="websiteURL"
                                    className="w-full p-1.5  rounded-xl text-leftrounded-sm border-1 border-outline-color focus:outline-none"

                                    placeholder={"Website url"}
                                />
                                </div>
                            ) : (
                                <p className="overflow-hidden mx-2">
                                    <a
                                        className="  text-branding-text-color mb-1 text-5 underline hover:text-branding-text-color hover:underline"
                                        href={userData.websiteURL}
                                    >
                                        {userData.websiteURL}
                                    </a>
                                </p>
                            )}

                            { editMode &&
                                <div className="mt-2 py-2">
                                    <p className=" text-left text-outline-color  text-md  overflow-hidden  mb-2">Facebook Profile link</p>

                                    <input
                                type="text"
                                name="facebook"
                                value={userData.socialLinks && userData.socialLinks.facebook}
                                placeholder="Facebook"
                                className="w-full p-1.5  rounded-xl text-leftrounded-sm border-1 border-outline-color focus:outline-none"
                                onChange={updateValue}
                            />
                                </div>

                            }

                            {editMode && (
                                <div className="py-2">
                                    <p className=" text-left text-outline-color  text-md  overflow-hidden  mb-2">Telegram Profile link</p>

                                    <input
                                    type="text"
                                    name="telegram"
                                    placeholder="Telegram"
                                    value={userData.socialLinks && userData.socialLinks.telegram }
                                    className="w-full p-1.5  rounded-xl text-leftrounded-sm border-1 border-outline-color focus:outline-none"
                                    onChange={updateValue}
                                />
                                </div>
                            )

                            }
                                </div>
                        <div
                            className={"text-center lg:mr-8 mr-0" + (editMode ? " col-span-12  lg:col-span-6  px-0" : " col-span-12  lg:col-span-7 px-4")}>
                            {editMode ? (
                                <div className="py-0">
                                    <p className=" text-left text-outline-color  text-md  overflow-hidden  mb-2">Write about yourself</p>

                                    <textarea
                                    onChange={updateValue}
                                    name="bio"
                                    placeholder="Write your bio"
                                    className="w-full p-1.5   lg:mr-8   text-branding-color font-normal h-32 border-1 border-outline-color rounded-xl focus:outline-none "
                                />
                                </div>
                            ) : (

                                <p className="px-2 text-branding-color font-normal text-center pt-2">
                                    {userData.bio}
                                </p>
                            )}

                            <div className={"flex justify-center  py-4 " + (editMode ? 'flex-col' : 'flex-row')}>
                                {!editMode && (

                                    userData.socialLinks && userData.socialLinks.facebook &&  <a
                                        href={
                                            userData.socialLinks
                                                ? userData.socialLinks.facebook
                                                : "#"
                                        }
                                        className=" items-center text-center hover:text-white hover:bg-branding-text-color block w-10 h-10 border-1 border-outline-color  rounded-full pt-2 text-center mr-3 md:mr-2 group"
                                    >
                                        <i className="group-hover:text-white text-branding-color fab fa-facebook-f"/>
                                    </a>
                                )}
                                {!editMode &&
                                   (
                                    userData.socialLinks && userData.socialLinks.telegram &&   <a
                                        href={
                                            userData.socialLinks
                                                ? userData.socialLinks.telegram
                                                : "#"
                                        }
                                        className="hover:text-white hover:bg-branding-text-color block w-10 h-10 border-1 border-outline-color  rounded-full pt-2 text-center mr-3 md:mr-2 group"

                                    >
                                        <i
                                            className="group-hover:text-white text-branding-color  fab fa-telegram-plane"
                                        />
                                    </a>
                                )}
                                {editMode ? (
                                    <div className="py-2">
                                        <p className="text-left text-outline-color  text-md  overflow-hidden  mb-2">Twitter Profile Link</p>

                                        <input
                                        type="text"
                                        name="twitter"
                                        placeholder="Twitter"
                                        value={userData.socialLinks && userData.socialLinks.twitter}
                                        className="w-full p-1.5   rounded-xl text-leftrounded-sm border-1 border-outline-color focus:outline-none"
                                        onChange={updateValue}
                                    />
                                    </div>
                                ) : (
                                    userData.socialLinks && userData.socialLinks.twitter &&  <a
                                        href={
                                            userData.socialLinks
                                                ? userData.socialLinks.twitter
                                                : "#"
                                        }
                                        className="hover:text-white hover:bg-branding-text-color block w-10 h-10 border-1 border-outline-color  rounded-full pt-2 text-center mr-3 md:mr-2 group"

                                    >
                                        <i
                                            className="group-hover:text-white text-branding-color fab fa-twitter"
                                        />
                                    </a>
                                )}
                                {editMode ? (
                                    <div className="py-2">
                                        <p className="text-left text-outline-color  text-md  overflow-hidden  mb-2">Read Cash Profile Link</p>


                                        <input
                                        type="text"
                                        name="email"
                                        placeholder="read.cash"
                                        value={userData.socialLinks && userData.socialLinks.email}
                                        className="w-full p-1.5   rounded-xl text-leftrounded-sm border-1 border-outline-color focus:outline-none"

                                        onChange={updateValue}
                                    />
                                    </div>
                                ) : (
                                    userData.socialLinks && userData.socialLinks.email &&  <a
                                        href={
                                            userData.socialLinks && userData.socialLinks.email
                                                ? `mailto:${userData.socialLinks.email}`
                                                : "#"
                                        }
                                        className="hover:text-white hover:bg-branding-text-color block w-10 h-10 border-1 border-outline-color  rounded-full pt-0 text-center mr-3 md:mr-2 group"

                                    >
                                        <p
                                            className="group-hover:text-white text-branding-color text-black text-2xl">r</p>

                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default profileCard;
