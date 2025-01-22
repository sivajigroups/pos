import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Product, Brand, Category, Supplier } from "../../types";
import { masterDataService } from "../../services/masterDataService";
import { ProductModal } from "./ProductModal";
import { ProductRow } from "./ProductRow";
import { SearchBar } from "../SearchBar";

interface InventoryViewProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export function InventoryView({
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
}: InventoryViewProps) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMasterData();
  }, []);

  async function loadMasterData() {
    try {
      const [brandsData, categoriesData, suppliersData] = await Promise.all([
        masterDataService.getBrands(),
        masterDataService.getCategories(),
        masterDataService.getSuppliers(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Failed to load master data:", error);
    }
  }

  const handleSave = async (
    formData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    await onAddProduct(formData);
  };

  const filteredProducts = products.filter((product) =>
    searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.modelNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        brands
          .find((b) => b.id === product.brandId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        suppliers
          .find((s) => s.id === product.supplierId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        categories
          .find((c) => c.id === product.categoryId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("inventory.title")}</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          {t("inventory.addProduct")}
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("inventory.searchProducts")}
        />
      </div>

      <div className="flex overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4">{t("inventory.productName")}</th>
              <th className="text-left py-4">
                {t("inventory.productDescription")}
              </th>
              <th className="text-left py-4">{t("inventory.brand")}</th>
              <th className="text-left py-4">{t("inventory.modelNumber")}</th>
              <th className="text-left py-4">{t("inventory.supplier")}</th>
              <th className="text-left py-4">{t("inventory.category")}</th>
              <th className="text-left py-4">{t("inventory.buyingPrice")}</th>
              <th className="text-left py-4">{t("inventory.sellingPrice")}</th>
              <th className="text-left py-4">{t("inventory.stock")}</th>
              <th className="text-left py-4">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                brands={brands}
                suppliers={suppliers}
                categories={categories}
                onEdit={() => setEditingId(product.id)}
                onDelete={onDeleteProduct}
              />
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  {t("inventory.noProductsFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSave}
        brands={brands}
        categories={categories}
        suppliers={suppliers}
      />
    </div>
  );
}
