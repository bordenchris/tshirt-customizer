import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '@/data/products';

// This is temporary mock data - we'll replace this with your actual database connection
const mockProducts: Record<string, Product> = {
  "mens-classic-white": {
    id: "mens-classic-white",
    name: "Men's Classic White Tee",
    category: "mens-classic",
    subcategory: "Short Sleeve",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "Classic fit white t-shirt for men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
      }
    ],
    supplier: {
      code: "MCW001",
      name: "San Mar",
      material: "100% Cotton",
      weight: "6.0 oz",
      fit: "Classic"
    }
  }
  // Add more products here
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | { error: string }>
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const product = mockProducts[id as string];
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 