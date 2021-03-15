// import React, {useState} from "react";
// import identityBackground from "../../image/Identity-Verifications-background.jpg";
// import CountryModalPage from "../../pages/public/countryModal";
// import BasicInfoForm from "../../pages/public/basicInfoForm";
// import IdVerificationForms from "../../pages/public/IdsVerificationForm";
//
// export default function DonationModal(props) {
//     const [showModal, setShowModal] = useState(props.showModal);
//     const [userData, setUserData] = useState(props.userInfo || {});
//     const [step, setStep]=useState(1);
//
//     function  handleModalCallback(){
//         setShowModal(false)
//         props.setModalCallback(false)
//     }
//
//     function callBackCountry(value) {
//
//         let propsValue = value;
//         setUserData(prevState => ({
//             ...prevState,
//             country: propsValue
//         }))
//         setStep(2);
//     }
//
//     function callBackBasicInfoForm(value){
//
//         setStep(3)
//     }
//
//     function callBackIdForm(value) {
//
//         setStep(3)
//     }
//
//
//     return (
//         <>
//             {showModal ? (
//                 <>
//                     <div
//                         className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
//                         // onClick={handleModalCallback}
//                     >
//                         <div className="relative w-auto my-8 mx-auto max-w-3xl">
//                             {/*content*/}
//                             <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
//                                 {/*header*/}
//                                 <div className="flex items-start justify-between border-solid border-gray-300 rounded-t">
//                                     {step===2 &&  <div className="p-2 cursor-pointer" onClick={()=> setStep(step-1)}>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
//                                     </div> }
//                                     <div
//                                         className="px-6 py-2 ml-auto cursor-pointer "
//                                         onClick={handleModalCallback}
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
//
//                                     </div>
//                                 </div>
//                                 {/*body*/}
//                                 <div className=" ">
//
//                                     <div className="grid grid-cols-12 ">
//
//                                         <div className="md:col-span-6 md:my-8 h-0 md:h-auto invisible  md:visible items-center justify-items-center">
//
//                                             <img src={identityBackground} className="w-full h-auto "
//                                                  alt="identity verification sample"/>
//                                         </div>
//
//                                         <div className="md:col-span-6 col-span-12 pt-2 pb-6 px-6 ">
//                                             {step===1 &&  <CountryModalPage   country={callBackCountry}/> }
//                                             {step === 2 && <BasicInfoForm userInfo={props.userInfo} cb={callBackBasicInfoForm} />}
//                                             {step === 3 && <IdVerificationForms cb={callBackIdForm} />}
//                                         </div>
//
//
//                                     </div>
//
//                                 </div>
//                                 {/*footer*/}
//
//                             </div>
//                         </div>
//                     </div>
//                     <div className="opacity-50 fixed inset-0 z-40 bg-black"/>
//                 </>
//             ) : null}
//         </>
//     );
// }
