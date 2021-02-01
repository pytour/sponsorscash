import React from "react";
import ImageGrid from "../ImageGrid/imageGrid";
// import ProjectDescription from "../ProjectDescription/projectDescription";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../ProjectDescription/projectDescription'),
  { ssr: false }
)

const projectBio = (props) => {
  return (
    <MDBContainer className="my-4">
      <MDBRow>
        <MDBCol lg="5">
          <ImageGrid images={props.project.images} />
        </MDBCol>
        <MDBCol lg="7">
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
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default projectBio;
