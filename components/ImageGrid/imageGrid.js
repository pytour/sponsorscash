import React, { useState } from 'react';
import Lightbox from 'react-awesome-lightbox';
import getConfig from 'next/config';
import Image from 'next/image';
import PropTypes from 'prop-types';

const { publicRuntimeConfig } = getConfig();

const imageGrid = props => {
    const [isOpen, setIsOpen] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);
    let allImages = [];

    // useEffect(() => {
    //   if (props.images && props.images[0]) allImages = props.images.map((id) => {
    //     return `${publicRuntimeConfig.APP_URL}/media/project/${id}`;
    //   });
    // }, [props]);
    if (props.images && props.images[0])
        allImages = props.images.map(id => {
            return `${publicRuntimeConfig.APP_URL}/media/project/${id}`;
        });




    return (
        <>
            <div className="grid  grid-cols-7   gap-2">
                {allImages.length< 2 ?
                    <div className="col-span-7  relative rounded-2xl overflow-hidden shadow-sm h-64  md:h-96 w-full cursor-pointer">
                        <Image
                            layout="fill"
                            objectFit="cover"
                            // width={100}
                            // height={114}

                            src={
                                allImages[0]
                                    ? allImages[0]
                                    : publicRuntimeConfig.APP_URL + '/media/project/default.jpg'
                            }
                            alt="image 1"
                            onClick={() => {
                                setImgIndex(0);
                                setIsOpen(true);
                            }}
                        />
                    </div> :
                    <div className="col-span-4 relative rounded-2xl overflow-hidden shadow-sm h-64  md:h-96 w-full cursor-pointer">
                        <Image
                            layout="fill"
                            objectFit="cover"
                            // width={100}
                            // height={114}

                            src={
                                allImages[0]
                                    ? allImages[0]
                                    : publicRuntimeConfig.APP_URL + '/media/project/default.jpg'
                            }
                            alt="image 1"
                            onClick={() => {
                                setImgIndex(0);
                                setIsOpen(true);
                            }}
                        />
                    </div>
                }
                {allImages.length > 1 ? (
                    <div className=" col-span-3   ">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-6 overflow-hidden  w-full h-full cursor-pointer">
                            {allImages.map((link, index) => {
                                if (index > 0)
                                    return (
                                        <div className="cols-span-1  relative rounded-2xl overflow-hidden shadow-sm cursor-pointer w-full h-full max-h-44 ">
                                            <Image
                                                // layout={'responsive'}
                                                layout="fill"
                                                objectFit="cover"
                                                src={
                                                    props.images && props.images[index]
                                                        ? link
                                                        : 'https://via.placeholder.com/500'
                                                }
                                                alt={'image ' + index}
                                                onClick={() => {
                                                    setImgIndex(index);
                                                    setIsOpen(true);
                                                }}
                                            />
                                        </div>
                                    );
                            })}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>

            {isOpen &&
            (allImages.length > 1 ? (
                <Lightbox
                    images={allImages}
                    showTitle="false"
                    startIndex={imgIndex}
                    onClose={() => setIsOpen(false)}
                />
            ) : (
                <Lightbox
                    image={allImages[0]}
                    showTitle="false"
                    startIndex={imgIndex}
                    onClose={() => setIsOpen(false)}
                />
            ))}
        </>
    );
};

imageGrid.propTypes = {
    images: PropTypes.array
};

export default imageGrid;
