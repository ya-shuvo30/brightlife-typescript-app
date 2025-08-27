// Business domain types for Bright Life Bangladesh

// Enhanced Plan interface with strict typing
export interface Plan {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly currency?: string;
  readonly period?: string;
  readonly description?: string;
  readonly duration: string;
  readonly features: readonly string[];
  readonly featured: boolean;
  readonly category: PlanCategory;
  readonly maxMembers?: number;
  readonly benefits: PlanBenefits;
  readonly popular?: boolean;
  readonly available?: boolean;
}

export type PlanCategory = 'silver' | 'bronze' | 'gold' | 'platinum';

export interface PlanBenefits {
  readonly teleConsultation: boolean;
  readonly hospitalDiscount: number; // percentage
  readonly medicineDiscount: number; // percentage
  readonly shopDiscount: number; // percentage
  readonly cashback: number; // amount
  readonly lifeCoverage: LifeCoverage;
}

export interface LifeCoverage {
  readonly accidental: number;
  readonly natural: number;
}

// Enhanced CoreService interface
export interface CoreService {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly category: ServiceCategory;
  readonly isActive: boolean;
  readonly priority: number; // for ordering
}

export type ServiceCategory = 'health' | 'lifestyle' | 'financial' | 'emergency';

// Enhanced Hospital interface with better typing
export interface Hospital {
  readonly id: number;
  readonly area: string;
  readonly name: string;
  readonly address: string;
  readonly facility: string;
  readonly specialService: string;
  readonly contactPerson: string;
  readonly contactNumber: string;
  readonly coordinates?: Coordinates;
  readonly rating?: number;
  readonly isActive: boolean;
  readonly services: HospitalService[];
}

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface HospitalService {
  readonly id: string;
  readonly name: string;
  readonly discount: number;
  readonly description: string;
}

// Enhanced Member interface
export interface Member {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly rating: number;
  readonly testimonial: string;
  readonly img: string;
  readonly joinDate: string; // ISO date string
  readonly verified: boolean;
  readonly membershipType: PlanCategory;
}

// Enhanced TeamMember interface
export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly img: string;
  readonly bio?: string;
  readonly socialLinks?: SocialLinks;
  readonly department: Department;
}

export type Department = 'executive' | 'technical' | 'marketing' | 'operations' | 'support';

export interface SocialLinks {
  readonly linkedin?: string;
  readonly twitter?: string;
  readonly email?: string;
}

// Enhanced Partner interface
export interface Partner {
  readonly id: string;
  readonly name: string;
  readonly logo: string;
  readonly category: PartnerCategory;
  readonly description?: string;
  readonly website?: string;
  readonly isActive: boolean;
}

export type PartnerCategory = 'hospital' | 'pharmacy' | 'retail' | 'transport' | 'insurance';

// Statistics interface for better type safety
export interface Statistic {
  readonly value: string;
  readonly label: string;
  readonly trend?: 'up' | 'down' | 'stable';
  readonly description?: string;
}
