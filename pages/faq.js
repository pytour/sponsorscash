import React, {useState} from "react";
import Layout from "../components/Layout";


const fee = 0;

const faq = () => {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);

    function handleCollapse(value) {

        if (value === 1) {
            setOpen1(!open1)
            setOpen2(false)
            setOpen3(false)
            setOpen4(false)
            setOpen5(false)
            setOpen6(false)
        }
        if (value === 2) {
            setOpen1(false)
            setOpen2(!open2)
            setOpen3(false)
            setOpen4(false)
            setOpen5(false)
            setOpen6(false)
        }
        if (value === 3) {
            setOpen1(false)
            setOpen2(false)
            setOpen3(!open3)
            setOpen4(false)
            setOpen5(false)
            setOpen6(false)

        }
        if (value === 4) {
            setOpen1(false)
            setOpen2(false)
            setOpen3(false)
            setOpen4(!open4)
            setOpen5(false)
            setOpen6(false)
        }
        if (value === 5) {
            setOpen1(false)
            setOpen2(false)
            setOpen3(false)
            setOpen4(false)
            setOpen5(!open5)
            setOpen6(false)
        }
        if (value === 6) {
            setOpen1(false)
            setOpen2(false)
            setOpen3(false)
            setOpen4(false)
            setOpen5(false)
            setOpen6(!open6)

        }
    }
    return (
        <div>
            <Layout>

                <div className="mt-5  max-w-screen-xl w-full text-center mx-auto">
                    <h2 className="font-md text-6xl text-center">FAQ</h2>
                    <div className="p-8">
                        <div className="w-full text-center mx-auto bg-card h-auto shadow-lg my-1">
                            <div className="cursor-pointer rounded-lg p-3" key={"1"} onClick={() => handleCollapse(1)}>
                                <button
                                    className="uppercase focus:underline hover:underline focus:rounded-lg  focus:ring-2  focus:shadow text-md p-2.5 text-branding-color focus:text-gray-700 ">
                                    Is this platform non-custodial?
                                </button>
                            </div>
                            <div
                                className={(open1 ? "visible h-auto transition duration-700 ease-in-out" : "h-0 invisible pb-2")}>
                                {open1 && <div className={"border py-4 px-6 bg-white shadow-xl"}>
                                    No. We do hold campaign funds. If you don’t feel comfortable
                                    with this we recommend trying out flipstarter.cash. They offer
                                    a non-custodial option. The folks at{" "}
                                    <a href="https://t.me/flipstarter">flipstarter</a> have spent
                                    a lot of time on this project and are very helpful.

                                </div>}
                            </div>
                        </div>
                        <div className="w-full text-center mx-auto bg-card h-auto shadow-lg my-1 ">
                            <div className="cursor-pointer rounded-lg p-3" key={"2"} onClick={() => handleCollapse(2)}>
                                <button
                                    className="uppercase focus:underline hover:underline focus:rounded-lg  focus:ring-2  focus:shadow text-md p-2.5 text-branding-color focus:text-gray-700 ">
                                    What do you charge for your services?
                                </button>
                            </div>
                            <div className={open2 ? "h-auto visible " : "h-0 invisible"}>
                                {open2 && <div className={"border py-4 px-6 bg-white shadow-xl"}>
                                    We charge {fee}% of funds raised. We had a 5% fee and it has
                                    been removed temporarily at the request of the community. We
                                    will revisit this in a few months.
                                </div>}
                            </div>
                        </div>
                        <div className="w-full text-center mx-auto bg-card h-auto shadow-lg my-1">
                            <div className="cursor-pointer rounded-lg p-3" key={"3"} onClick={() => handleCollapse(3)}>
                                <button
                                    className="uppercase focus:underline hover:underline focus:rounded-lg  focus:ring-2  focus:shadow text-md p-2.5 text-branding-color focus:text-gray-700 ">
                                    What is and isn’t allowed on your platform?
                                </button>
                            </div>
                            <div className={open3 ? "h-auto visible " : "invisible h-0"}>
                                {open3 && <div className={"border py-4 px-6 bg-white shadow-xl"}>
                                    We don’t want to moderate this platform, but some people just
                                    want to watch the world burn. <br/>
                                    We reserve the right to remove nefarious campaigns and seize
                                    funds from those nefarious campaigns at our discretion.
                                </div>}
                            </div>
                        </div>
                        <div className="w-full text-center mx-auto bg-card h-auto shadow-lg my-1">
                            <div className="cursor-pointer rounded-lg p-3" key={"4"} onClick={() => handleCollapse(4)}>
                                <button
                                    className="uppercase focus:underline hover:underline focus:rounded-lg  focus:ring-2  focus:shadow text-md p-2.5 text-branding-color focus:text-gray-700 ">
                                    Who is allowed to create a campaign?
                                </button>
                            </div>
                            <div className={open4 ? "h-auto visible " : "invisible h-0"}>
                                {open4 && <div className={"border py-4 px-6 bg-white shadow-xl"}>
                                    Anybody in any location. We don’t place restrictions on who
                                    can use our platform. This is the benefit of using BCH.
                                </div>}
                            </div>

                        </div>
                        <div className="w-full text-center mx-auto bg-card h-auto shadow-lg my-1">
                            <div className="cursor-pointer rounded-lg p-3" key={"5"} onClick={() => handleCollapse(5)}>
                                <button
                                    className="uppercase focus:underline hover:underline focus:rounded-lg  focus:ring-2  focus:shadow text-md p-2.5 text-branding-color focus:text-gray-700 ">
                                    Is there any KYC/AML regulations we need to follow?
                                </button>
                            </div>
                            <div className={open5 ? "h-auto visible " : "invisible h-0"}>
                                {open5 && <div className={"border py-4 px-6 bg-white shadow-xl"}>
                                    We won’t hold any funds ransom to collect any data other than
                                    what is required at signup. <br/>
                                    There is no FIAT involved, just BCH. We see no reason this
                                    should be an issue.
                                </div>}
                            </div>
                        </div>


                        <div className="w-full text-center mx-auto bg-card h-auto shadow-lg my-1">
                            <div className="cursor-pointer rounded-lg p-3" key={"6"} onClick={() => handleCollapse(6)}>
                                <button
                                    className="uppercase focus:underline hover:underline focus:rounded-lg  focus:ring-2  focus:shadow text-md p-2.5 text-branding-color focus:text-gray-700 ">
                                    How can I donate to other campaigns?
                                </button>
                            </div>
                            <div className={open6 ? "h-auto visible " : "invisible h-0"}>
                                {open6 && <div className={"border py-4 px-6 bg-white shadow-xl"}>
                                    <ul>
                                        <li>
                                            Logged in users - Donate with Badger and your name/avatar
                                            will be shown in Last Donors tab
                                        </li>
                                        <br/>
                                        <li>
                                            Anonymous - Any user can click ‘Pay’ and receive the BCH
                                            address to send donations. They will appear as Anonymous
                                            after one confirmation on the BCH blockchain.
                                        </li>
                                    </ul>
                                </div>}
                            </div>
                        </div>

                    </div>
                </div>


            </Layout>

        </div>
    );
};

export default faq;
