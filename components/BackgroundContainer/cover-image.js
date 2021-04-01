import Image from 'next/image';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CoverImage({ title, src, width }) {
    const [heights, setHeights] = useState(width && parseInt(width) < 700 ? 'small' : 'large');

    console.log('>..', heights);
    const image = (
        <Image
            src={src}
            alt={`Cover Image for ${title}`}
            layout="responsive"
            width={heights === 'large' ? 60 : 100}
            height={heights === 'large' ? 16 : 60}
        />
    );
    return <div className="">{image}</div>;
}

CoverImage.propTypes = {
    title: PropTypes.string,
    src: PropTypes.string,
    width: PropTypes.string
};

export default CoverImage;
