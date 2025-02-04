import React, { useState } from 'react';

export const Input = ({
    id,
    name,
    value,
    type = "text",
    placeholder = "",
    error = "",
    disabled = false,
    required = false,
    className = "",
    leftIcon,
    rightIcon,
    onChange,
    readonly,
    onBlur,
    visible
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const isActive = isFocused || (value && value.length > 0);

    return (
        <div className="group relative mb-[0.5rem] sm:mb-[1rem] w-full">
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={required}
                    readOnly={readonly}
                    placeholder=""
                    className={`
                        peer
                        w-full 
                        py-[15px] px-[15px]
                        border-2 border-transparent 
                        rounded-xl 
                        bg-[rgba(240,240,240,0.6)]
                        outline-none 
                        transition-all 
                        duration-400 
                        ease-in-out
                        text-xs
                        sm:text-md
                        md:text-lg
                        relative 
                        z-[1]
                        focus:border-primary-light
                        focus:bg-white
                        focus:shadow-[0_10px_20px_rgba(110,125,255,0.2)]
                        focus:scale-[1.05]
                        ${leftIcon ? 'pl-12' : ''}
                        ${rightIcon ? 'pr-12' : ''}
                        ${error ? 'border-[#ff6b6b] animate-shake' : ''}
                        ${visible === "none" ? 'pointer-events-none readonly' : ''}
                        ${className}
                        
                    `}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${id}-error` : undefined}
                />

                <label
                    htmlFor={id}
                    className={`
                        absolute 
                        top-1/2 
                        left-[15px] 
                        -translate-y-1/2 
                        text-[#aaa] 
                        text-xs
                        md:text-base 
                        pointer-events-none 
                        transition-all 
                        duration-300 
                        ease-in-out 
                        opacity-70
                        group-focus-within:top-[-12px]
                        group-focus-within:left-[15px]
                        group-focus-within:text-[12px]
                        group-focus-within:opacity-100
                        group-focus-within:text-primary-light
                        peer-[:not(:placeholder-shown)]:top-[-12px]
                        peer-[:not(:placeholder-shown)]:left-[15px]
                        peer-[:not(:placeholder-shown)]:text-[12px]
                        peer-[:not(:placeholder-shown)]:opacity-100
                        peer-[:not(:placeholder-shown)]:text-primary-light
                    `}
                >
                    {placeholder}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && visible !== "none" && (
                <p
                    id={`${id}-error`}
                    className="mt-1 text-sm text-red-500"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;