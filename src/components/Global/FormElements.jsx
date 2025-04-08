import React, { useState, ChangeEvent, FocusEvent, ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from "@/lib/utils"; // Ensure this path is correct

// --- Simplified Theme Colors (Focus on Usage) ---
const theme = {
    // Input & Select Base
    inputBg: 'bg-slate-700',
    inputBorder: 'border-slate-600',
    inputText: 'text-slate-100',
    inputPlaceholder: 'placeholder-slate-400',

    // Label & Text
    labelText: 'text-slate-300', // Default label color
    labelActiveText: 'text-yellow-400', // Label text when focused/active (or for required *)

    // Focus State
    focusRing: 'focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70',
    focusBorder: 'focus:border-yellow-400', // Can use ring or border or both

    // Accent (Buttons, Checks, Radios)
    accentBg: 'bg-yellow-400',
    accentText: 'text-slate-900', // Text on accent background
    accentColor: 'yellow-400', // For accent-color CSS property

    // Error State
    errorText: 'text-red-400', // Brighter red for dark bg
    errorBorder: 'border-red-500',
    errorRing: 'ring-red-500',

    // Disabled State
    disabledOpacity: 'opacity-60',
    disabledCursor: 'cursor-not-allowed',
};

// --- 1. Simple Input (Recommended for Simplicity) ---
export const SimpleInput = ({
    id,
    name,
    label,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    required,
    disabled,
    className,
    ...props
}) => {
    const InputElement = type === 'textarea' ? 'textarea' : 'input';

    return (
        <div className="mb-4 w-full">
            {/* Label */}
            <label
                htmlFor={id}
                className={cn(
                    "block text-sm font-medium mb-1.5",
                    error ? theme.errorText : theme.labelText
                )}
            >
                {label}
                {required && <span className={`ml-1 text-${theme.accentColor}`}>*</span>}
            </label>

            {/* Input or Textarea */}
            <InputElement
                id={id}
                name={name}
                type={type === 'textarea' ? undefined : type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={type === 'textarea' ? 4 : undefined}
                className={cn(
                    // Base styles
                    "block w-full px-3 py-2.5 border rounded-lg shadow-sm",
                    "transition duration-200 ease-in-out",
                    theme.inputBg,
                    theme.inputBorder,
                    theme.inputText,
                    theme.inputPlaceholder,
                    // Focus styles
                    "focus:outline-none", // Remove default outline
                    theme.focusRing, // Add ring
                    // theme.focusBorder, // Optionally add border color change on focus too
                    // Error styles
                    error ? `${theme.errorBorder} ${theme.errorRing}` : `${theme.inputBorder}`,
                    // Disabled styles
                    disabled ? `${theme.disabledOpacity} ${theme.disabledCursor}` : '',
                    // Textarea specific (optional)
                    type === 'textarea' ? 'min-h-[80px]' : '',
                    className // Allow overriding
                )}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
            />

            {/* Error Message */}
            {error && (
                <p id={`${id}-error`} className={`mt-1.5 text-xs ${theme.errorText}`}>
                    {error}
                </p>
            )}
        </div>
    );
};

// --- 2. Floating Label Input (Corrected & Simplified) ---
export const FloatingLabelInput= ({
    id,
    name,
    label,
    value,
    onChange,
    type = "text",
    error = "",
    disabled = false,
    required = false,
    className = "",
    leftIcon,
    rightIcon,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Determine if label should float: If focused OR if input has value
    const isLabelActive = isFocused || (value !== undefined && value !== '');

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e); // Pass event up if needed
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e); // Pass event up if needed
    };

    return (
        <div className="relative mb-4 w-full">
            {/* Input Wrapper (for icons) */}
            <div className="relative">
                {/* Left Icon */}
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20 text-slate-400">
                        {leftIcon}
                    </div>
                )}

                {/* Input Element */}
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={required} // Still useful for form validation
                    // NOTE: No placeholder needed for floating label logic itself
                    placeholder={isLabelActive ? "" : " "} // Use space only when inactive for layout, or remove entirely
                    className={cn(
                        // Base styles
                        "w-full appearance-none outline-none transition duration-200 ease-in-out relative z-[1]",
                        "border rounded-lg", // Border needed for label positioning
                        theme.inputBg,
                        theme.inputText,
                        // Sizing & Padding (Ensure enough height and top padding for floated label)
                        "px-3 pt-5 pb-2", // Adjust padding: pt must be > label height
                        leftIcon ? 'pl-10' : 'px-3',
                        rightIcon ? 'pr-10' : 'px-3',
                         // Focus styles
                        "focus:outline-none",
                        theme.focusRing, // Use ring instead of border change for label simplicity
                         // Error styles
                        error ? theme.errorBorder : theme.inputBorder,
                         // Disabled styles
                        disabled ? `${theme.disabledOpacity} ${theme.disabledCursor}` : '',
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...props}
                />

                 {/* Floating Label */}
                 <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-0 pointer-events-none transition-all duration-200 ease-in-out",
                        // Position & Text Style based on 'isLabelActive' state
                        isLabelActive
                            ? `top-1.5 text-xs ${theme.labelActiveText}` // Floated state
                            : `top-1/2 -translate-y-1/2 text-base ${theme.labelText}`, // Default state (centered vertically)
                        // Horizontal padding to match input & account for icons
                        leftIcon ? 'pl-10' : 'pl-3',
                        rightIcon ? 'pr-10' : 'pr-3',
                        // Error color override (optional, could color border only)
                        // error ? theme.errorText : '',
                    )}
                >
                    {label}
                    {/* Required marker uses accent color */}
                    {required && <span className={`ml-1 text-${theme.accentColor}`}>*</span>}
                </label>

                {/* Right Icon */}
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-20 text-slate-400">
                        {rightIcon}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p id={`${id}-error`} className={`mt-1.5 text-xs ${theme.errorText}`}>
                    {error}
                </p>
            )}
        </div>
    );
};

// --- 3. Dropdown / Select ---
export const Dropdown = ({
    id,
    name,
    label,
    options = [],
    value,
    onChange,
    placeholder,
    required,
    error,
    disabled,
    className
}) => {
    return (
        <div className="mb-4 w-full">
            {/* Label */}
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-1.5 text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-yellow-400">*</span>}
                </label>
            )}

            {/* Select */}
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`
                    w-full p-2.5 rounded-lg
                    bg-slate-700 text-slate-100 border border-slate-600
                    focus:outline-none focus:ring-2 focus:ring-yellow-400
                    ${error ? 'border-red-500' : ''}
                    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                    ${className || ''}
                `}
                aria-invalid={!!error}
            >
                {/* Placeholder Option */}
                {placeholder && (
                    <option value="" disabled={required} className="text-slate-400">
                        {placeholder}
                    </option>
                )}
                
                {/* Options */}
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Error Message */}
            {error && (
                <p className="mt-1.5 text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

// --- 4. Checkbox ---
export const Checkbox = ({
    id,
    name,
    label,
    checked,
    onChange,
    error,
    disabled,
    className,
    ...props
}) => {
    return (
        <div className={cn("flex items-center mb-2", className)}>
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className={cn(
                    "h-4 w-4 rounded border-slate-500 transition duration-150 ease-in-out ",
                    `text-${theme.accentColor}`, // For older browser fallback
                    `accent-${theme.accentColor}`, // Modern way to color checkmark
                    `focus:ring-${theme.accentColor} focus:ring-offset-slate-800 focus:ring-2`, // Focus ring with offset for dark bg
                    disabled ? `${theme.disabledOpacity} ${theme.disabledCursor}` : 'cursor-pointer',
                    // Error style (optional on checkbox itself)
                    // error ? `border-red-500 ring-2 ring-red-500` : '',
                )}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
             />
             <label
                 htmlFor={id}
                 className={cn(
                    "ml-2 block text-sm",
                    theme.labelText,
                    disabled ? theme.disabledOpacity : 'cursor-pointer hover:text-white',
                 )}
             >
                 {label}
             </label>
              {/* Individual error display (optional) */}
             {/* {error && <p id={`${id}-error`} className={`ml-6 text-xs ${theme.errorText}`}>{error}</p>} */}
         </div>
    );
};

// --- 5. Radio Button ---
export const RadioButton = ({
    id,
    name,
    label,
    value,
    checked,
    onChange,
    disabled,
    className,
    ...props
}) => {
    return (
        <div className={cn("flex items-center mb-2", className)}>
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className={cn(
                    "h-4 w-4 border-slate-500 transition duration-150 ease-in-out", // Radio buttons are often circular by default
                    `text-${theme.accentColor}`,
                    `accent-${theme.accentColor}`,
                    `focus:ring-${theme.accentColor} focus:ring-offset-slate-800 focus:ring-2`,
                    disabled ? `${theme.disabledOpacity} ${theme.disabledCursor}` : 'cursor-pointer',
                )}
                {...props}
             />
             <label
                htmlFor={id}
                className={cn(
                    "ml-2 block text-sm",
                    theme.labelText,
                     disabled ? theme.disabledOpacity : 'cursor-pointer hover:text-white',
                )}
             >
                 {label}
             </label>
        </div>
    );
};

// --- 6. Button ---
export const Button = ({
    text,
    onClick,
    disabled,
    className,
    type = 'button',
    variant = 'primary', // Default variant
    bgColor,
    textColor
}) => {
    // Define base styles
    const baseStyles = `
        select-none inline-flex items-center justify-center px-6 py-2.5 md:px-8 md:py-3
        rounded-lg font-semibold border
        transition-all duration-200 ease-in-out transform
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800
    `;

    // Define variant styles
    let variantStyles = '';
    switch (variant) {
        case 'secondary':
            variantStyles = `
                ${bgColor || 'bg-slate-600'} ${textColor || 'text-slate-100'} border-transparent
                hover:bg-slate-500 focus:ring-slate-500
                active:bg-slate-700
            `;
            break;
        case 'outline':
             variantStyles = `
                bg-transparent ${textColor || theme.labelActiveText} border-current
                hover:bg-yellow-400/10 focus:ring-yellow-400
                active:bg-yellow-400/20
            `; // Example outline uses accent color
            break;
        case 'primary': // Default
        default:
            variantStyles = `
                ${bgColor || theme.accentBg} ${textColor || theme.accentText} border-transparent
                hover:brightness-110 focus:ring-yellow-400
                active:brightness-95
            `;
            break;
    }

    // Define disabled styles
    const disabledStyles = disabled
        ? `${theme.disabledOpacity} ${theme.disabledCursor} pointer-events-none`
        : 'hover:scale-[1.03] active:scale-[1.00] hover:shadow-md'; // Add hover/active effects only if enabled


    return (
        <button
            type={type}
            disabled={disabled}
            className={cn(baseStyles, variantStyles, disabledStyles, className)}
            onClick={!disabled ? onClick : undefined}
        >
            {text}
        </button>
    );
};