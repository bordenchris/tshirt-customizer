import { Product, Category } from '../data/products';

const API_BASE_URL = '/api';  // Changed to use relative path for Next.js API routes

export async function fetchInventory(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
} 