import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'accent' | 'primary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
        let baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            default: "bg-indigo-600 text-white hover:bg-indigo-700",
            primary: "bg-indigo-600 text-white hover:bg-indigo-700",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100",
            accent: "bg-amber-500 text-white hover:bg-amber-600",
            ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
            outline: "border border-gray-200 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100"
        };

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        };

        const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

        return (
            <button
                ref={ref}
                className={classes}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
