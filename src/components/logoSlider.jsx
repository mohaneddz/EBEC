import Slider from 'react-infinite-logo-slider'

const LogoSlider = ({ images }) => {
    return (
        <Slider
            width="250px"
            duration={40}
            pauseOnHover={true}
            blurBorders={true}
            blurBorderColor={'#eef1f6'}
        >
            {images && images.map((image, index) => (
                <Slider.Slide key={index}>
                    <img src={image} alt="any" className='w-36' />
                </Slider.Slide>
            ))}
        </Slider>
    )
}

export default LogoSlider