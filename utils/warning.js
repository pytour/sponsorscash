import React from "react";

export default function Warning({message}) {
    return <label
        className="mb-4 mt-4 flex items-center justify-between w-full px-4 py-2 bg-red-100 text-red-900 text-md "
        title="close">
        {message}
    </label>;
}
