export interface CaseItem {
  name: string;
  image?: string;
  lowest_price?: string;
  median_price?: string;
  volume?: string;
  type?: "case" | "capsule";
}

export interface PortfolioItem {
  name: string;
  quantity: number;
  price: number;
  priceString: string;
}

export interface PortfolioData {
  items: Record<string, { quantity: number }>;
  prices: Record<string, number>;
  meta: {
    lastPriceUpdate: number | null;
  };
}

export interface PriceInfo {
  name: string;
  lowest_price: string;
  median_price: string;
  volume: string;
}

export interface SteamPriceResponse {
  success: boolean;
  lowest_price?: string;
  median_price?: string;
  volume?: string;
}
