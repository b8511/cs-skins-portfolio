"use client";

import { useState, useCallback } from "react";
import CaseCard from "@/components/CaseCard";
import PortfolioList from "@/components/PortfolioList";
import { CaseItem, PortfolioData, PortfolioItem } from "@/types";
import {
  CSGO_CASES,
  CSGO_CAPSULES,
  parsePriceToNumber,
  formatPrice,
} from "@/lib/steamApi";
import {
  loadPortfolioData,
  savePortfolioData,
  updateItemQuantity,
  removeItem,
  updatePrices,
} from "@/lib/storage";

export default function Home() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() =>
    loadPortfolioData()
  );
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState<
    "all" | "case" | "capsule"
  >("all");
  const [progress, setProgress] = useState(0);

  // Fetch prices for all cases and capsules
  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setProgress(0);
    const caseData: CaseItem[] = [];
    const newPrices: Record<string, number> = {};
    const allItems = [...CSGO_CASES, ...CSGO_CAPSULES];
    const totalItems = allItems.length;

    for (let i = 0; i < allItems.length; i++) {
      const itemName = allItems[i];
      const itemType = i < CSGO_CASES.length ? "case" : "capsule";

      try {
        const response = await fetch(
          `/api/prices?item=${encodeURIComponent(itemName)}`
        );
        const data = await response.json();

        if (data.success) {
          caseData.push({
            name: itemName,
            lowest_price: data.lowest_price,
            median_price: data.median_price,
            volume: data.volume,
            type: itemType,
          });

          // Store price
          if (data.median_price) {
            newPrices[itemName] = parsePriceToNumber(data.median_price);
          }
        } else {
          caseData.push({ name: itemName, type: itemType });
        }

        // Update progress
        setProgress(Math.round(((i + 1) / totalItems) * 100));

        // Add delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error fetching ${itemName}:`, error);
        caseData.push({ name: itemName, type: itemType });
      }
    }

    setCases(caseData);

    // Update portfolio with new prices
    setPortfolioData((prev) => {
      const updated = updatePrices(prev, newPrices);
      savePortfolioData(updated);
      return updated;
    });

    setLoading(false);
    setProgress(0);
  }, []);

  const handleAddToPortfolio = useCallback(
    (name: string, quantity: number) => {
      const caseItem = cases.find((c) => c.name === name);
      if (!caseItem || !caseItem.median_price) return;

      const price = parsePriceToNumber(caseItem.median_price);

      setPortfolioData((prev) => {
        // Add item quantity
        let updated = updateItemQuantity(prev, name, quantity);
        // Update price
        updated = updatePrices(updated, { [name]: price });
        savePortfolioData(updated);
        return updated;
      });
    },
    [cases]
  );

  const handleUpdateQuantity = useCallback((name: string, quantity: number) => {
    setPortfolioData((prev) => {
      const updated = updateItemQuantity(prev, name, quantity);
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  const handleRemove = useCallback((name: string) => {
    setPortfolioData((prev) => {
      const updated = removeItem(prev, name);
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  // Convert portfolio data to array format for display
  const portfolioItems: PortfolioItem[] = Object.entries(
    portfolioData.items
  ).map(([name, { quantity }]) => ({
    name,
    quantity,
    price: portfolioData.prices[name] || 0,
    priceString: formatPrice(portfolioData.prices[name] || 0),
  }));

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(filter.toLowerCase());
    const matchesType = itemTypeFilter === "all" || c.type === itemTypeFilter;
    return matchesSearch && matchesType;
  });

  // Format last update time
  const lastUpdateText = portfolioData.meta.lastPriceUpdate
    ? new Date(portfolioData.meta.lastPriceUpdate).toLocaleString()
    : "Never";

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CS2 Portfolio Tracker
          </h1>
          <p className="text-gray-400 text-lg">
            Track your Counter-Strike 2 case investments
          </p>
        </header>

        {/* Portfolio Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Your Portfolio</h2>
          <PortfolioList
            portfolio={portfolioItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />
        </section>

        {/* Cases & Capsules Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold">Available Items</h2>
              <p className="text-sm text-gray-400 mt-1">
                Last updated: {lastUpdateText}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search items..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
              <button
                onClick={fetchPrices}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? "Fetching..." : "Update Prices"}
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setItemTypeFilter("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                itemTypeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              All ({cases.length})
            </button>
            <button
              onClick={() => setItemTypeFilter("case")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                itemTypeFilter === "case"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              📦 Cases ({cases.filter((c) => c.type === "case").length})
            </button>
            <button
              onClick={() => setItemTypeFilter("capsule")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                itemTypeFilter === "capsule"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              🎯 Capsules ({cases.filter((c) => c.type === "capsule").length})
            </button>
          </div>

          {loading && (
            <div className="mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    Loading prices from Steam...
                  </span>
                  <span className="text-sm font-semibold text-blue-400">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {cases.length === 0 && !loading ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-gray-400 text-lg mb-4">
                Click &quot;Update Prices&quot; to load case data
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.name}
                  caseItem={caseItem}
                  onAddToPortfolio={handleAddToPortfolio}
                  isInPortfolio={caseItem.name in portfolioData.items}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
