import Slider from 'react-infinite-logo-slider'
import { motion } from "motion/react";

const image1 = "/Assets/Companies/Ooredoo.png";
const image2 = "/Assets/Companies/Ooredoo.png";
const image3 = "/Assets/Companies/Ooredoo.png";
const image4 = "/Assets/Companies/Ooredoo.png";
const image5 = "/Assets/Companies/Ooredoo.png";
const image6 = "/Assets/Companies/Ooredoo.png";

const images = [image1, image2, image3, image4, image5, image6];


export default function LogoSliderSection() {

    // calculate the image size depending on the screen size
    const imageSize = () => {
        window.width < 640 ? '60px' : window.width < 1024 ? '120px' : '220px';
    }

    // on screen width change, recalculate the image size
    window.addEventListener('resize', imageSize);

    return (
        <div className="w-screen h-full flex flex-col items-center justify-center gap-6 my-40 sm:my-60 md:my-80">

            <motion.h1 className="text-slate-400 mb-10 sm:mb-20 md:mb-40 text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-black">Our Collaborators</motion.h1>

            <div className="relative h-full opacity-40 p-4 w-[90%] sm:w-[85%] md:min-w-[100%] md:max-w-[70rem]">

                <Slider
                    width={imageSize()}
                    duration={40}
                    pauseOnHover={true}
                    blurBorders={true}
                    blurBorderColor={'#e9edf4'}
                    className="sm:w-auto"
                >
                    {images && images.map((image, index) => (
                        <Slider.Slide key={index}>
                            <img
                                src={image}
                                alt="collaborator logo"
                                className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24'
                            />
                        </Slider.Slide>
                    ))}
                </Slider>
            </div>

        </div>
    )
}
