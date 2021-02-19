import React from "react";
import ImageGrid from "../ImageGrid/imageGrid";
// import ProjectDescription from "../ProjectDescription/projectDescription";

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../ProjectDescription/projectDescription'),
  { ssr: false }
)

const projectBio = (props) => {
  return (
    <div  className="my-4 max-w-screen-xl px-4 lg:px-0 mx-auto">
      <div className="grid grid-cols-12 gap-2 lg:gap-8">
        <div className="col-span-12 lg:col-span-6 mb-3 lg:mb-0">
          <ImageGrid images={props.project.images} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <DynamicComponentWithNoSSR
            id={props.project._id}
            images={props.project.images}
            title={props.project.title}
            description={props.project.description}
            category={props.project.category}
            goal={props.project.goal}
            funded={props.project.funded}
            endTime={props.project.endTime}
            projCashAddress={props.projCashID} // Campaign receiving address
            isTransactionCleared={props.project.isTransactionCleared}
            hasEnded={props.project.hasEnded}
            status={props.project.status}
          />
        </div>
      </div>
    </div>
  );
};

export default projectBio;
