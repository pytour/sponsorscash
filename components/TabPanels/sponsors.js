import React from 'react';
import frenchStrings from 'react-timeago/lib/language-strings/en';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import getConfig from 'next/config';
import Link from 'next/link';
import TimeAgo from 'react-timeago/lib/index';

const BigNumber = require('bignumber.js');
const formatter = buildFormatter(frenchStrings);

const { publicRuntimeConfig } = getConfig();

const sponsors = props => {
    let link = props && props.tx && 'https://explorer.bitcoin.com/bch/tx/' + props.tx;

    function formatDate(date) {
        let diff = new Date() - date; // the difference in milliseconds

        if (diff < 1000) {
            // less than 1 second
            return 'right now';
        }

        let sec = Math.floor(diff / 1000); // convert diff to seconds

        if (sec < 60) {
            return sec + ' sec. ago';
        }

        let min = Math.floor(diff / 60000); // convert diff to minutes
        if (min < 60) {
            return min + ' min. ago';
        }

        // format the date
        // add leading zeroes to single-digit day/month/hours/minutes
        let d = date;
        d = [
            '0' + d.getDate(),
            '0' + (d.getMonth() + 1),
            '' + d.getFullYear(),
            '0' + d.getHours(),
            '0' + d.getMinutes()
        ].map(component => component.slice(-2)); // take last 2 digits of every component

        // join the components into date
        return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
    }

    function donationValue(val) {
        val = parseFloat(val);
        if (val < 0.0001) return parseFloat(new BigNumber(val).multipliedBy(10 ** 8)) + ' Satoshi';
        return val + ' BCH';
    }

    function handleRoute() {
        route.push('/');
    }

    return (
        <>
            <Link href={link} passHref={true}>
                <a target="_blank">
                    <div className=" bg-white border-1 border-gray-100 md:p-5 p-3 rounded-md tracking-wide shadow">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-start-1 col-end-5">
                                <img
                                    alt={props.name}
                                    className="md:w-40 w-24 rounded-md border-1 border-gray-100"
                                    src={
                                        props.avatar
                                            ? publicRuntimeConfig.API_URL +
                                              '/media/user/' +
                                              props.avatar
                                            : publicRuntimeConfig.API_URL +
                                              '/media/user/user-avatar.png'
                                    }
                                />
                            </div>
                            <div className="col-start-5 col-end-13 py-2 md:py-4">
                                <div className="max-w-7xl mx-auto  flex items-center justify-between">
                                    <div className="md:text-lg text-sm font-semibold">
                                        {props.name}
                                    </div>
                                    <div className="font-semibold md:text-lg text-sm flex lg:mt-0 lg:flex-shrink-0">
                                        {props.donation && donationValue(props.donation)}
                                    </div>
                                </div>
                                <div className="font-medium text-gray-400 pt-1">
                                    {' '}
                                    <TimeAgo
                                        date={new Date(props.date)}
                                        formatter={formatter}
                                    />{' '}
                                </div>
                                <div className=" mt-2 md:text-lg text-gray-600 text-sm">
                                    {props.comment ? props.comment : 'No Comment'}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        </>
    );
};

export default sponsors;
