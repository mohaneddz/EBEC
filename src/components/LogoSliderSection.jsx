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
    return (
        <div className="w-screen h-full flex flex-col items-center justify-center gap-6 my-80">

            <motion.h1 className="text-slate-400 my-40 text-7xl font-black" >Our Collaborators</motion.h1>
            
            <div className="relative h-full opacity-40 p-4 min-w-[80%] max-w-[60rem]">
            
                <Slider
                    width="250px"
                    duration={40}
                    pauseOnHover={true}
                    blurBorders={true}
                    blurBorderColor={'#e9edf4'}
                >
                    {images && images.map((image, index) => (
                        <Slider.Slide key={index}>
                            <img src={image} alt="any" className='w-24 h-24' />
                        </Slider.Slide>
                    ))}
                </Slider>
            </div>


        </div>
    )
}
