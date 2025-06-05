import type { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '@/data/products';

// This is temporary mock data - we'll replace this with your actual database connection
const mockCategories: Category[] = [
  {
    id: "mens",
    name: "Men's",
    description: "Men's t-shirts and shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    subcategories: ["Classic Tee", "Long Sleeve Shirts"]
  },
  {
    id: "womens",
    name: "Women's",
    description: "Women's t-shirts and jackets",
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=500",
    subcategories: ["Crew Neck Tee", "V-Neck Tee", "Jacket"]
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category[]>
) {
  if (req.method === 'GET') {
    res.status(200).json(mockCategories);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 