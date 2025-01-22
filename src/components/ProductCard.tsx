import React from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "../types";
import { formatCurrency } from "../utils/currency";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { t } = useTranslation();

  if (!product || !product.sellingPrice) {
    return null;
  }

  return (
    <button
      onClick={() => onAddToCart(product)}
      className={`bg-white w-72 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg p-4 text-left ${
        product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={product.stock <= 0}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        </div>
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
          {formatCurrency(product.sellingPrice)}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span
          className={`text-sm ${
            product.stock <= 5 ? "text-red-600" : "text-gray-600"
          }`}
        >
          {t("inventory.stock")}: {product.stock}
        </span>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
          <Plus size={20} />
        </span>
      </div>
    </button>
  );
}
