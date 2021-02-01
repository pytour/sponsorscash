import React from 'react';
import styles from './supporters.module.css'
const supporters = () => {
    return(
        <div className={`${styles.mainContainer} mx-auto p-5`}>
            <h2 className={`${styles.mainHeading} text-uppercase`}>supporters</h2>
            <div className="d-flex justify-content-around mb-4 flex-wrap flex-lg-nowrap">
                <div className={`${styles.companyFirstLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl.jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companyFirstLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(1).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companyFirstLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(2).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companyFirstLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(3).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companyFirstLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(4).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companyFirstLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(5).jpg" alt="preview" className="img-fluid"/>
                </div>
            </div>
            <div className="d-flex justify-content-around mb-4 flex-wrap flex-lg-nowrap">
                <div className={`${styles.companySecondLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(7).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companySecondLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(8).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companySecondLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(9).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companySecondLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(10).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companySecondLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(12).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companySecondLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(11).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companySecondLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(5).jpg" alt="preview" className="img-fluid"/>
                </div>
                <div className={`${styles.companySecondLine} border rounded-circle mb-2 mb-lg-0`}>
                    <img src="static/images/company/preview-xl%20(12).jpg" alt="preview" className="img-fluid"/>
                </div>
            </div>
            <button type="button" className={`${styles.btnSupport} btn text-uppercase`}>sponsor me</button>
        </div>
    );
};

export default supporters;
