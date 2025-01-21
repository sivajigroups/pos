import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Category } from "../../types";
import { masterDataService } from "../../services/masterDataService";
import { SearchBar } from "../SearchBar";
import { Modal } from "../Modal";

export function CategoryView() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await masterDataService.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(t("master.messages.error.load"));
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await masterDataService.updateCategory({
          ...editingCategory,
          name: formData.name,
        });
        alert(t("master.messages.updateSuccess"));
      } else {
        await masterDataService.addCategory(formData.name);
        alert(t("master.messages.addSuccess"));
      }
      await loadCategories();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save category:", err);
      alert(
        editingCategory
          ? t("master.messages.error.update")
          : t("master.messages.error.add")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("master.messages.confirmDelete"))) return;

    try {
      await masterDataService.deleteCategory(id);
      alert(t("master.messages.deleteSuccess"));
      await loadCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert(t("master.messages.error.delete"));
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "" });
  };

  const filteredCategories = categories.filter((category) =>
    searchQuery
      ? category.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h2 className="text-2xl font-bold">
          {t("master.form.category.title")}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          {t("master.form.category.addNew")}
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
            {filteredCategories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="py-4">{category.name}</td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800 px-2"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? t("inventory.noProductsFound")
                    : t("inventory.noProductsFound")}
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
          editingCategory
            ? t("master.form.category.editCategory")
            : t("master.form.category.addNew")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("master.form.category.name.label")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder={t("master.form.category.name.placeholder")}
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
