import React from 'react';
import styles from './tinyCard.module.css'
const tinyCard = () => {
    return(
        <div className={`${styles.mainWrapper} container py-3`}>
            <div className="row align-items-center">
                <div className="col-6 col-sm-3 col-md-6 col-lg-3">
                    <p className={styles.username}>@muscasto</p>
                </div>
                <div className="col-6 col-sm-1 col-md-6 col-lg-1">
                    <p className={styles.tier}>Tier:2</p>
                </div>
                <div className="col-6 col-sm-4 col-md-6 col-lg-4">
                    <p className={`${styles.subscription} pl-sm-2 pl-md-0 pl-lg-2`}>0.06 BCH/month</p>
                </div>
                <div className="col-6 col-sm-4 col-md-6 col-lg-4">
                    <p className={styles.calendar}><span className={styles.calendarSpan}><i className="far fa-calendar-check"></i></span>2020-05-10</p>
                </div>
            </div>
        </div>
    );
};

export default tinyCard;
