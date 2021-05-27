import React, { useState, useEffect } from 'react';
import { API_URL } from '../../Common/services/generator';
import { getToken } from '../../Common/Authentication';

const blobCache = {}; //blob only survive the session, so its fine here

const APIImage = ({ src, ...other }) => {
    const [image, setImage] = useState();
    useEffect(() => {
        if (!(src + '').startsWith(API_URL)) return setImage(src);
        if (blobCache[src]) return setImage(blobCache[src]);
        getToken(API_URL)
            .then((token) =>
                fetch(src, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                })
            )
            .then((response) => response.blob())
            .then((image) => {
                let outside = URL.createObjectURL(image);
                blobCache[src] = outside;
                setImage(outside);
            });
    }, [src]);
    return <img src={image} alt={other.alt} {...other} />;
};

export default APIImage;
