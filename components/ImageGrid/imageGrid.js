import React, {useState} from "react";
import Lightbox from "react-awesome-lightbox";
import getConfig from "next/config";
import Image from "next/image";

const { publicRuntimeConfig } = getConfig();

const imageGrid = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  let allImages = [];

  // useEffect(() => {
  //   if (props.images && props.images[0]) allImages = props.images.map((id) => {
  //     return `${publicRuntimeConfig.APP_URL}/media/project/${id}`;
  //   });
  // }, [props]);
  if (props.images && props.images[0])
    allImages = props.images.map((id) => {
      return `${publicRuntimeConfig.APP_URL}/media/project/${id}`;
    });

  return (
    <>
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-2">
        <div className="rounded-2xl overflow-hidden shadow-sm w-full max-h-36rem cursor-pointer">
            <Image
                layout={'responsive'}
                width={100}
                height={100}

                src={
                    allImages[0]
                        ? allImages[0]
                        : publicRuntimeConfig.APP_URL + "/media/project/default.jpg"
                }
                alt="image 1"

                onClick={() => {
                    setImgIndex(0);
                    setIsOpen(true);
                }}
            />
        </div>
        {allImages.length > 1 ? (
            <div>
            <div className="grid grid-cols-2 gap-2 overflow-hidden  w-full max-h-36rem cursor-pointer">
                {allImages.map((link, index) => {
                    if (index > 0)
                        return (
                            <div
                                className="cols-span-1 rounded-2xl overflow-hidden shadow-sm cursor-pointer w-full max-h-36 "
                            >
                                <Image
                                    layout={'responsive'}
                                    width={100}
                                    height={100}
                                    src={
                                        props.images && props.images[index]
                                            ? link
                                            : "https://via.placeholder.com/500"
                                    }
                                    alt={"image " + index}

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

export default imageGrid;
