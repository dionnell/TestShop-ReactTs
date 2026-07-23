import type { User } from "./user.interface";

/** Rich image object returned by the detail endpoint and used in the admin */
export interface ProductImage {
  id: number;
  url: string;
  publicId?: string;
  order: number;
}

/** Full product — used in the admin (images are rich objects) */
export interface Product {
    id:          string;
    title:       string;
    price:       number;
    description: string;
    slug:        string;
    stock:       number;
    sizes:       Size[];
    gender:      Gender;
    tags:        string[];
    images:      ProductImage[];
    user:        User;
}

/** Lightweight product — used in shop listings (images are already resolved URLs) */
export interface ShopProduct extends Omit<Product, 'images'> {
    images: string[];
}

export type Size = "L" | "M" | "S" | "XL" | "XS" | "XXL"
export type Gender = "kid" | "men" | "women" | "unisex"
