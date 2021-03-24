import React, {useState} from "react";
import ProjectDetailPanel from "../TabPanels/projectDetailPanel";
import SponsorPanel from "../TabPanels/sponsorPanel";
import FeedbackPanel from "../TabPanels/feedbackPanel";

export default function TabNavigation(props) {
    const [openTab, setOpenTab] = React.useState(1);
    const [donationsCount, setDonationsCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);


    function handleDonChange(newVal) {
        setDonationsCount(props.donations.length)
    };

    function handleComChange(newVal) {
        setCommentsCount(newVal)
    };


    return (
        <>
            <div className="flex flex-row">
                <div className="w-full">
                    <ul
                        className="flex list-none text-left text-outline-color flex-row"
                        role="tablist"
                    >
                        <li className={"-mb-px mr-8 py-0 last:mr-0 items-left cursor-pointer '"}>
                            <div
                                className={
                                    " text-md  px-0 py-2 block  " +
                                    (openTab === 1
                                        ? "border-t-2  font-bold  border-branding-color text-branding-color"
                                        : "border-t-0  text-branding-color ")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist"
                            >  Project Details

                            </div>
                        </li>
                        <li className="-mb-px mr-8 py-0 last:mr-0  cursor-pointer text-left">
                            <div
                                className={
                                    " text-md  px-0 py-2 block " +
                                    (openTab === 2
                                        ? "border-t-2  font-bold  border-branding-color text-branding-color"
                                        : "border-t-0   text-branding-color")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                                <p>
                                    Last Donors{" "}
                                    {props.donations && props.donations.length > 0 &&  <span className="ml-2 p-1 text-sm rounded shadow-sm  text-white bg-block">
                                        { donationsCount}
                            </span >}
                                </p>
                            </div>
                        </li>
                        <li className="-mb-px mr-2  py-0 last:mr-0 cursor-pointer text-left">
                            <div
                                className={
                                    " text-md  px-0 py-2  " +
                                    (openTab === 3
                                        ? "border-t-2  font-bold  border-branding-color text-branding-color"
                                        : "border-t-0   text-branding-color")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(3);
                                }}
                                data-toggle="tab"
                                href="#link3"
                                role="tablist"
                            >
                                <p>
                                    Feedback{" "}
                                    {commentsCount > 0 &&    <span className="ml-2 p-1 text-sm rounded shadow-sm text-white bg-block">
                                        {commentsCount}
                            </span>}
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 ">
                        <div className="md:px-4 px-2  py-4 flex-auto">
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <ProjectDetailPanel
                                        details={props.project}
                                        projectCreator={props.projectCreator}
                                    />
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <SponsorPanel
                                        projectId={props.project._id}
                                        onChangeDonationCount={handleDonChange}
                                        donations={props.donations}
                                    />
                                </div>
                                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                    <FeedbackPanel projectId={props.project._id}
                                                   onChangeCommentCount={handleComChange}/>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
