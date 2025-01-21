import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Supplier } from "../../types";
import { masterDataService } from "../../services/masterDataService";
import { SearchBar } from "../SearchBar";
import { Modal } from "../Modal";

export function SupplierView() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setLoading(true);
      const data = await masterDataService.getSuppliers();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      setError(t("master.messages.error.loadSuppliers"));
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingSupplier) {
        await masterDataService.updateSupplier({
          ...editingSupplier,
          ...formData,
        });
        alert(t("master.messages.updateSupplierSuccess"));
      } else {
        await masterDataService.addSupplier(formData);
        alert(t("master.messages.addSupplierSuccess"));
      }
      await loadSuppliers();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save supplier:", err);
      alert(
        editingSupplier
          ? t("master.messages.error.updateSupplier")
          : t("master.messages.error.addSupplier")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("master.messages.confirmDeleteSupplier"))) return;

    try {
      await masterDataService.deleteSupplier(id);
      alert(t("master.messages.deleteSupplierSuccess"));
      await loadSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier:", err);
      alert(t("master.messages.error.deleteSupplier"));
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contact_person || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
    });
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    searchQuery
      ? supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.contact_person
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.phone?.toLowerCase().includes(searchQuery.toLowerCase())
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
          {t("master.form.supplier.title")}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          {t("master.form.supplier.addNew")}
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
              <th className="text-left py-4">{t("master.contactPerson")}</th>
              <th className="text-left py-4">{t("master.email")}</th>
              <th className="text-left py-4">{t("master.phone")}</th>
              <th className="text-right py-4">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="py-4">{supplier.name}</td>
                <td className="py-4">{supplier.contact_person}</td>
                <td className="py-4">{supplier.email}</td>
                <td className="py-4">{supplier.phone}</td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="text-blue-600 hover:text-blue-800 px-2"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? t("master.messages.noResults")
                    : t("master.messages.noSuppliers")}
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
          editingSupplier
            ? t("master.form.supplier.editSupplier")
            : t("master.form.supplier.addNew")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("master.form.supplier.name.label")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("master.form.supplier.name.placeholder")}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("master.form.supplier.contactPerson.label")}
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
              }
              placeholder={t("master.form.supplier.contactPerson.placeholder")}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("master.form.supplier.email.label")}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={t("master.form.supplier.email.placeholder")}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("master.form.supplier.phone.label")}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder={t("master.form.supplier.phone.placeholder")}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
