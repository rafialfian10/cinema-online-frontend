'use client';

// components next
import Image from 'next/image';

// components react
import { Fragment } from 'react';
// -------------------------------------------

const DinamicImage = ({ movie }: {movie: any}) => {
    // style image
    type ImageStyle = {
        width: string;
        height: string;
        objectFit: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    };

    const imageStyle: ImageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    return (
        <Fragment>
            <Image src={movie?.thumbnail} alt={movie?.title} width={400} height={400} style={imageStyle} />
        </Fragment>
    )
}

export default DinamicImage;
