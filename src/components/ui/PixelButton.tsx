import React from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface PixelButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const PixelButton: React.FC<PixelButtonProps> = ({
    className,
    variant = 'primary',
    children,
    ...props
}) => {
    const variants = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-800',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400',
        danger: 'bg-red-500 hover:bg-red-600 text-white border-red-800',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                'px-4 py-2 font-pixel text-sm',
                'border-b-4 border-r-4 border-t-2 border-l-2',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};
