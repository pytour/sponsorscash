import React from 'react';

const Showmore = () => {
    return (
        <>
            <div className="show-more d-flex justify-content-center align-items-center w-100 mb-4">
                <div className="little-circle" />
                <div className="big-circle" />
                <div>
                    <button type="button" className="btn btn-more">
                        Show more
                    </button>
                </div>
                <div className="big-circle" />
                <div className="little-circle" />
            </div>
            <style jsx>{`
                .little-circle {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background-color: #ffca79;
                    display: inline-block;
                    margin-right: 1rem;
                }
                .big-circle {
                    height: 30px;
                    width: 30px;
                    border-radius: 50%;
                    background-color: #ffca79;
                    display: inline-block;
                    margin-right: 1rem;
                }
                .btn-more {
                    background-color: #ffca79;
                    color: #ffffff;
                    font-size: 1.3rem;
                    margin-right: 1rem;
                    border-radius: 50px;
                    height: 40px;
                    padding: 0 1rem;
                }
            `}</style>
        </>
    );
};
export default Showmore;
