import React from "react";


const sideDrawer = props => {
  let sideDrawerClasses = "side-drawer";
  if (props.show) {
    sideDrawerClasses = "side-drawer open";
  }

  return (
    <nav className={sideDrawerClasses}>
      Hello
      <style jsx>{`
        .side-drawer {
          height: 100%;
          background: #7d73c3;
          color: #ffca79;
          box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          width: 70%;
          max-width: 500px;
          z-index: 200;
          transform: translateX(-100%);
          transition: transform 0.3s ease-out;
        }

        .side-drawer.open {
          transform: translateX(0);
        }
      `}</style>
    </nav>
  );
};

export default sideDrawer;
