export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  colors: {
    name: string;
    code: string;
    image: string;
  }[];
  supplier: {
    code: string;
    name: string;
    material: string;
    weight: string;
    fit: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
}

// This will be populated with the actual supplier data
export const categories: Category[] = [
  {
    id: "mens-classic",
    name: "Men's Classic Tee",
    description: "Classic fit t-shirts for men",
    image: "",
    subcategories: ["Short Sleeve", "Long Sleeve"]
  },
  {
    id: "womens-classic",
    name: "Women's Classic Tee",
    description: "Classic fit t-shirts for women",
    image: "",
    subcategories: ["Short Sleeve", "Long Sleeve", "Tank Top"]
  },
  {
    id: "womens-vneck",
    name: "Women's V-Neck Tee",
    description: "V-neck t-shirts for women",
    image: "",
    subcategories: ["Short Sleeve", "Long Sleeve"]
  },
  {
    id: "womens-jacket",
    name: "Women's Jacket",
    description: "Stylish jackets for women",
    image: "",
    subcategories: ["Denim", "Bomber"]
  }
];

// This will be populated with the actual supplier data
export const products: Product[] = [
  {
    id: "mens-classic-white",
    name: "Men's Classic Tee",
    category: "mens-classic",
    subcategory: "Short Sleeve",
    price: 24.99,
    image: "/images/white-tshirt-mockup.png",
    description: "Classic fit white t-shirt for men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        image: "/images/white-tshirt-mockup.png"
      },
      {
        name: "Black",
        code: "#000000",
        image: "/images/black-tshirt-mockup.png"
      }
    ],
    supplier: {
      code: "MCW",
      name: "Classic Tees",
      material: "100% Cotton",
      weight: "180 gsm",
      fit: "Regular"
    }
  },
  {
    id: "mens-longsleeve-white",
    name: "Men's Long Sleeve Tee",
    category: "mens-classic",
    subcategory: "Long Sleeve",
    price: 29.99,
    image: "/images/white-longsleeve-mockup.png",
    description: "Classic fit long sleeve white t-shirt for men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        image: "/images/white-longsleeve-mockup.png"
      },
      {
        name: "Black",
        code: "#000000",
        image: "/images/black-longsleeve-mockup.png"
      }
    ],
    supplier: {
      code: "MLW",
      name: "Classic Tees",
      material: "100% Cotton",
      weight: "180 gsm",
      fit: "Regular"
    }
  },
  {
    id: "womens-vneck-white",
    name: "Women's V-Neck Tee",
    category: "womens-vneck",
    subcategory: "Short Sleeve",
    price: 24.99,
    image: "/images/womens-vneck-white.png",
    description: "Classic fit v-neck white t-shirt for women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        image: "/images/womens-vneck-white.png"
      },
      {
        name: "Black",
        code: "#000000",
        image: "/images/womens-vneck-black.png"
      }
    ],
    supplier: {
      code: "WVW",
      name: "Classic Tees",
      material: "100% Cotton",
      weight: "160 gsm",
      fit: "Slim"
    }
  },
  {
    id: "womens-longsleeve-white",
    name: "Women's Long Sleeve Tee",
    category: "womens-classic",
    subcategory: "Long Sleeve",
    price: 29.99,
    image: "/images/womens-longsleeve-white.png",
    description: "Classic fit long sleeve white t-shirt for women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        image: "/images/womens-longsleeve-white.png"
      },
      {
        name: "Black",
        code: "#000000",
        image: "/images/womens-longsleeve-black.png"
      }
    ],
    supplier: {
      code: "WLW",
      name: "Classic Tees",
      material: "100% Cotton",
      weight: "160 gsm",
      fit: "Slim"
    }
  }
]; 