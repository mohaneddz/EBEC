import React, { useState, ChangeEvent, FocusEvent, ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from "@/utils/cn";

const theme = {
    inputBg: 'bg-slate-700',
    inputBorder: 'border-slate-600',
    inputText: 'text-slate-100',
    inputPlaceholder: 'placeholder-slate-400',
    labelText: 'text-slate-300',
    labelActiveText: 'text-yellow-400',
    focusRing: 'focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70',
    focusBorder: 'focus:border-yellow-400',
    accentBg: 'bg-yellow-400',
    accentText: 'text-slate-900',
    accentColor: 'yellow-400',
    errorText: 'text-red-400',
    errorBorder: 'border-red-500',
    errorRing: 'ring-red-500',
    disabledOpacity: 'opacity-60',
    disabledCursor: 'cursor-not-allowed',
};

interface SimpleInputProps {
    id: string;
    name?: string;
    label?: string;
    type?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const SimpleInput: React.FC<SimpleInputProps> = ({
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
                    "block w-full px-3 py-2.5 border rounded-lg shadow-sm",
                    "transition duration-200 ease-in-out",
                    theme.inputBg,
                    theme.inputBorder,
                    theme.inputText,
                    theme.inputPlaceholder,
                    "focus:outline-none",
                    theme.focusRing,
                    error ? `${theme.errorBorder} ${theme.errorRing}` : `${theme.inputBorder}`,
                    disabled ? `${theme.disabledOpacity} ${theme.disabledCursor}` : '',
                    type === 'textarea' ? 'min-h-[80px]' : '',
                    className
                )}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
            />
            {error && (
                <p id={`${id}-error`} className={`mt-1.5 text-xs ${theme.errorText}`}>
                    {error}
                </p>
            )}
        </div>
    );
};

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    name?: string;
    label?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
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
    const isLabelActive = isFocused || (value !== undefined && value !== '');

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className="relative mb-4 w-full">
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20 text-slate-400">
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
                    placeholder={isLabelActive ? "" : " "}
                    className={cn(
                        "w-full appearance-none outline-none transition duration-200 ease-in-out relative z-[1]",
                        "border rounded-lg",
                        theme.inputBg,
                        theme.inputText,
                        "px-3 pt-5 pb-2",
                        leftIcon ? 'pl-10' : 'px-3',
                        rightIcon ? 'pr-10' : 'px-3',
                        "focus:outline-none",
                        theme.focusRing,
                        error ? theme.errorBorder : theme.inputBorder,
                        disabled ? `${theme.disabledOpacity} ${theme.disabledCursor}` : '',
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-0 pointer-events-none transition-all duration-200 ease-in-out",
                        isLabelActive
                            ? `top-1.5 text-xs ${theme.labelActiveText}`
                            : `top-1/2 -translate-y-1/2 text-base ${theme.labelText}`,
                        leftIcon ? 'pl-10' : 'pl-3',
                        rightIcon ? 'pr-10' : 'pr-3',
                    )}
                >
                    {label}
                    {required && <span className={`ml-1 text-${theme.accentColor}`}>*</span>}
                </label>
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-20 text-slate-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p id={`${id}-error`} className={`mt-1.5 text-xs ${theme.errorText}`}>
                    {error}
                </p>
            )}
        </div>
    );
};

interface DropdownOption {
    value: string | number;
    label: string;
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    name?: string;
    label?: string;
    options?: DropdownOption[];
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
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
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-1.5 text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-yellow-400">*</span>}
                </label>
            )}
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
                {placeholder && (
                    <option value="" disabled={required} className="text-slate-400">
                        {placeholder}
                    </option>
                )}
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1.5 text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    name?: string;
    label?: string;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
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
                    `text-${theme.accentColor}`,
                    `accent-${theme.accentColor}`,
                    `focus:ring-${theme.accentColor} focus:ring-offset-slate-800 focus:ring-2`,
                    disabled ? `${theme.disabledOpacity} ${theme.disabledCursor}` : 'cursor-pointer',
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
         </div>
    );
};

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    name?: string;
    label?: string;
    value?: string | number;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
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
                    "h-4 w-4 border-slate-500 transition duration-150 ease-in-out",
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

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "outline";
    bgColor?: string;
    textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    disabled,
    className,
    type = 'button',
    variant = 'primary',
    bgColor,
    textColor
}) => {
    const baseStyles = `
        select-none inline-flex items-center justify-center px-6 py-2.5 md:px-8 md:py-3
        rounded-lg font-semibold border
        transition-all duration-200 ease-in-out transform
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800
    `;
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
            `;
            break;
        case 'primary':
        default:
            variantStyles = `
                ${bgColor || theme.accentBg} ${textColor || theme.accentText} border-transparent
                hover:brightness-110 focus:ring-yellow-400
                active:brightness-95
            `;
            break;
    }
    const disabledStyles = disabled
        ? `${theme.disabledOpacity} ${theme.disabledCursor} pointer-events-none`
        : 'hover:scale-[1.03] active:scale-[1.00] hover:shadow-md';

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