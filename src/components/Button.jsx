import React from "react";

export const Button = ({ text, color1, color2, onClick, disabled, className }) => {

    const handleClick = (e) => {
        if (onClick) {
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
                max-w-[20rem]
                relative
                overflow-hidden
                inline-flex 
                items-center 
                justify-center 
                hover:cursor-pointer hover:drop-shadow-lg
                px-8 py-3 mt-2
                md:mt-4 text-xs md:text-lg lg:text-xl text-nowrap
                lg:py-4 rounded-full font-bold
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