import React from "react";

export const Button = ({ text, color1, color2, link, onClick, disabled, className }) => {

    const handleClick = (e) => {
        if (link && link.startsWith('#')) {
            e.preventDefault();
            const element = document.getElementById(link.substring(1));
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else if (onClick) {
            onClick(e);
        }
    };

    const buttonStyle = {
        background: color1 && color2 ? `linear-gradient(to bottom right, ${color1}, ${color2})` : color1 ? color1 : color2,
        ...(color1 && color2 === undefined && { background: color1 }),
        ...(color2 && color1 === undefined && { background: color2 })

    }

    return (
        <button
            disabled={disabled}
            className={`
    select-none
    relative
    overflow-hidden
    inline-block
    hover:cursor-pointer hover:drop-shadow-lg
    text-center px-8 py-3 mt-2
    md:mt-4 text-xs md:text-lg lg:text-xl text-nowrap
    lg:px-12 lg:py-4 rounded-full font-bold
    hover:brightness-110
    active:brightness-90
    text-white transition-all duration-100 ease-in-out
    transform hover:scale-105 active:scale-100
    before:content-['']
    before:absolute
    before:top-0
    before:left-[-100%]
    before:w-full
    before:h-full
    before:bg-gradient-to-r
    before:from-transparent
    before:via-white/30
    before:to-transparent
    before:transition-all
    before:duration-500
    hover:before:left-[100%]
    ${className}
    ${color1 ? "" : "border-2 border-white"}
                ${disabled ? 'pointer-events-none opacity-50' : ''}
`}
            style={buttonStyle}
            onClick={handleClick}
        >
            {text}
        </button>
    );
};

export default Button;