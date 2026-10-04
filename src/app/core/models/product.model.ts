export interface ProductSize {
  label: string;
  paypalUrl: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  /** Prix en euros. */
  price: number;
  description?: string;
  /** La première image est la photo principale. */
  images: string[];
  colors?: string[];
  sizes?: ProductSize[];
  /** Lien PayPal unique, utilisé seulement si l'article n'a pas de tailles. */
  paypalUrl?: string;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
