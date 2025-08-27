import React from 'react';

// Define the types for the component's props
interface IconProps {
  path: string;
  className?: string;
  solid?: boolean;
}

const Icon: React.FC<IconProps> = ({ path, className = "w-6 h-6", solid = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={solid ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

export default Icon;
