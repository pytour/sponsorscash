// import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-awesome-lightbox/build/style.css';
// import "tailwindcss/tailwind.css";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '../styles/globals.css';

import Head from 'next/head';
import React from 'react';
import getConfig from 'next/config';
import PropTypes from 'prop-types';
import "react-multi-carousel/lib/styles.css";
// This default export is required in a new `pages/_app.js` file.
const { publicRuntimeConfig } = getConfig();

function MyApp({ Component, pageProps }) {
    //console.log("pageProps _app", pageProps);
    const metaDesc =
        pageProps.project && pageProps.project.description
            ? pageProps.project.description
            : 'Fundraising for the projects and causes you care about.';
    const metaTitle =
        pageProps.project && pageProps.project.title ? pageProps.project.title : 'Sponsors.Cash';

    const metaImg =
        pageProps.project && pageProps.project.images && pageProps.project.images[0]
            ? `${publicRuntimeConfig.API_URL}/media/project/${pageProps.project.images[0]}`
            : 'https://sponsors.cash/images/logo.png';

    // TODO: [BAC-2] seo meta tags
    // Upload img title & description for campaign pages from pageProps
    return (
        <React.Fragment>
            <Head>
                <title>Sponsors Cash</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:site_name" content="Sponsors.Cash" key="ogsitename" />
                <meta property="og:title" content={metaTitle} key="ogtitle" />
                <meta property="og:description" content={metaDesc} key="ogdesc" />
                <meta property="og:type" content="website" />
                {/* https://ogp.me/#types */}
                <meta property="og:url" content="https://sponsors.cash/" key="ogurl" />
                <meta property="og:image" content={metaImg} key="ogimage" />
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-173074051-1" />

                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            prefix="og: http://ogp.me/ns#"
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-173074051-1');
        `
                    }}
                />
            </Head>
            <Component {...pageProps} />
        </React.Fragment>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType,
    pageProps: PropTypes.object,
    project: PropTypes.object
};

export default MyApp;
