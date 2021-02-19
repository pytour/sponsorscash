import React, {useEffect, useState} from "react";
import {withRedux} from "../../lib/redux";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import getConfig from "next/config";
import Warning from "../../utils/warning";
import DatePicker from "react-datepicker";
import * as Swal from "sweetalert2";
import Router from "next/router";
import {useFormik} from "formik";

const {publicRuntimeConfig} = getConfig();

const validate = (values) => {
    const errors = {};

    if (!values.title) {
        errors.title = "Required";
    } else if (!(values.title.length >= 4 && values.title.length < 150)) {
        errors.title = "Must be greater then 4 characters and less then 150 ";
    }

    if (!values.description) {
        errors.description = "Required";
    } else if (
        !(values.description.length >= 4 && values.description.length < 300)
    ) {
        errors.description = "Must be greater then 4 characters and less then 300 ";
    }

    if (!values.detail) {
        errors.detail = "Required";
    } else if (!(values.detail.length >= 4 && values.detail.length < 5000)) {
        errors.detail = "Must be greater then 4 characters and less then 5000 ";
    }

    if (!values.select) {
        errors.select = "Required";
    }

    if (!values.goal) {
        errors.goal = "Required";
    } else {
        let goal = +values.goal;
        if (typeof goal !== "number" && !isNaN(goal)) {
            errors.goal = "Must be number";
        } else if (goal < 0.001) {
            errors.goal = "Must be greater than 0.001 BCH";
        }
    }

    return errors;
};



const project = (props) => {
     const token = useSelector((state) => state.token);
    const [project, setProject] = useState({});
    const [userData, setUserData] = useState({});
    const dispatch = useDispatch();
    const [projectImages, setProjectImages] = useState({});
    const [propsImage, setPropsImage]= useState([])
    const [isImageSet, setIsImageSet] = useState(false);
    const [date, setDate] = useState( new Date(props.project && props.project.endTime));


    useEffect(() => {
        if (!token) {
            Swal.fire("Please Login first", "error", "error");
            Router.push("/login");
        } else {
            axios
                .get(publicRuntimeConfig.APP_URL + "/users/getUserProfile", {
                    headers: { Authorization: "Bearer " + token },
                })
                .then((res) => {
                    setUserData(res.data);
                })
                .catch((err) => console.log(err));
        }
    }, []);

    let requestBody={};

    if(propsImage && projectImages)  requestBody= {
        changed: projectImages,
        allImagesNames: propsImage
    }


    const formik = useFormik({
        // userData.id

        initialValues: {
            title: props.project.title,
            description: props.project.description,
            select: props.project.category,
            detail: props.project.details,
            goal: props.project.goal,
        },
        validate,
        onSubmit: (values) => {
            axios
                .post(
                    publicRuntimeConfig.APP_URL + "/project/editProject",
                    {
                        values: values,
                        endTime: date,
                        images: requestBody,
                        id:props.project._id,
                    },
                    {headers: {Authorization: "Bearer " + token}}
                )
                .then((response) => {
                    if (response && response.data.status === 200) {
                        Swal.fire(response.data.message, "success", "success");
                        Router.push("/privateAccount", "/" + userData.username);
                    }
                    else {
                        Swal.fire("Whoops..", "Something Went Wrong:" + err, "error");
                    };
                })
                .catch((err) => {
                    Swal.fire("Whoops..", "Something Went Wrong:" + err, "error");

                });
        },
    });

    //Convert Blob to Data URI
    const imageSelect = async (e) => {
        let imageName=`projImg_${userData.id}_${props.project._id}_${e.target.name}.png`;
        let image = "";
        let name = e.target.name;
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = await function () {
            image = reader.result;
            setImages(name, image,imageName);
        };
    };
    //Set the DataURI in state.
    const setImages = (name, image,imageName) => {
        setProjectImages({
            ...projectImages,
            [name]: image,
        });
        let oldProps= props &&  props.project.images;
        let imagePropUpdate= propsImage.length && propsImage.find(element => element === imageName);

        if(!imagePropUpdate || imagePropUpdate===0 ) {
            // Do not add new images only edit existed
            //      oldProps.push(imageName);
            setPropsImage(oldProps);
        }

        setIsImageSet(!isImageSet);
    };

    const handleDateChange = (date) => {
        setDate(date);
    };
    function getImageSrc(value) {
        if (value === "image1") {
            if (projectImages && projectImages.image1 && projectImages.image1) {
                return projectImages.image1;
            }
            else {
                if (props && props.initialImageUrls && props.initialImageUrls.image1) {
                    return props.initialImageUrls && props.initialImageUrls.image1;
                }
                else {
                    return null;
                }
            }
        }
        if (value === "image2") {

            if (projectImages && projectImages.image2 && projectImages.image2) {

                return projectImages.image2;
            }
            else {
                if (props && props.initialImageUrls && props.initialImageUrls.image2) {
                    return props.initialImageUrls && props.initialImageUrls.image2;
                }
                else {
                    return null;
                }
            }
        }
        if (value === "image3") {
            if (projectImages && projectImages.image3 && projectImages.image3) {

                return projectImages.image3;
            }
            else {
                if (props && props.initialImageUrls && props.initialImageUrls.image3) {
                    return props.initialImageUrls && props.initialImageUrls.image3;
                }
                else {
                    return null;
                }
            }
        }
        if (value === "image4") {
            if (projectImages && projectImages.image4 && projectImages.image4) {

                return projectImages.image4;
            }
            else {
                if (props && props.initialImageUrls && props.initialImageUrls.image4) {
                    return props.initialImageUrls && props.initialImageUrls.image4;
                }
                else {
                    return null;
                }
            }
        }
        if (value === "image5") {
            if (projectImages && projectImages.image5 && projectImages.image5) {

                return projectImages.image5;
            }
            else {
                if (props && props.initialImageUrls && props.initialImageUrls.image5) {
                    return props.initialImageUrls && props.initialImageUrls.image5;
                }
                else {
                    return null;
                }
            }

        }
    }

    return (
        <Layout>
            <div className="container max-w-screen-xl my-4 mx-auto ">
                <div className="grid grid-cols-12 gap-8">
                    <div className=" col-span-12 lg:col-span-5 ">
                        <h6 className="mb-2 font-bold">Choose Project Images (Optional)</h6>
                        <div className=" rounded-2xl overflow-hidden shadow-md">

                            <input
                                onChange={imageSelect}
                                type="file"
                                id="image1"
                                name="image1"
                                accept="image/*"
                                className="hidden"
                            />
                            <label htmlFor="image1"
                                   className="flex h-full p-1 bg-gray-400 bg-opacity-75 cursor-pointer z-40 relative bottom-74">
                                <p className="w-full text-center relative top-40 text-white ">
                                    { getImageSrc('image1') ? "Change Image" : "Choose Image"}</p>
                            </label>
                            { getImageSrc('image1') ?
                                <img
                                        src={getImageSrc('image1')}
                                        className="w-full h-96 -mt-2"/> : ""
                                }

                            </div>
                        <div className="grid grid-cols-2  md:grid-cols-4 gap-4 md:gap-2 my-4">

                            <div className="rounded-xl overflow-hidden  shadow-md w-full h-32  ">

                                <input
                                    onChange={imageSelect}
                                    type="file"
                                    id="image2"
                                    name="image2"
                                    accept="image/*"
                                    className="hidden"
                                />

                                <label htmlFor="image2"
                                       className={"flex cursor-pointer  bg-gray-400 bg-opacity-75 z-40 "}
                                >
                                    <p className={"w-full text-center   text-white z-50  " + (getImageSrc('image2') ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2' : 'mt-0')}
                                    > {getImageSrc('image3') ?"Change  Image" : "Choose Image"}</p>
                                </label>

                                { getImageSrc('image2') ?
                                    <img
                                        src={getImageSrc('image2')}
                                         className="w-full h-full -mt-16"/>
                                 : (
                                    ""
                                )}
                            </div>
                            <div className="rounded-xl  overflow-hidden  shadow-md w-full h-32">

                                <input
                                    onChange={imageSelect}
                                    type="file"
                                    id="image3"
                                    name="image3"
                                    accept="image/*"
                                    className="hidden"
                                />
                                <label htmlFor="image3"
                                       className="flex cursor-pointer  bg-gray-400 bg-opacity-75 z-40 ">
                                    <p className={"w-full text-center   text-white z-50  " + (getImageSrc('image3') ?'bg-gray-400 bg-opacity-75  mt-10 pt-2' : 'mt-0')}
                                    > {getImageSrc('image3') ? "Change  Image" : "Choose Image"}</p>
                                </label>
                                { getImageSrc('image3') ?
                                    <img
                                        src={getImageSrc('image3')}
                                        className="w-full h-full -mt-20"/>
                                    : (
                                        ""
                                    )}
                            </div>
                            <div className="rounded-xl  overflow-hidden  shadow-md w-full h-32  ">

                                <input
                                    onChange={imageSelect}
                                    type="file"
                                    id="image4"
                                    name="image4"
                                    accept="image/*"
                                    className="hidden"
                                />
                                <label htmlFor="image4"
                                       className="flex cursor-pointer  bg-gray-400 bg-opacity-75 z-40 ">
                                    <p className={"w-full text-center   text-white z-50  " + (getImageSrc('image4') ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2' : 'mt-0')}
                                    > {getImageSrc('image4') ? "Change  Image" : "Choose Image"}</p>
                                </label>
                                { getImageSrc('image4') ?
                                    <img
                                        src={getImageSrc('image4')}
                                        className="w-full h-full -mt-20"/>
                                    : (
                                        ""
                                    )}
                            </div>
                            <div className="rounded-xl  overflow-hidden  shadow-md w-full h-32  ">

                                <input
                                    onChange={imageSelect}
                                    type="file"
                                    id="image5"
                                    name="image5"
                                    accept="image/*"
                                    className="hidden"
                                />
                                <label htmlFor="image5"
                                       className="flex cursor-pointer  bg-gray-400 bg-opacity-75 z-40 ">
                                    <p className={"w-full text-center   text-white z-50  " + (getImageSrc('image5') ?'bg-gray-400 bg-opacity-75  mt-10 pt-2' : 'mt-0')}
                                    > {getImageSrc('image5') ?"Change  Image" : "Choose Image"}</p>
                                </label>
                                { getImageSrc('image5') ?
                                    <img
                                        src={getImageSrc('image5')}
                                        className="w-full h-full -mt-20"/>
                                    : (
                                        ""
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12  lg:col-span-7">
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                                <div className="flex  space-between items-baseline text-branding-color">
                                    <div className="mb-3 w-full">
                                        <p className="mb-3">Campaign Title:</p>
                                        <input
                                            disabled
                                            type="text"
                                            name="title"
                                            id="title"
                                            placeholder="Campaign title"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.title}
                                            className=" w-full  h-10 p-3 text-outline-color placeholder-placeholder
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent"
                                        />
                                        {formik.touched.title && formik.errors.title ? (
                                            <Warning
                                                message={formik.errors.title}/>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex space-between items-baseline text-branding-color">
                                    <div className="mb-3 w-full">
                                        <p className="mb-3">Funding goal:</p>
                                        <input
                                            type="text"
                                            name="goal"
                                            id="goal"
                                            placeholder="Funding Goal (BCH)"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.goal}
                                            className="mb-3 w-full  h-10 p-3 text-outline-color placeholder-placeholder
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent"
                                        />
                                        {formik.touched.goal && formik.errors.goal ? (
                                            <Warning
                                                message={formik.errors.goal}/>
                                        ) : null}
                                    </div>
                                </div>


                                <select
                                    disabled
                                    className="mb-3 w-full  h-10 pl-3 py-1 text-outline-color placeholder-placeholder
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent"
                                    type="select"
                                    id="select"
                                    name="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.select}
                                >
                                    <option selected hidden>
                                        Category
                                    </option>
                                    <option value="Art">Art</option>
                                    <option value="Architecture">Architecture</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Blockchain">Blockchain</option>
                                    <option value="Blogs and Vlogs">Blogs and Vlogs</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Dance and Theater">Dance and Theater</option>
                                    <option value="Education">Education</option>
                                    <option value="Enviroment">Enviroment</option>
                                    <option value="Fashion and Wearables"> Fashion & Wearables</option>
                                    <option value="Film">Film</option>
                                    <option value="Food and Beverages">Food & Beverages</option>
                                    <option value="Health and Fitness">Health and Fitness</option>
                                    <option value="Home">Home</option>
                                    <option value="Human Rights">Human Rights</option>
                                    <option value="Local Businesses">Local Businessess</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Music">Music</option>
                                    <option value="Other">Other</option>
                                    <option value="Podcasts">Podcasts</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Sport">Sport</option>
                                    <option value="Science">Science</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Travel and Outdoors">Travel & Outdoors</option>
                                    <option value="Video games">Video Games</option>
                                    <option value="Video">Video</option>
                                    <option value="Wellness">Wellness</option>
                                    <option value="Web series and TV shows">
                                        Web Series & TV shows
                                    </option>
                                    <option value="Writing and Publishing">
                                        Writing and Publishing
                                    </option>
                                </select>
                                {formik.touched.select && formik.errors.select ? (
                                    <Warning
                                        message={formik.errors.select}/>
                                ) : null}


                                <div className="mt-3 mb-3 flex justify-between text-branding-color">
                                    <p className="text-center pt-1 text-branding-color">Funding End Date:</p>
                                    <span className=" px-3 pt-1.5  h-10
                                   rounded-2xl border-outline-color outline-outline-color
                                    ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent">
                                         <DatePicker selected={date} onChange={handleDateChange} className=" "/>

                                        </span>
                                </div>
                                <div className="mb-2 w-full">
                                    <p className="text-left pb-3 text-branding-color">Sort description</p>
                                    <textarea
                                        name="description"
                                        id="description"
                                        placeholder="Campaign short description"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.description}
                                        className="px-3 pt-1.5 w-full
                                   rounded-md border-outline-color outline-outline-color
                                    ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent"
                                    />
                                    {formik.touched.description && formik.errors.description ? (
                                        <Warning
                                            message={formik.errors.description}/>
                                    ) : null}
                                </div>
                                <div className="mb-2 w-full">
                                    <p className="text-left text-branding-color pb-3">Full description</p>
                                    <textarea
                                        name="detail"
                                        id="detail"
                                        rows="6"
                                        placeholder="Campaign full description"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.detail}
                                        className="px-3 pt-1.5 w-full
                                                   rounded-md border-outline-color outline-outline-color
                                                    ring-border-color focus:ring-2 focus:ring-purple-300
                                                   focus:border-purple-300  focus:outline-none
                                                    border-1 focus:border-0  bg-transparent"
                                    />
                                    {formik.touched.detail && formik.errors.detail ? (
                                        <Warning
                                            message={formik.errors.detail}/>
                                    ) : null}
                                </div>
                            </div>
                            <button type="submit"
                                    className="md:w-half w-full text-black rounded-xs h-10 uppercase bg-outline-color text-lg hover:shadow-xl shadow-md  mb-6 mt-6">
                                Update Project
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

project.getInitialProps = async ({query}) => {
    const {id} = query;

    const {publicRuntimeConfig} = getConfig();

    let project, projectCreator, cashAddress,imageUrlsObject={};
    // console.log("slug", id, query);
    let res;
    try {
        res = await axios.get(
            publicRuntimeConfig.APP_URL + "/project/getSingleProject/" + id
        );
    }
    catch (error) {
        return {error: 404};
    }

    let rawPath=publicRuntimeConfig.APP_URL+ "/media/project/"

    if (res.data.status === 200) {
        project = res.data.project;
        cashAddress = res.data.cashAddress;
        projectCreator = {
            creator: res.data.creator,
            avatar: res.data.avatar,
            username: res.data.username,
        };

        if(res.data.project.images && res.data.project.images.length ) {

            for (let i = 0; i < res.data.project.images.length; ++i) {
                let newIndex="image" + res.data.project.images[i].charAt(res.data.project.images[i].length - 5);

                imageUrlsObject[newIndex] = rawPath + res.data.project.images[i];

            }

        }

    }
    else {
        return {error: 404};
    }

    return {
        project: project,
        projectCreator: projectCreator,
        cashAddress: cashAddress,
        initialImageUrls:imageUrlsObject ? imageUrlsObject : {},
    };
};

export default withRedux(project);

