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
    const [donations, setDonations] = useState();
    const dispatch = useDispatch();
    // const [serverImages,setServerImages]= useState(props.initialImageUrls.map((obj,index)=>{
    //     return { "name${index} }
    // }))
    const [projectImages, setProjectImages] = useState({});
    //     {
    //     image1:props.images && props.images[0] ? props.images[0] : "" ,
    //     image2:props.images && props.images[1] ? props.images[1] : "" ,
    //     image3:props.images && props.images[2] ? props.images[2] : "" ,
    //     image4:props.images && props.images[3] ? props.images[3] : "" ,
    //     image5:props.images && props.images[4] ? props.images[4] : "" ,
    // });


    const checkImageFromServerOrLocal = (url, index) => {


    }

    const [isImageSet, setIsImageSet] = useState(false);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [date, setDate] = useState(tomorrow);


    useEffect(() => {
        if (props.initialImageUrls.length) {
            propsToRawData()
        }
    }, [])

    useEffect(() => {
        if (!token) {
            Swal.fire("Please Login first", "error", "error");
            Router.push("/login");
        } else {
            //
            // TODO: [BAC-1] check token expiration in new project page
            // Need to check neither session token expire or not
            // if expire run DEAUTHENTICATE ask to login again
            // Route to login_page
            axios
                .get(publicRuntimeConfig.APP_URL + "/users/getUserProfile", {
                    headers: {Authorization: "Bearer " + token},
                })
                .then((res) => {
                    console.log('auth ok');
                })
                .catch((err) => {
                    console.log(err)
                    Swal.fire("Please Login first", "error", "error");
                    dispatch({type: "DEAUTHENTICATE"});
                    Router.push("/login");
                });
        }


    }, []);


    const formik = useFormik({
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
                    publicRuntimeConfig.APP_URL + "/project/createProject",
                    {
                        values: values,
                        images: projectImages,
                        date: date,
                    },
                    {headers: {Authorization: "Bearer " + token}}
                )
                .then((response) => {
                    if (response.data.status === 200) {
                        Swal.fire(response.data.message, "success", "success");
                        Router.push("/privateAccount", "/" + response.data.username);
                    }
                })
                .catch((err) => {
                    Swal.fire("Whoops..", "Something Went Wrong:" + err, "error");
                    console.log("ERROR WHILE TRYING CREATE CAMPAIGN:", err);
                });
        },
    });

  function propsToRawData ()  {

       return  props.initialImageUrls.map((obj,index)=> {

           console.log(obj,index);
        // let image = "";
        // let name = "image"+{index};
        //
        // let request = new XMLHttpRequest();
        // request.open('GET', obj, true);
        // request.responseType = 'blob';
        // request.onload = function() {
        //     let reader = new FileReader();
        //     reader.readAsDataURL(request.response);
        //     reader.onload =  function(e){
        //         image = e.target.result;
        //         setImages(name, image);
        //         console.log('DataURL:', e.target.result);
        //     };
        // };
        // request.send();

        })
    }
        //Convert Blob to Data URI
        const imageSelect = async (e) => {
            let image = "";
            let name = e.target.name;
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = await function () {
                image = reader.result;
                setImages(name, image);
            };
        };
        //Set the DataURI in state.
        const setImages = (name, image) => {
            setProjectImages({
                ...projectImages,
                [name]: image,
            });

            setIsImageSet(!isImageSet);
        };


        console.log("..initialImageUrls", props.initialImageUrls);
    console.log("project img????????????>>>", projectImages);

        const handleDateChange = (date) => {
            setDate(date);
        };

        // Set initial data: project && donations
        useEffect(() => {
            console.log("last donors tab projectId", props);
            let projectId = props.project._id;

            if (projectId) {
                setProject(props.project);
                axios
                    .post(publicRuntimeConfig.APP_URL + "/donations/getProjectDonations", {
                        projectId: projectId,
                    })
                    .then((res) => {
                        if (res.data.status === 200) {
                            // console.log("sponsorPanel/last donors:: donations: ", res.data);
                            let sortedDonations = res.data.donations.sort(
                                (a, b) => b.donatedBCH - a.donatedBCH
                            );
                            setDonations(sortedDonations);
                        }
                    })
                    .catch((err) => console.log(err));
            }
        }, [props.project]);

        return (
            <Layout>
                <div className="container max-w-screen-xl my-4 ">
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
                                        {(props.initialImageUrls && props.initialImageUrls[0]) || projectImages.image1 ? "Change Image" : "Choose Image"}</p>
                                </label>
                                {(props.initialImageUrls && props.initialImageUrls[0]) || projectImages.image1 ? (
                                    <img
                                        src={projectImages.image1}
                                        // src={props.initialImageUrls && props.initialImageUrls[0] ? props.initialImageUrls[0] : projectImages.image1}
                                        className="w-full h-96 -mt-2"/>
                                ) : (
                                    ""
                                )}
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
                                        <p className={"w-full text-center   text-white z-50  " + ((props.initialImageUrls && props.initialImageUrls[1]) || projectImages.image2 ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2' : 'mt-0')}
                                        > {(props.initialImageUrls && props.initialImageUrls[1]) || projectImages.image2 ? "Change  Image" : "Choose Image"}</p>
                                    </label>
                                    {(props.initialImageUrls && props.initialImageUrls[1]) || projectImages.image2 ? (
                                        <img
                                            src={projectImages.image2}
                                            // src={props.initialImageUrls && props.initialImageUrls[1] ? props.initialImageUrls[1] : projectImages.image2}
                                            className="w-full h-full -mt-20"/>
                                    ) : (
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
                                        <p className={"w-full text-center   text-white z-50  " + ((props.initialImageUrls && props.initialImageUrls[2]) || projectImages.image3 ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2' : 'mt-0')}
                                        > {(props.initialImageUrls && props.initialImageUrls[2]) || projectImages.image3 ? "Change  Image" : "Choose Image"}</p>
                                    </label>
                                    {(props.initialImageUrls && props.initialImageUrls[2]) || projectImages.image3 ? (
                                        <img
                                            src={projectImages.image3}
                                            // src={props.initialImageUrls && props.initialImageUrls[2] ? props.initialImageUrls[2] : projectImages.image3}
                                            className="w-full h-full -mt-20"/>
                                    ) : (
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
                                        <p className={"w-full text-center   text-white z-50  " + ((props.initialImageUrls && props.initialImageUrls[3]) || projectImages.image4 ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2' : 'mt-0')}
                                        > {(props.initialImageUrls && props.initialImageUrls[3]) || projectImages.image4 ? "Change  Image" : "Choose Image"}</p>
                                    </label>
                                    {(props.initialImageUrls && props.initialImageUrls[3]) || projectImages.image4 ? (
                                        <img
                                            src={projectImages.image4}
                                            // src={props.initialImageUrls && props.initialImageUrls[3] ? props.initialImageUrls[3] : projectImages.image4}
                                            className="w-full h-full -mt-20"/>
                                    ) : (
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
                                        <p className={"w-full text-center   text-white z-50  " + ((props.initialImageUrls && props.initialImageUrls[0]) || projectImages.image5 ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2' : 'mt-0')}
                                        > {(props.initialImageUrls && props.initialImageUrls[4]) || projectImages.image5 ? "Change  Image" : "Choose Image"}</p>
                                    </label>
                                    {(props.initialImageUrls && props.initialImageUrls[4]) || projectImages.image5 ? (
                                        <img
                                            src={projectImages.image5}
                                            // src={props.initialImageUrls && props.initialImageUrls[4] ? props.initialImageUrls[4] : projectImages.image5}
                                            className="w-full h-full -mt-20"/>
                                    ) : (
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

        let project, projectCreator, cashAddress, initialImageUrls;
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

        if (res.data.status === 200) {
            project = res.data.project;
            cashAddress = res.data.cashAddress;
            projectCreator = {
                creator: res.data.creator,
                avatar: res.data.avatar,
                username: res.data.username,
            };

            initialImageUrls = res.data.project.images.map((id, index) => {
                return ` ${publicRuntimeConfig.APP_URL}/media/project/${id}`;
            });

        }
        else {
            return {error: 404};
        }

        return {
            project: project,
            projectCreator: projectCreator,
            cashAddress: cashAddress,
            initialImageUrls: initialImageUrls,
        };
    };

    export default withRedux(project);

// TODO https://insomnia.fountainhead.cash/v1/address/history/bitcoincash:qzz6jumhmcf29vj25ldvcdh4xs3jguqpg5j6qdxq0y