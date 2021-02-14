import React, {useEffect, useState} from "react";
import styles from "./profileCard.module.css";
import axios from "axios";
import getConfig from "next/config";
import {useSelector} from "react-redux";
import AvatarEditor from "react-avatar-editor";

const { publicRuntimeConfig } = getConfig();

const profileCard = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({});
  const [isImageSet, setIsImageSet] = useState(false);
  const [imageEditor, setImageEditor] = useState();
  const token = useSelector((state) => state.token);

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
      setUserData({ ...userData, imageURI: image });
    };
  };
  const setImageToState = () => {
    let imageDataURI = "";
    if (imageEditor) {
      const canvas = imageEditor.getImage();
      imageDataURI = canvas.toDataURL();
      setUserData({ ...userData, imageURI: imageDataURI });
    }
  };

  const submitChanges = async () => {
    // console.log("REQUEST", userData);
    axios
      .post(
        publicRuntimeConfig.APP_URL + "/users/updateUserProfile",
        userData,
        {
          headers: { Authorization: "Bearer " + token },
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
      <>
          <div className="my-7 max-w-screen-xl mx-auto">
                          <div className="container grid grid-cols-12 px-1 md:px-4 lg:px-4 ">
                              <div className={"col-span-12 lg:col-span-2"}>
                                  <div className={"relative top-8  xl:w-48 xl:h-48 h-40 w-40 overflow-hidden m-auto rounded-full border-8 border-outline-color shadow-md z-20 md:z-20  left-0  md:top-customCalc md:shadow-lg  "+(editMode ? 'lg:left-0':'lg:left-8') }>
                                      {isImageSet && (
                                          <AvatarEditor
                                              ref={setEditor}
                                              image={userData.imageInput}
                                              onImageReady={setImageToState}
                                              onImageChange={setImageToState}
                                              className={styles.avatarEditor}
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
                                                  className= "hidden"
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
                              <div className={" lg:mx-0 mx-0 -my-6 lg:my-0 col-span-12 lg:col-span-10 text-center py-2 shadow-md border relative rounded-50px  w-full"+(editMode ? "xl:mx-0": "xl:-mx-4")}>
                                 <div className="flex flex-row  pt-12  lg:py-2">
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
                                          <i className="text-green-600 hover:text-white fas fa-save"></i>
                                      </button>
                                  )}
                                 </div>
                                  <div className="grid grid-cols-12 pt-2">
                                      <div className="col-span-12 lg:col-span-4  ">
                                          {editMode ? (
                                              <input
                                                  onChange={updateValue}
                                                  type="text"
                                                  name="name"
                                                  placeholder={userData.name}
                                                  className="mt-12 text-placeholder mb-0 placeholder:text-placeholder placeholder:text-opacity-100 text-center rounded-xs border-1 border-outline-color focus:outline-none  "
                                              />
                                          ) : (
                                              <h3 className="text-outline-color pt-6 lg:pt-0 text-3xl ">{userData.name}</h3>
                                          )}
                                          <p className="text-placeholder pt-2 pb-1">{userData.username}</p>
                                          <p className="text-percentage text-sm ">
                                              member since:{" "}
                                              {userData.memberSince
                                                  ? userData.memberSince.split("T")[0]
                                                  : ""}
                                          </p>
                                          {editMode ? (
                                              <input
                                                  type="text"
                                                  onChange={updateValue}
                                                  name="websiteURL"
                                                  className="m-1.5 text-center rounded-sm border-1 border-outline-color focus:outline-none"
                                                  placeholder={userData.websiteURL}
                                              />
                                          ) : (
                                              <p className="">
                                                  <a
                                                      className= "text-branding-text-color mb-1 text-5 underline hover:text-branding-text-color hover:underline"
                                                      href={userData.websiteURL}
                                                  >
                                                      {userData.websiteURL}
                                                  </a>
                                              </p>
                                          )}
                                      </div>
                                      <div className="col-span-12  lg:col-span-8 text-center mx-4 lg:mx-0 lg:mr-8 mr-0">
                                          {editMode ? (
                                              <textarea
                                                  onChange={updateValue}
                                                  name="bio"
                                                  placeholder="Write your bio"
                                                  className="px-4 mr-8  mt-8 py-4 text-branding-color font-normal w-full h-48 border-1 border-outline-color rounded-10p mx-auto outline-none "
                                              ></textarea>
                                          ) : (
                                              <p className="text-branding-color font-normal text-center pt-2">
                                                  {userData.bio}
                                              </p>
                                          )}
                                          <div  className={"flex lg:justify-center  py-4 "+(editMode ? 'flex-col': 'flex-row')}>
                                              {editMode ? (
                                                  <input
                                                      type="text"
                                                      name="facebook"
                                                      placeholder="Facebook"
                                                      className="m-1.5 text-center rounded-sm border-1 border-branding-color focus:outline-none placeholder:text-placeholder placeholder:text-center"
                                                      onChange={updateValue}
                                                  />
                                              ) : (
                                                  <a
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
                                              {editMode ? (
                                                  <input
                                                      type="text"
                                                      name="telegram"
                                                      placeholder="Telegram"
                                                      className={styles.hpSocialLinksTextInput}
                                                      onChange={updateValue}
                                                  />
                                              ) : (
                                                  <a
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
                                                  <input
                                                      type="text"
                                                      name="twitter"
                                                      placeholder="Twitter"
                                                      className={styles.hpSocialLinksTextInput}
                                                      onChange={updateValue}
                                                  />
                                              ) : (
                                                  <a
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
                                                  <input
                                                      type="text"
                                                      name="email"
                                                      placeholder="Email"
                                                      className={styles.hpSocialLinksTextInput}
                                                      onChange={updateValue}
                                                  />
                                              ) : (
                                                  <a
                                                      href={
                                                          userData.socialLinks && userData.socialLinks.email
                                                              ? `mailto:${userData.socialLinks.email}`
                                                              : "#"
                                                      }
                                                      className="hover:text-white hover:bg-branding-text-color block w-10 h-10 border-1 border-outline-color  rounded-full pt-2 text-center mr-3 md:mr-2 group"

                                                  >
                                                      <i
                                                          className="group-hover:text-white text-branding-color  far fa-envelope"
                                                      />
                                                  </a>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
          </div>

    {/*<div className={`${styles.hpProfile} container mx-auto`}>*/}
      {/*<div className="profile-card row">*/}
        {/*<div className="col-12">*/}
          {/*<div className="container">*/}
            {/*<div className="row">*/}
              {/*<div className="col-12 col-lg-2">*/}
                {/*<div className={styles.hpAvatar}>*/}
                  {/*{isImageSet && (*/}
                    {/*<AvatarEditor*/}
                      {/*ref={setEditor}*/}
                      {/*image={userData.imageInput}*/}
                      {/*onImageReady={setImageToState}*/}
                      {/*onImageChange={setImageToState}*/}
                      {/*className={styles.avatarEditor}*/}
                      {/*borderRadius={50}*/}
                      {/*scale={1}*/}
                      {/*rotate={0}*/}
                    {/*/>*/}
                  {/*)}*/}
                  {/*{editMode ? (*/}
                    {/*<>*/}
                      {/*<input*/}
                        {/*onChange={imageSelect}*/}
                        {/*type="file"*/}
                        {/*id="myfile"*/}
                        {/*name="myfile"*/}
                        {/*accept="image/*"*/}
                        {/*style={{ display: "none" }}*/}
                      {/*/>*/}
                      {/*<label for="myfile" className={styles.hpAvatarPicker}>*/}
                        {/*<p className={styles.hpAvatarPickerLabel}>*/}
                          {/*Choose Image*/}
                        {/*</p>*/}
                      {/*</label>*/}
                    {/*</>*/}
                  {/*) : (*/}
                    {/*<img*/}
                      {/*src={*/}
                        {/*userData.image*/}
                          {/*? `${publicRuntimeConfig.APP_URL}/media/user/${userData.image}`*/}
                          {/*: `${publicRuntimeConfig.APP_URL}/media/user/user-avatar.png`*/}
                      {/*}*/}
                      {/*className={`${styles.avatar}`}*/}
                      {/*alt="user"*/}
                    {/*/>*/}
                  {/*)}*/}
                {/*</div>*/}
              {/*</div>*/}
              {/*<div className={`${styles.hpCardBody} col-12 col-lg-9`}>*/}
                {/*{props.showEditButton && (*/}
                  {/*<button*/}
                    {/*onClick={() => {*/}
                      {/*setEditMode(!editMode);*/}
                      {/*setIsImageSet(false);*/}
                    {/*}}*/}
                    {/*type="button"*/}
                    {/*className={`${styles.hpBtnEdit} btn`}*/}
                  {/*>*/}
                    {/*<i*/}
                      {/*style={{ color: "#FFCA79" }}*/}
                      {/*className="fas fa-pencil-alt"*/}
                    {/*></i>*/}
                  {/*</button>*/}
                {/*)}*/}
                {/*{editMode && (*/}
                  {/*<button*/}
                    {/*onClick={submitChanges}*/}
                    {/*type="button"*/}
                    {/*className={`${styles.hpBtnSave} btn`}*/}
                  {/*>*/}
                    {/*<i style={{ color: "green" }} className="fas fa-save"></i>*/}
                  {/*</button>*/}
                {/*)}*/}
                {/*<div className="row">*/}
                  {/*<div className="col-lg-4">*/}
                    {/*{editMode ? (*/}
                      {/*<input*/}
                        {/*onChange={updateValue}*/}
                        {/*type="text"*/}
                        {/*name="name"*/}
                        {/*placeholder={userData.name}*/}
                        {/*className={`${styles.hpCBusername} ${styles.hpCardUserNameEdit} ${styles.hpSocialLinksTextInput}`}*/}
                      {/*/>*/}
                    {/*) : (*/}
                      {/*<h3 className={styles.hpCBname}>{userData.name}</h3>*/}
                    {/*)}*/}
                    {/*<p className={styles.hpCBusername}>{userData.username}</p>*/}
                    {/*<p className={styles.hpCBjoin}>*/}
                      {/*member since:{" "}*/}
                      {/*{userData.memberSince*/}
                        {/*? userData.memberSince.split("T")[0]*/}
                        {/*: ""}*/}
                    {/*</p>*/}
                    {/*{editMode ? (*/}
                      {/*<input*/}
                        {/*type="text"*/}
                        {/*onChange={updateValue}*/}
                        {/*name="websiteURL"*/}
                        {/*className={styles.hpSocialLinksTextInput}*/}
                        {/*style={{ textAlign: "center" }}*/}
                        {/*placeholder={userData.websiteURL}*/}
                      {/*/>*/}
                    {/*) : (*/}
                      {/*<p className="blog-link">*/}
                        {/*<a*/}
                          {/*className={styles.hpCBbloglink}*/}
                          {/*href={userData.websiteURL}*/}
                        {/*>*/}
                          {/*{userData.websiteURL}*/}
                        {/*</a>*/}
                      {/*</p>*/}
                    {/*)}*/}
                  {/*</div>*/}
                  {/*<div className="col-lg-8">*/}
                    {/*{editMode ? (*/}
                      {/*<textarea*/}
                        {/*onChange={updateValue}*/}
                        {/*name="bio"*/}
                        {/*className={`${styles.hpCardText} ${styles.hpCardTextArea} bio mx-auto`}*/}
                      {/*></textarea>*/}
                    {/*) : (*/}
                      {/*<p className={`${styles.hpCardText}  bio mx-auto`}>*/}
                        {/*{userData.bio}*/}
                      {/*</p>*/}
                    {/*)}*/}
                    {/*<div className="social-group" style={{ margin: '20px'}}>*/}
                      {/*{editMode ? (*/}
                        {/*<input*/}
                          {/*type="text"*/}
                          {/*name="facebook"*/}
                          {/*placeholder="Facebook"*/}
                          {/*className={styles.hpSocialLinksTextInput}*/}
                          {/*onChange={updateValue}*/}
                        {/*/>*/}
                      {/*) : (*/}
                        {/*<a*/}
                          {/*href={*/}
                            {/*userData.socialLinks*/}
                              {/*? userData.socialLinks.facebook*/}
                              {/*: "#"*/}
                          {/*}*/}
                          {/*className={`${styles.hpSocial} text-center mr-2 mr-sm-3`}*/}
                        {/*>*/}
                          {/*<i*/}
                            {/*className={`${styles.hpSocialIcon} fab fa-facebook-f`}*/}
                          {/*></i>*/}
                        {/*</a>*/}
                      {/*)}*/}
                      {/*{editMode ? (*/}
                        {/*<input*/}
                          {/*type="text"*/}
                          {/*name="telegram"*/}
                          {/*placeholder="Telegram"*/}
                          {/*className={styles.hpSocialLinksTextInput}*/}
                          {/*onChange={updateValue}*/}
                        {/*/>*/}
                      {/*) : (*/}
                        {/*<a*/}
                          {/*href={*/}
                            {/*userData.socialLinks*/}
                              {/*? userData.socialLinks.telegram*/}
                              {/*: "#"*/}
                          {/*}*/}
                          {/*className={`${styles.hpSocial} text-center mr-2 mr-sm-3`}*/}
                        {/*>*/}
                          {/*<i*/}
                            {/*className={`${styles.hpSocialIcon} fab fa-telegram-plane`}*/}
                          {/*></i>*/}
                        {/*</a>*/}
                      {/*)}*/}
                      {/*{editMode ? (*/}
                        {/*<input*/}
                          {/*type="text"*/}
                          {/*name="twitter"*/}
                          {/*placeholder="Twitter"*/}
                          {/*className={styles.hpSocialLinksTextInput}*/}
                          {/*onChange={updateValue}*/}
                        {/*/>*/}
                      {/*) : (*/}
                        {/*<a*/}
                          {/*href={*/}
                            {/*userData.socialLinks*/}
                              {/*? userData.socialLinks.twitter*/}
                              {/*: "#"*/}
                          {/*}*/}
                          {/*className={`${styles.hpSocial} text-center mr-2 mr-sm-3`}*/}
                        {/*>*/}
                          {/*<i*/}
                            {/*className={`${styles.hpSocialIcon} fab fa-twitter`}*/}
                          {/*></i>*/}
                        {/*</a>*/}
                      {/*)}*/}
                      {/*{editMode ? (*/}
                        {/*<input*/}
                          {/*type="text"*/}
                          {/*name="email"*/}
                          {/*placeholder="Email"*/}
                          {/*className={styles.hpSocialLinksTextInput}*/}
                          {/*onChange={updateValue}*/}
                        {/*/>*/}
                      {/*) : (*/}
                        {/*<a*/}
                          {/*href={*/}
                            {/*userData.socialLinks && userData.socialLinks.email*/}
                              {/*? `mailto:${userData.socialLinks.email}`*/}
                              {/*: "#"*/}
                          {/*}*/}
                          {/*className={`${styles.hpSocial} text-center mr-2 mr-sm-3`}*/}
                        {/*>*/}
                          {/*<i*/}
                            {/*className={`${styles.hpSocialIcon} far fa-envelope`}*/}
                          {/*></i>*/}
                        {/*</a>*/}
                      {/*)}*/}
                    {/*</div>*/}
                  {/*</div>*/}
                {/*</div>*/}
                {/*/!* <div className={styles.hpCardFooter}>*/}
                                    {/*<div style={{paddingBottom: '10px'}} className="donations text-center">*/}
                                        {/*<div className={`${styles.hpFunded} d-inline-block border-right text-center`}>*/}
                                            {/*<p style={{fontSize: '1.56rem'}} className="font-weight-bold mb-0">0.22*/}
                                                {/*BCH</p>*/}
                                            {/*<p className="text-uppercase mb-0">funded</p>*/}
                                        {/*</div>*/}
                                        {/*<div className={`${styles.hpGoal} d-inline-block text-center`}>*/}
                                            {/*<p style={{fontSize: '1.56rem'}} className="font-weight-bold mb-0">30*/}
                                                {/*BCH</p>*/}
                                            {/*<p className="text-uppercase mb-0">goal</p>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div> *!/*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*</div>*/}
      {/*</div>*/}
    {/*</div>*/}
        </>
  );
};
export default profileCard;
