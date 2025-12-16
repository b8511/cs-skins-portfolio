export interface CaseItem {
  name: string;
  image?: string;
  lowest_price?: string;
  median_price?: string;
  volume?: string;
}

export interface PortfolioItem {
  name: string;
  quantity: number;
  price: number; // Store price in cents/numeric format
  priceString: string; // Display format like "$1.50"
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
