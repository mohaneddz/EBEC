import Slider from 'react-infinite-logo-slider'

const image1 = "/Assets/Companies/Ooredoo.png";
const image2 = "/Assets/Companies/Ooredoo.png";
const image3 = "/Assets/Companies/Ooredoo.png";
const image4 = "/Assets/Companies/Ooredoo.png";
const image5 = "/Assets/Companies/Ooredoo.png";
const image6 = "/Assets/Companies/Ooredoo.png";

const images = [image1, image2, image3, image4, image5, image6];

export default function LogoSliderSection() {
    return (
        <div className="relative h-full w-screen opacity-40 bg-slate-200 p-4 border-2 border-slate-300">
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
    )
}
