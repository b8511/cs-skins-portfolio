import { PortfolioData } from "@/types";

const PORTFOLIO_KEY = "cs2-portfolio";

/**
 * Get default empty portfolio structure
 */
function getDefaultPortfolio(): PortfolioData {
  return {
    items: {},
    prices: {},
    meta: {
      lastPriceUpdate: null,
    },
  };
}

/**
 * Load portfolio data from localStorage
 */
export function loadPortfolioData(): PortfolioData {
  if (typeof window === "undefined") return getDefaultPortfolio();

  try {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    if (!data) return getDefaultPortfolio();

    const parsed = JSON.parse(data);
    // Ensure structure is correct
    return {
      items: parsed.items || {},
      prices: parsed.prices || {},
      meta: parsed.meta || { lastPriceUpdate: null },
    };
  } catch (error) {
    console.error("Error loading portfolio:", error);
    return getDefaultPortfolio();
  }
}

/**
 * Save portfolio data to localStorage
 */
export function savePortfolioData(data: PortfolioData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving portfolio:", error);
  }
}

/**
 * Add or update item quantity in portfolio
 */
export function updateItemQuantity(
  data: PortfolioData,
  name: string,
  quantity: number
): PortfolioData {
  return {
    ...data,
    items: {
      ...data.items,
      [name]: { quantity },
    },
  };
}

/**
 * Remove item from portfolio
 */
export function removeItem(data: PortfolioData, name: string): PortfolioData {
  const newItems = { ...data.items };
  delete newItems[name];

  return {
    ...data,
    items: newItems,
  };
}

/**
 * Update prices for multiple items
 */
export function updatePrices(
  data: PortfolioData,
  prices: Record<string, number>
): PortfolioData {
  return {
    ...data,
    prices: {
      ...data.prices,
      ...prices,
    },
    meta: {
      ...data.meta,
      lastPriceUpdate: Date.now(),
    },
  };
}

/**
 * Calculate total portfolio value
 */
export function calculateTotalValue(data: PortfolioData): number {
  let total = 0;
  for (const [itemName, { quantity }] of Object.entries(data.items)) {
    const price = data.prices[itemName] || 0;
    total += price * quantity;
  }
  return total;
}
