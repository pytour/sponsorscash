import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Swal from 'sweetalert2';
import Router from 'next/router';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import getConfig from 'next/config';
import Warning from '../../utils/warning';
import ProjectSucess from '../Modal/projectSucceModal';
import DotLoader from 'react-spinners/DotLoader';

let Wallet = require('../../lib/walet/walletCreate');

let wallet = new Wallet();

const { publicRuntimeConfig } = getConfig();

const validate = values => {
    const errors = {};

    if (!values.title) {
        errors.title = 'Required';
    } else if (!(values.title.length >= 4 && values.title.length < 150)) {
        errors.title = 'Must be greater then 4 characters and less then 150 ';
    }

    if (!values.description) {
        errors.description = 'Required';
    } else if (!(values.description.length >= 4 && values.description.length < 300)) {
        errors.description = 'Must be greater then 4 characters and less then 300 ';
    }

    if (!values.detail) {
        errors.detail = 'Required';
    } else if (!(values.detail.length >= 4 && values.detail.length < 5000)) {
        errors.detail = 'Must be greater then 4 characters and less then 5000 ';
    }

    if (!values.select) {
        errors.select = 'Required';
    }

    if (!values.goal) {
        errors.goal = 'Required';
    } else {
        let goal = +values.goal;
        if (typeof goal !== 'number' && !isNaN(goal)) {
            errors.goal = 'Must be number';
        } else if (goal < 0.001) {
            errors.goal = 'Must be greater than 0.001 BCH';
        }
    }

    return errors;
};

const newProjectForm = () => {
    const dispatch = useDispatch();
    const [projectImages, setProjectImages] = useState({});
    const [isImageSet, setIsImageSet] = useState(false);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [date, setDate] = useState(tomorrow);
    const token = useSelector(state => state.token);
    const [loading, setLoading] = useState(false);
    const [secretKey, setSecretKey] = useState(null);
    const [walletInfo, setWalletInfo] = useState(null);

    useEffect(() => {
        if (!token) {
            Swal.fire('Please Login first', 'error', 'error');
            Router.push('/login');
        } else {
            //
            // TODO: [BAC-1] check token expiration in new project page
            // Need to check neither session token expire or not
            // if expire run DEAUTHENTICATE ask to login again
            // Route to login_page
            axios
                .get(publicRuntimeConfig.API_URL + '/users/getUserProfile', {
                    headers: { Authorization: 'Bearer ' + token }
                })
                .then(res => {
                    console.log('auth ok');
                })
                .catch(err => {
                    console.log(err);
                    Swal.fire('Please Login first', 'error', 'error');
                    dispatch({ type: 'DEAUTHENTICATE' });
                    Router.push('/login');
                });
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            select: '',
            detail: '',
            goal: ''
        },
        validate,
        onSubmit: values => {
            setLoading(true);
            let walletData = wallet.createWallet();
            if (walletData && walletData.cashAddress) {
                setWalletInfo({
                    wallet: walletData,
                    formValue: values
                });

                setLoading(false);
                setSecretKey({
                    secret: walletData.mnemonic,
                    username: 'none'
                });
            }

        }
    });

    //Convert Blob to Data URI
    const imageSelect = async e => {
        let image = '';
        let name = e.target.name;
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = await function() {
            image = reader.result;
            setImages(name, image);
        };
    };
    //Set the DataURI in state.
    const setImages = (name, image) => {
        setProjectImages({
            ...projectImages,
            [name]: image
        });
        setIsImageSet(!isImageSet);
    };

    const handleDateChange = date => {
        setDate(date);
    };

    function resetAllData(value) {
        setSecretKey(null);
    }

    if (secretKey && secretKey.username) {
        return (
            <ProjectSucess
                secret={secretKey}
                walletInfo={walletInfo}
                images={projectImages}
                resetAllData={resetAllData}
                date={date}
                token={token}
            />
        );
    }

    if(loading){
         return (
             <div className="flex items-center justify-center h-screen z-50 bg-transparent ">
                <DotLoader size={100} color={'#7d73c3'}  />
                 <p className="mt-4 text-center text-blue-400 font-bold "> Creating Project</p>
            </div>
         )

    }
    return (
        <div className="relative container max-w-screen-xl my-4 mx-auto">
            <div className="grid grid-cols-12 gap-8 px-4">
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
                        <label
                            htmlFor="image1"
                            className="flex h-full p-1 bg-gray-400 bg-opacity-75 cursor-pointer z-40 relative bottom-74">
                            <p className="w-full text-center relative top-40 text-white ">
                                {projectImages.image1 ? 'Change Image' : 'Choose Image'}
                            </p>
                        </label>
                        {projectImages.image1 ? (
                            <img src={projectImages.image1} className="w-full h-96 -mt-2" />
                        ) : (
                            ''
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

                            <label
                                htmlFor="image2"
                                className={'flex cursor-pointer  bg-gray-400 bg-opacity-75 z-40 '}>
                                <p
                                    className={
                                        'w-full text-center   text-white z-50  ' +
                                        (projectImages.image2
                                            ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2'
                                            : 'mt-0')
                                    }>
                                    {' '}
                                    {projectImages.image2 ? 'Change  Image' : 'Choose Image'}
                                </p>
                            </label>
                            {projectImages.image2 ? (
                                <img src={projectImages.image2} className="w-full h-full -mt-20" />
                            ) : (
                                ''
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
                            <label
                                htmlFor="image3"
                                className="flex cursor-pointer  bg-gray-400 bg-opacity-75 z-40 ">
                                <p
                                    className={
                                        'w-full text-center   text-white z-50  ' +
                                        (projectImages.image3
                                            ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2'
                                            : 'mt-0')
                                    }>
                                    {' '}
                                    {projectImages.image3 ? 'Change  Image' : 'Choose Image'}
                                </p>
                            </label>
                            {projectImages.image3 ? (
                                <img src={projectImages.image3} className="w-full h-full -mt-20" />
                            ) : (
                                ''
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
                            <label
                                htmlFor="image4"
                                className="flex cursor-pointer  bg-gray-400 bg-opacity-75 z-40 ">
                                <p
                                    className={
                                        'w-full text-center   text-white z-50  ' +
                                        (projectImages.image4
                                            ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2'
                                            : 'mt-0')
                                    }>
                                    {' '}
                                    {projectImages.image4 ? 'Change  Image' : 'Choose Image'}
                                </p>
                            </label>
                            {projectImages.image4 ? (
                                <img src={projectImages.image4} className="w-full h-full -mt-20" />
                            ) : (
                                ''
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
                            <label
                                htmlFor="image5"
                                className="flex cursor-pointer  bg-gray-400 bg-opacity-75 z-40 ">
                                <p
                                    className={
                                        'w-full text-center   text-white z-50  ' +
                                        (projectImages.image5
                                            ? 'bg-gray-400 bg-opacity-75  mt-10 pt-2'
                                            : 'mt-0')
                                    }>
                                    {' '}
                                    {projectImages.image5 ? 'Change  Image' : 'Choose Image'}
                                </p>
                            </label>
                            {projectImages.image5 ? (
                                <img src={projectImages.image5} className="w-full h-full -mt-20" />
                            ) : (
                                ''
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
                                        <Warning message={formik.errors.title} />
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex space-between items-baseline text-branding-color">
                                <div className="mb-3 w-full">
                                    <p className="mb-3">Funding goal:</p>
                                    <input
                                        type="number"
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
                                        <Warning message={formik.errors.goal} />
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
                                value={formik.values.select}>
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
                                <Warning message={formik.errors.select} />
                            ) : null}

                            {
                                loading && <div className="flex items-center justify-center z-50">
                                    <DotLoader size={50} color={'#7d73c3'}  />
                                </div>
                            }

                            <div className="mt-3 mb-3 flex justify-between text-branding-color">
                                <p className="text-center pt-1">Funding End Date:</p>
                                <span
                                    className=" px-3 pt-1.5  h-10
                                   rounded-2xl border-outline-color outline-outline-color
                                    ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent">
                                    <DatePicker
                                        selected={date}
                                        onChange={handleDateChange}
                                        className=" "
                                    />
                                </span>
                            </div>
                            <div className="mb-3 w-full">
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
                                    <Warning message={formik.errors.description} />
                                ) : null}
                            </div>
                            <div className="mb-3 w-full">
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
                                    <Warning message={formik.errors.detail} />
                                ) : null}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="md:w-half w-full text-black rounded-xs h-10 uppercase bg-outline-color text-lg hover:shadow-xl shadow-md  mb-6 mt-6">
                            Create Project
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default newProjectForm;
