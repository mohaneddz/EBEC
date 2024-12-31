import React from "react";

export const Button = ({ text, color1, color2, link, onClick, visible }) => {
    return (
        <a
            href={link}
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
                transform hover:scale-110 active:scale-90
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
                ${color1 ? "" : "border-2 border-white"} 
                ${color1 ? `bg-gradient-to-br from-[${color1}] to-[${color2}]` : ""}
                ${visible === "none" ? 'pointer-events-none' : ''}
            `}
            target={link ? "_blank" : "_self"}
            onClick={onClick}
        >
            {text}
        </a>
    );
};

export default Button;