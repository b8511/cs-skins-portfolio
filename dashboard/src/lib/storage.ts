import { PortfolioItem } from "@/types";

const PORTFOLIO_KEY = "cs2-portfolio";

/**
 * Load portfolio from localStorage
 */
export function loadPortfolio(): PortfolioItem[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    if (!data) return [];

    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading portfolio:", error);
    return [];
  }
}

/**
 * Save portfolio to localStorage
 */
export function savePortfolio(portfolio: PortfolioItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  } catch (error) {
    console.error("Error saving portfolio:", error);
  }
}

/**
 * Add or update item in portfolio
 */
export function updatePortfolioItem(
  portfolio: PortfolioItem[],
  name: string,
  quantity: number,
  price: number,
  priceString: string
): PortfolioItem[] {
  const existingIndex = portfolio.findIndex((item) => item.name === name);

  if (existingIndex >= 0) {
    // Update existing item
    const updated = [...portfolio];
    updated[existingIndex] = { name, quantity, price, priceString };
    return updated;
  } else {
    // Add new item
    return [...portfolio, { name, quantity, price, priceString }];
  }
}

/**
 * Remove item from portfolio
 */
export function removePortfolioItem(
  portfolio: PortfolioItem[],
  name: string
): PortfolioItem[] {
  return portfolio.filter((item) => item.name !== name);
}

/**
 * Calculate total portfolio value
 */
export function calculateTotalValue(portfolio: PortfolioItem[]): number {
  return portfolio.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}
