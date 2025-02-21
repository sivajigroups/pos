import React from "react";
import { ProductGrid } from "../components/ProductGrid";
import { Cart } from "../components/Cart";
import { CategoryFilter } from "../components/CategoryFilter";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";

export function POSView() {
  const { products, categories, loading, error } = useProducts();
  const { cartItems, addToCart, updateQuantity, removeItem, checkout } =
    useCart(products);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  if (error) {
    return (
      <div className="max-h-screen flex items-center justify-center bg-red-50">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col flex-1 lg:flex-row gap-8">
      <div className="flex flex-col flex-grow lg:w-2/3 h-full">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ProductGrid
          products={products}
          onAddToCart={addToCart}
          selectedCategory={selectedCategory}
        />
      </div>
      <div className="flex flex-col lg:w-1/3 h-full">
        <Cart
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={checkout}
        />
      </div>
    </div>
  );
}
