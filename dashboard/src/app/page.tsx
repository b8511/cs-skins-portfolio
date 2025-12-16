"use client";

import { useState, useEffect, useCallback } from "react";
import CaseCard from "@/components/CaseCard";
import PortfolioList from "@/components/PortfolioList";
import { CaseItem, PortfolioItem } from "@/types";
import { CSGO_CASES, parsePriceToNumber } from "@/lib/steamApi";
import {
  loadPortfolio,
  savePortfolio,
  updatePortfolioItem,
  removePortfolioItem,
} from "@/lib/storage";

export default function Home() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const saved = loadPortfolio();
    setPortfolio(saved);
  }, []);

  // Fetch prices for all cases
  useEffect(() => {
    async function fetchPrices() {
      setLoading(true);
      const caseData: CaseItem[] = [];

      for (const caseName of CSGO_CASES) {
        try {
          const response = await fetch(
            `/api/prices?item=${encodeURIComponent(caseName)}`
          );
          const data = await response.json();

          if (data.success) {
            caseData.push({
              name: caseName,
              lowest_price: data.lowest_price,
              median_price: data.median_price,
              volume: data.volume,
            });
          } else {
            caseData.push({ name: caseName });
          }

          // Add delay to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Error fetching ${caseName}:`, error);
          caseData.push({ name: caseName });
        }
      }

      setCases(caseData);
      setLoading(false);
    }

    fetchPrices();
  }, []);

  // Update prices for portfolio items
  useEffect(() => {
    if (portfolio.length === 0 || cases.length === 0) return;

    const updatedPortfolio = portfolio.map((item) => {
      const caseItem = cases.find((c) => c.name === item.name);
      if (caseItem && caseItem.median_price) {
        const newPrice = parsePriceToNumber(caseItem.median_price);
        return {
          ...item,
          price: newPrice,
          priceString: caseItem.median_price,
        };
      }
      return item;
    });

    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
  }, [cases]);

  const handleAddToPortfolio = useCallback(
    (name: string, quantity: number) => {
      const caseItem = cases.find((c) => c.name === name);
      if (!caseItem || !caseItem.median_price) return;

      const price = parsePriceToNumber(caseItem.median_price);
      const updated = updatePortfolioItem(
        portfolio,
        name,
        quantity,
        price,
        caseItem.median_price
      );

      setPortfolio(updated);
      savePortfolio(updated);
    },
    [cases, portfolio]
  );

  const handleUpdateQuantity = useCallback(
    (name: string, quantity: number) => {
      const item = portfolio.find((p) => p.name === name);
      if (!item) return;

      const updated = updatePortfolioItem(
        portfolio,
        name,
        quantity,
        item.price,
        item.priceString
      );

      setPortfolio(updated);
      savePortfolio(updated);
    },
    [portfolio]
  );

  const handleRemove = useCallback(
    (name: string) => {
      const updated = removePortfolioItem(portfolio, name);
      setPortfolio(updated);
      savePortfolio(updated);
    },
    [portfolio]
  );

  const filteredCases = cases.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

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
            portfolio={portfolio}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />
        </section>

        {/* Cases Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Available Cases</h2>
            <input
              type="text"
              placeholder="Search cases..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-400">Loading prices from Steam...</p>
              <p className="text-sm text-gray-500 mt-2">
                This may take a minute
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.name}
                  caseItem={caseItem}
                  onAddToPortfolio={handleAddToPortfolio}
                  isInPortfolio={portfolio.some(
                    (p) => p.name === caseItem.name
                  )}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
