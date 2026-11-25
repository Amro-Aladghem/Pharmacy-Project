import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';


const images = [
    '2.png',
    '1.png',
    '3.png',
  ];


export function Carousel()
{

    const [current, setCurrent] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrent(prev => (prev + 1) === images.length ? 0: (prev + 1));
      }, 8000); 
      return () => clearInterval(timer);
    }, []);

    return (
        <>
       
              <Box sx={{ width: '100%', maxWidth: 1100, aspectRatio: '851 / 315', height: 'auto', mx: 'auto', my:1, direction:'ltr', position:'relative', overflow:'hidden', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-md)', backgroundColor:'var(--surface)'}}>
                {images.map((src, index) => (
                <Box
                    key={index}
                    component="img"
                    src={src}
                    alt={`Slide ${index}`}
                    sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: index == current ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    }}
                    display='block'
                />
                ))}
            </Box>
        

        </>

    )
}



export default Carousel;
