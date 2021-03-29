import React from 'react';

const backdrop = props => (
    <div className="backdrop" onClick={props.click}>
        <style jsx>{`
            .backdrop {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.3);
                z-index: 100;
            }
        `}</style>
    </div>
);

export default backdrop;
