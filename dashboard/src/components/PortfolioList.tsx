"use client";

import { PortfolioItem } from "@/types";
import { formatPrice, getDisplayName } from "@/lib/steamApi";

interface PortfolioListProps {
  portfolio: PortfolioItem[];
  onUpdateQuantity: (name: string, quantity: number) => void;
  onRemove: (name: string) => void;
}

export default function PortfolioList({
  portfolio,
  onUpdateQuantity,
  onRemove,
}: PortfolioListProps) {
  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-lg">Your portfolio is empty</p>
        <p className="text-sm mt-2">Add items from the cases list above</p>
      </div>
    );
  }

  const totalValue = portfolio.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const afterTaxValue = totalValue * 0.85; // 15% Steam tax deduction

  return (
    <div className="space-y-4">
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-xl">
        <h2 className="text-sm uppercase tracking-wide mb-2 opacity-90">
          Total Portfolio Value
        </h2>
        <div className="text-4xl font-bold">{formatPrice(totalValue)}</div>
        <div className="text-sm mt-3 opacity-90 border-t border-white/20 pt-3">
          <div className="flex justify-between items-center">
            <span>After 15% Steam Tax:</span>
            <span className="text-2xl font-bold">
              {formatPrice(afterTaxValue)}
            </span>
          </div>
        </div>
        <div className="text-sm mt-2 opacity-90">
          {portfolio.length} unique item{portfolio.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-2">
        {portfolio.map((item) => (
          <div
            key={item.name}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm mb-1">
                  {getDisplayName(item.name)}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">
                    Price:{" "}
                    <span className="text-green-400">{item.priceString}</span>
                  </span>
                  <span className="text-gray-400">
                    Qty:{" "}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(
                          item.name,
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="w-16 px-2 py-0.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 ml-1"
                    />
                  </span>
                  <span className="text-gray-400">
                    Total:{" "}
                    <span className="text-blue-400 font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemove(item.name)}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
