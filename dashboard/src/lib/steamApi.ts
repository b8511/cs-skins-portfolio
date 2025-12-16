import { SteamPriceResponse } from "@/types";

export const CSGO_CASES = [
  "Dreams & Nightmares Case",
  "Clutch Case",
  "Prisma Case",
  "CS20 Case",
  "CS:GO Weapon Case",
  "Chroma 3 Case",
  "Copenhagen 2024 Nuke Souvenir Package",
  "Copenhagen 2024 Overpass Souvenir Package",
  "Danger Zone Case",
  "Fracture Case",
  "Gamma 2 Case",
  "Horizon Case",
  "Kilowatt Case",
  "Operation Breakout Weapon Case",
  "Operation Broken Fang Case",
  "Operation Hydra Case",
  "Operation Phoenix Weapon Case",
  "Operation Riptide Case",
  "Operation Vanguard Weapon Case",
  "Operation Wildfire Case",
  "Paris 2023 Anubis Souvenir Package",
  "Paris 2023 Mirage Souvenir Package",
  "Paris 2023 Vertigo Souvenir Package",
  "Prisma 2 Case",
  "Recoil Case",
  "Revolution Case",
  "Revolver Case",
  "Rio 2022 Ancient Souvenir Package",
  "Rio 2022 Dust II Souvenir Package",
  "Rio 2022 Mirage Souvenir Package",
  "Rio 2022 Overpass Souvenir Package",
  "Shattered Web Case",
  "Snakebite Case",
  "Spectrum 2 Case",
  "Fever Case",
  "Gallery Case",
];

/**
 * Get Steam Community Market image URL for an item
 */
export function getSteamImageUrl(itemName: string): string {
  // Encode the item name for URL
  const encoded = encodeURIComponent(itemName);

  // Steam CDN image format
  // Note: This is a simplified approach. Real image URLs come from the market listings page
  return `https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2GoFsZIk0r3D9Nr0mlG1-Us6azqgJo-VJA5sZVCB8wK3xuq515Xtv52YwSBnsyQi4X7D30vgn--Hggk/360fx360f`;
}

/**
 * Fetch price from Steam Market API
 */
export async function fetchSteamPrice(
  itemName: string
): Promise<SteamPriceResponse> {
  try {
    const encoded = encodeURIComponent(itemName);
    const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encoded}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching price for ${itemName}:`, error);
    return { success: false };
  }
}

/**
 * Parse price string to numeric cents (e.g., "$1.50" -> 150)
 */
export function parsePriceToNumber(priceString: string): number {
  if (!priceString || priceString === "N/A") return 0;

  // Remove currency symbol and convert to number
  const cleaned = priceString.replace(/[^0-9.]/g, "");
  const dollars = parseFloat(cleaned);

  return isNaN(dollars) ? 0 : Math.round(dollars * 100); // Convert to cents
}

/**
 * Format cents to price string (e.g., 150 -> "$1.50")
 */
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}
