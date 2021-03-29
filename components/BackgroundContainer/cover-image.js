import Image from 'next/image';
import React, { useState } from 'react';

export default function CoverImage({ title, src, height, width }) {
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
