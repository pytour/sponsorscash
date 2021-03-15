import React, {useState} from "react";
import identityBackground from "../../image/Identity-Verifications-background.jpg";
import CountryModalPage from "../../pages/public/countryModal";
import BasicInfoForm from "../../pages/public/basicInfoForm";
import IdVerificationForms from "../../pages/public/IdsVerificationForm";
import {CopyToClipboard} from "react-copy-to-clipboard";

let  initialValues= {
    nationality: '',
        firstName: '',
        lastName: '',
        spouseName: '',
        nickname: '',
        email: '',
        photo: '',
        dob: '',
        gender: '',
        phone: '',
        nid: '',
        address: '',
        state: '',
        city: '',
        code: '',
        country: '',
        }

export default function CustomModal(props) {
    const [showModal, setShowModal] = useState(props.showModal);
    const [copier, setCopier] = useState(false);

    console.log(showModal,"...............")
    function  handleModalCallback(){
        setShowModal(false)
        props.setModalCallback(false)
    }

    function handleCopyFunc(value) {
        setCopier(true)
    }



    return (
        <>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        // onClick={handleModalCallback}
                    >
                        <div className="relative w-auto my-8 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between border-solid border-gray-300 rounded-t">
                                    <div
                                        className="px-6 py-2 ml-auto cursor-pointer "
                                        onClick={handleModalCallback}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>

                                    </div>
                                </div>
                                {/*body*/}
                                <div className=" ">

                                    <div className="flex">

                                        <div className=" md:my-8 items-center justify-items-center">

                                            <p className="text-center text-xl font-black px-4 pt-8 pb-6 text-site-theme"> Your Shareable Link is </p>

                                            <h1 className="mx-4 text-center text-xl text-black font-black p-4"> {props.linkCode}  </h1>


                                        </div>



                                    </div>


                                        <div className="flex items-center justify-center p-6  border-solid border-gray-300 rounded-b">
                                            <CopyToClipboard text={props.linkCode}
                                                             onCopy={() => props.setCopier(true)}>
                                                <button
                                                className="text-white  bg-site-theme  font-bold uppercase px-6 py-3 text-center text-sm outline-none focus:outline-none mr-1 mb-1"
                                                type="button"
                                                style={{ transition: "all .15s ease" }}
                                                onClick={handleCopyFunc}
                                            >
                                                { copier ? "Copier": "Copy"}
                                            </button>
                                            </CopyToClipboard>

                                        </div>

                                </div>
                                {/*footer*/}

                            </div>
                        </div>
                    </div>
                    <div className="opacity-50 fixed inset-0 z-40 bg-black"/>
                </>
            ) : null}
        </>
    );
}
