export interface NutritionFact {
  name: string;
  amount: string;
  dailyValuePercentage: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountRate: number;
  rating: number;
  reviewCount: number;
  dosage: string;
  volume: string;
  certifications: string[];
  tags: string[];
  badge?: string;
  description: string;
  features: string[];
  nutritionFacts: NutritionFact[];
  isBest?: boolean;
  isNew?: boolean;
  stock: number;
  imageUrl?: string;
}

export type CategorySlug =
  | "all"
  | "energy-vitamin"
  | "circulation-eye"
  | "liver-fatigue"
  | "gut-probiotics"
  | "joint-bone"
  | "immunity";

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  iconName: string;
  description: string;
}
