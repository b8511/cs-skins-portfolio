"use client";

import { CaseItem } from "@/types";
import { getDisplayName } from "@/lib/steamApi";
import { useState } from "react";

interface CaseCardProps {
  caseItem: CaseItem;
  onAddToPortfolio: (name: string, quantity: number) => void;
  isInPortfolio: boolean;
}

export default function CaseCard({
  caseItem,
  onAddToPortfolio,
  isInPortfolio,
}: CaseCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdd = () => {
    if (quantity > 0) {
      onAddToPortfolio(caseItem.name, quantity);
      setQuantity(1);
    }
  };

  const itemIcon = caseItem.type === "capsule" ? "🎯" : "📦";
  const gradientColor =
    caseItem.type === "capsule"
      ? "from-purple-700 to-purple-900"
      : "from-gray-700 to-gray-900";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-700">
      <div
        className={`relative h-48 bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
      >
        <div className="text-6xl opacity-20">{itemIcon}</div>
        {isInPortfolio && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            In Portfolio
          </div>
        )}
        {caseItem.type === "capsule" && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Capsule
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-white text-sm mb-2 truncate"
          title={caseItem.name}
        >
          {getDisplayName(caseItem.name)}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Lowest:</span>
            <span className="text-green-400 font-semibold">
              {caseItem.lowest_price || "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Median:</span>
            <span className="text-blue-400 font-semibold">
              {caseItem.median_price || "N/A"}
            </span>
          </div>
          {isExpanded && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Volume:</span>
              <span className="text-gray-300">{caseItem.volume || "N/A"}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAdd}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded font-medium text-sm transition-colors"
          >
            Add to Portfolio
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-xs text-gray-400 hover:text-gray-300"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
}
