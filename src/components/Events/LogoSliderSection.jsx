import Slider from 'react-infinite-logo-slider'
import { motion } from "motion/react";
import Image from 'next/image';

const image0 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//0.png";
const image1 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//1.png";
const image2 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//2.png";
const image3 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//3.png";
const image4 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//4.png";
const image5 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//5.png";
const image6 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//6.png";
const image7 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//7.png";
const image8 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//8.png";
const image9 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//9.png";
const image10 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//10.png";
const image11 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//11.png";
const image12 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//12.png";
const image13 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//13.png";
const image14 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//14.png";
const image15 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//15.png";
const image16 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//16.png";

const images = [image0, image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15, image16];


export default function LogoSliderSection() {

    // calculate the image size depending on the screen size
    // const imageSize = () => {
    //     window.width < 640 ? '60px' : window.width < 1024 ? '120px' : '220px';
    // }

    // on screen width change, recalculate the image size
    // window.addEventListener('resize', imageSize);

    return (
        <div className="w-screen min-h-screen h-full flex flex-col items-center justify-center gap-6 my-40 sm:my-60 md:my-80">

            <motion.h1 className="text-slate-400 mb-10 sm:mb-20 md:mb-40 text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-black">Our Collaborators</motion.h1>

            <div className="relative h-full opacity-40 p-4 w-[90%] sm:w-[85%] md:min-w-[100%] md:max-w-[70rem]">

                <Slider
                    // width={imageSize()}
                    duration={40}
                    pauseOnHover={true}
                    blurBorders={true}
                    blurBorderColor={'#e9edf4'}
                    className="sm:w-auto"
                >
                    {images && images.map((image, index) => (
                        <Slider.Slide key={index}>
                            <Image
                                height={500}
                                width={500}
                                src={image}
                                alt="collaborator logo"
                                className='w-max h-min sm:w-20 sm:h-20 md:w-24 md:h-24 bg-opacity-15'
                            />
                        </Slider.Slide>
                    ))}
                </Slider>
            </div>

        </div>
    )
}
