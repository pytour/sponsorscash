import React,{useState} from 'react';
import getConfig from 'next/config';
import Card from '../Card/Card';
import DotLoader from 'react-spinners/DotLoader';
import Carousel from "react-multi-carousel";
const { publicRuntimeConfig } = getConfig();

export default function AdsManagerIndex({boostedProjects,grid}) {

    const [loading,setLoading]= useState(true);

    useState(()=>{

        if(boostedProjects && boostedProjects.length >=0){
            setLoading(false)
        }

    },[boostedProjects])


    return (
        <>
            {loading &&   <div className="p-5 object-center">
              <DotLoader size={50} color={'#7d73c3'}/>
            </div>
            }
            {boostedProjects && boostedProjects[0] &&
            <div className="container max-w-screen-xl px-4 md:px-.5 lg:px-.5 xl:px.5 mb-8 mt-4 mx-auto ">
            <h2 className="block md:text-xl text-md text-branding-color p-2 mb-2">
                Active Campaigns
            </h2>
                {grid===true &&
                <div
                    className="md:visible invisible h-0 md:h-auto grid grid-cols-1 md:grid-cols-3 md:gap-x-20 md:gap-y-8 gap-x-16 gap-y-1 relative">

                    {boostedProjects.map(project => {
                            let cardImage = project.projectId.images[0]
                                ? publicRuntimeConfig.APP_URL +
                                '/media/project/' +
                                project.projectId.images[0]
                                : publicRuntimeConfig.APP_URL + '/media/project/default.jpg';
                            let linkSlug = `/project/${project.projectId._id}`;

                            if (project.projectId.funded >= 0.01)
                                return (
                                    <div key={project.projectId._id} className="mb-2">
                                        <div className="transform scale-100 hover:scale-105">
                                            <Card
                                                key={project.projectId._id}
                                                tag={project.projectId.category}
                                                description={project.projectId.description}
                                                title={project.projectId.title}
                                                funded={project.projectId.funded}
                                                goal={project.projectId.goal}
                                                imageSrc={cardImage}
                                                linkSlug={linkSlug}
                                                boosted={true}
                                                bidId={project._id}

                                            />
                                        </div>
                                    </div>
                                );
                        }
                    )}
                </div>
                }

                {grid===false &&
                <div
                    className="md:visible invisible h-0 md:h-auto grid grid-cols-1  md:gap-y-8  gap-y-3 relative">

                    {boostedProjects.map(project => {
                            let cardImage = project.projectId && project.projectId.images[0]
                                ? publicRuntimeConfig.APP_URL +
                                '/media/project/' +
                                project.projectId.images[0]
                                : publicRuntimeConfig.APP_URL + '/media/project/default.jpg';
                            let linkSlug = `/project/${project.projectId._id}`;

                            if (project.projectId.funded >= 0.01)
                                return (
                                    <div key={project.projectId._id} className="mb-0">
                                        <div className="hover:shadow">
                                            <Card
                                                key={project.projectId._id}
                                                tag={project.projectId.category}
                                                description={project.projectId.description}
                                                title={project.projectId.title}
                                                funded={project.projectId.funded}
                                                goal={project.projectId.goal}
                                                imageSrc={cardImage}
                                                linkSlug={linkSlug}
                                                boosted={true}
                                                smallCard={true}
                                                bidId={project._id}
                                            />
                                        </div>
                                    </div>
                                );
                        }
                    )}
                </div>
                }


            <div className="h-auto lg:h-0 visible lg:invisible mt-4">
                {boostedProjects[0] &&  <Carousel
                    responsive={
                        {
                            mobile: {
                                breakpoint: { max: 767, min: 0 },
                                items: 1
                            },

                            tablet: {
                                breakpoint: { max: 1024, min: 768 },
                                items: 2
                            }

                        }
                    }
                    autoPlay={true}
                    autoPlaySpeed={2500}
                    keyBoardControl={true}
                    customTransition="all linear .5"
                    transitionDuration={1000}

                    infinite={true}
                    showDots={true}

                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    arrows={false}
                    centerMode={false}
                    className=""
                    containerClass="pb-10 container-with-dots"

                >

                    {boostedProjects && boostedProjects[0] &&
                        boostedProjects.map(project => {
                            let cardImage = project.projectId.images[0]
                                ? publicRuntimeConfig.APP_URL +
                                '/media/project/' +
                                project.projectId.images[0]
                                : publicRuntimeConfig.APP_URL + '/media/project/default.jpg';
                            let linkSlug = `/project/${project.projectId._id}`;

                            if (project.projectId.funded >= 0.01)
                                return (
                                    <div key={project.projectId._id} className="mb-2">
                                        <div className="transform scale-100 hover:scale-105">
                                            <Card
                                                key={project.projectId._id}
                                                tag={project.projectId.category}
                                                description={project.projectId.description}
                                                title={project.projectId.title}
                                                funded={project.projectId.funded}
                                                goal={project.projectId.goal}
                                                imageSrc={cardImage}
                                                linkSlug={linkSlug}
                                                boosted={true}
                                            />
                                        </div>
                                    </div>
                                );
                        })}


                </Carousel> }
            </div>


        </div> }
            </>
    );
}
