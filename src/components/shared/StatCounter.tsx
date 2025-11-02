import React, { useState, useEffect, useRef } from 'react';

// Define the types for the component's props
interface StatCounterProps {
  value: string;
  label: string;
  duration?: number;
  suffix?: string;
}

const StatCounter: React.FC<StatCounterProps> = ({ 
  value, 
  label, 
  duration = 2500,
  suffix = "+"
}) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Parse the target value, removing commas and other formatting
    const targetValue = parseInt(value.replace(/[,\s]/g, ''), 10) || 0;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            }, 
            { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        let animationId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.round(targetValue * easeOutQuart);

            setCount(currentCount);

            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            } else {
                setCount(targetValue);
            }
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [isVisible, targetValue, duration]);

    return (
        <div ref={ref} className="text-center group cursor-default">
            <div className="transition-transform duration-300 group-hover:scale-105">
                <p className="text-3xl md:text-4xl font-extrabold text-emerald-600 font-heading transition-colors duration-300 group-hover:text-emerald-700">
                    {count.toLocaleString()}{suffix}
                </p>
                <p className="text-lg text-gray-500 font-body mt-2 transition-colors duration-300 group-hover:text-gray-700">
                    {label}
                </p>
            </div>
        </div>
    );
};

export default StatCounter;
