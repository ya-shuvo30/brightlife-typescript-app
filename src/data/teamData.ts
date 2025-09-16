// Defines the structure for a single team member object
export interface TeamMember {
  name: string;
  title: string;
  img: string;
  quote?: string;
}

// Defines the structure for a single partner object
export interface Partner {
  name: string;
  logo: string;
}

export const teamMembers: TeamMember[] = [
    { 
        name: "Lion Muhammad Main Uddin", 
        title: "CEO & Founder", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=LM",
        quote: "Healthcare is a right, not a privilege. We're building bridges to ensure every family has access to quality care and a brighter life."
    },
    { 
        name: "S Abdul Motin", 
        title: "Advisor", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=SM",
        quote: "Excellence in operations means excellence in care. Every process we optimize brings us closer to serving our members better."
    },
    { 
        name: "Md Ahosan Ullah", 
        title: "Manager (Hr,Admin)", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=MA",
        quote: "Our story is written by the lives we touch. Marketing isn't just about visibility—it's about connecting hearts with hope."
    },
    { 
        name: "Member Four", 
        title: "Lead Developer", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M4",
        quote: "Technology should be invisible, but its impact should be undeniable. We code with compassion and innovate with purpose."
    },
];

export const partners: Partner[] = [
    { name: "Partner A", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+A" },
    { name: "Partner B", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+B" },
    { name: "Partner C", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+C" },
    { name: "Partner D", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+D" },
    { name: "Partner E", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+E" },
    { name: "Partner F", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+F" },
];
