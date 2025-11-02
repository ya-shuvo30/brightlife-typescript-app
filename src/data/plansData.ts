// Defines the structure for a single pricing plan object
export interface Plan {
  name: string;
  price: string;
  duration: string;
  features: string[];
  featured: boolean;
}

// Defines the structure for a single core service object
export interface CoreService {
    title: string;
    description: string;
    icon: string;
}

export const plans: Plan[] = [
    { 
        name: 'Silver (1 Year)', 
        price: '1,500', 
        duration: '/year', 
        features: [
            '24/7 Tele-Doctor & Specialist Consultation', 
            'Discounts: Hospital, Medicine (Up to 15%), Shops (Up to 30%)',
            'Hospitalization: ৳5,000 Cashback (1 Year) & 10 Nights',
            'Life Coverage: AD ৳100,000 & ND ৳50,000',
            'Gift & Tour by Lottery'
        ], 
        featured: false 
    },
    { 
        name: 'Bronze (2 Years)', 
        price: '2,500', 
        duration: '/year', 
        features: [
            'All Silver Features',
            'Increased Cashback: ৳10,000 (2 Years)',
            'Increased Stay: 20 Nights',
            'Life Coverage: AD ৳100,000 & ND ৳50,000',
            'Gift & Tour by Lottery'
        ], 
        featured: false 
    },
    { 
        name: 'Gold (3 Years)', 
        price: '3,500', 
        duration: '/year', 
        features: [
            'All Bronze Features',
            'Highest Cashback: ৳15,000 (3 Years)',
            'Increased Stay: 30 Nights',
            'Life Coverage: AD ৳100,000 & ND ৳50,000',
            'Exclusive Gifts & Tours'
        ], 
        featured: true 
    },
];

export const coreServices: CoreService[] = [
    { title: "Health Coverage", description: "Access top-tier medical facilities without financial strain.", icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
    { title: "Exclusive Discounts", description: "Enjoy special rates at a wide network of partner brands.", icon: "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.5 9.53L9 10.5l-1.5 1.5L12 15.5l4.5-4.5L15 9.5l-3 3.03z" },
    { title: "Family Security", description: "Secure your loved ones with our comprehensive family plans.", icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" },
];
