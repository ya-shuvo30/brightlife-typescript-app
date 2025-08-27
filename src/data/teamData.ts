// Defines the structure for a single team member object
export interface TeamMember {
  name: string;
  title: string;
  img: string;
}

// Defines the structure for a single partner object
export interface Partner {
  name: string;
  logo: string;
}

export const teamMembers: TeamMember[] = [
    { name: "Member One", title: "CEO & Founder", img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M1" },
    { name: "Member Two", title: "COO", img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M2" },
    { name: "Member Three", title: "Marketing Head", img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M3" },
    { name: "Member Four", title: "Lead Developer", img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M4" },
];

export const partners: Partner[] = [
    { name: "Partner A", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+A" },
    { name: "Partner B", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+B" },
    { name: "Partner C", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+C" },
    { name: "Partner D", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+D" },
    { name: "Partner E", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+E" },
    { name: "Partner F", logo: "https://placehold.co/200x100/f3f4f6/9ca3af?text=Partner+F" },
];
