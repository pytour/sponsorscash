import React from 'react';

export default function GeneralButton({ title }) {
    return (
        <button
            type="button"
            className="w-full  sm:w-auto inline-flex justify-center   text-white border-1 border-branding-text-color text-xl rounded-full py-1.5 px-12 hover:bg-branding-text-color uppercase">
            {title}
        </button>
    );
}
