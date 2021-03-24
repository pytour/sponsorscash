import React from "react";
import GeneralButton from "./Button/generalButton";
import Router from "next/router";

export default function NoRouteComponent() {

    function handleRoute() {
        Router.push("/")
    }
    return(
        <div className="flex h-screen">
            <div className="m-auto">
                <h1 className="text-3xl text-center">404</h1>
                <br/>
                <h3 className="text-2xl text-center">Unauthorized Access!!</h3>
<br/>
                    <button
                        onClick={handleRoute}
                        type="button"
                        className="w-full  sm:w-auto inline-flex justify-center   text-white border-1 border-branding-text-color text-xl rounded-full py-1.5 px-12 bg-branding-color hover:bg-branding-text-color uppercase"
                    >
              Go back to home
                    </button>

            </div>
        </div>
    )
}
