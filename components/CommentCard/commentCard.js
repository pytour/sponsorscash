import React from 'react';
import styles from './commentCard.module.css';
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import engStrings from 'react-timeago/lib/language-strings/en';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import PropTypes from 'prop-types';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const formatter = buildFormatter(engStrings);

const commentCard = props => {
    return (
        <div className="rounded-2xl border-1 border-gray-200 bg-white p-4 mt-4 mb-4">
            <div className="flex mb-4 flex-row ">
                <div className="block">
                    <div className="block">
                        <img
                            src={publicRuntimeConfig.APP_URL + '/media/user/' + props.image}
                            alt={props.username}
                            className={styles.userAvatar}
                        />
                    </div>
                </div>
                <div className="pl-1 block">
                    <div className="text-placeholder text-base block ml-6">
                        <Link href={'/' + props.username}>
                            <a>
                                <p className="text-base text-placeholder">{props.name}</p>
                            </a>
                        </Link>
                        <small className="text-xs text-percentage block  ">
                            <TimeAgo date={new Date(props.date)} formatter={formatter} />
                        </small>
                    </div>
                </div>
            </div>
            <div className="text-percentage text-base ml-2">{props.text}</div>
        </div>
    );
};

commentCard.propTypes = {
    image: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
    date: PropTypes.string,
    text: PropTypes.string
};

export default commentCard;
