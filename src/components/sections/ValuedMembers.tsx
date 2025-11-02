import React, { useState, useEffect, useRef } from 'react';
import Icon from '../shared/Icon.tsx';
import { members } from '../../data/membersData.ts';

const ValuedMembers: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % members.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + members.length) % members.length);
    };

    useEffect(() => {
        if (!isPaused) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [currentIndex, isPaused]);

    // Update carousel transform when currentIndex changes
    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex]);

    return (
        <section id="valuedmembers" className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">What Our Members Say</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-16 leading-relaxed font-body">Real stories from our community across the nation.</p>
                
                <div 
                    className="relative overflow-hidden max-w-4xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div 
                        ref={carouselRef}
                        className={`testimonial-carousel-track flex transition-transform duration-300`}
                    >
                        {members.map((member, index) => (
                            <div key={index} className="flex-shrink-0 w-full p-4">
                                <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border-t-4 border-amber-400">
                                    <img src={member.img} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md"/>
                                    <div className="flex justify-center mb-4 text-amber-400">
                                        {[...Array(member.rating)].map((_, i) => <Icon key={i} path="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" className="w-6 h-6" solid/>)}
                                    </div>
                                    <p className="text-gray-600 italic text-lg mb-6 font-body">{member.testimonial}</p>
                                    <h3 className="text-xl font-bold text-gray-800 font-heading">{member.name}</h3>
                                    <p className="text-gray-500">{member.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" title="Previous testimonial" onClick={prevSlide} className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                        <Icon path="M15.75 19.5L8.25 12l7.5-7.5" className="w-6 h-6 text-gray-600" />
                    </button>
                    <button type="button" title="Next testimonial" onClick={nextSlide} className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                        <Icon path="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ValuedMembers;
