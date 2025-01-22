import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Brand } from "../../types";
import { masterDataService } from "../../services/masterDataService";
import { SearchBar } from "../SearchBar";
import { Modal } from "../Modal";

export function BrandView() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    try {
      setLoading(true);
      const data = await masterDataService.getBrands();
      setBrands(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load brands:", err);
      setError(t("master.messages.error.loadBrands"));
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingBrand) {
        await masterDataService.updateBrand({
          ...editingBrand,
          name: formData.name,
        });
        alert(t("master.messages.updateBrandSuccess"));
      } else {
        await masterDataService.addBrand(formData.name);
        alert(t("master.messages.addBrandSuccess"));
      }
      await loadBrands();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save brand:", err);
      alert(
        editingBrand
          ? t("master.messages.error.updateBrand")
          : t("master.messages.error.addBrand")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("master.messages.confirmDeleteBrand"))) return;

    try {
      await masterDataService.deleteBrand(id);
      alert(t("master.messages.deleteBrandSuccess"));
      await loadBrands();
    } catch (err) {
      console.error("Failed to delete brand:", err);
      alert(t("master.messages.error.deleteBrand"));
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({ name: "" });
  };

  const filteredBrands = brands.filter((brand) =>
    searchQuery
      ? brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("master.form.brand.title")}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          {t("master.form.brand.addNew")}
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("common.search")}
        />
      </div>

      <div className="flex overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4">{t("common.name")}</th>
              <th className="text-right py-4">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr key={brand.id} className="border-b">
                <td className="py-4">{brand.name}</td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="text-blue-600 hover:text-blue-800 px-2"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))}
            {filteredBrands.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? t("master.messages.noResults")
                    : t("master.messages.noBrands")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          editingBrand
            ? t("master.form.brand.editBrand")
            : t("master.form.brand.addNew")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("master.form.brand.name.label")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder={t("master.form.brand.name.placeholder")}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("modal.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
