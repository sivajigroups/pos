import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Transaction } from "../types";
import { transactionService } from "../services/transactionService";
import { SearchBar } from "./SearchBar";
import { formatCurrency } from "../utils/currency";
import { InvoicePrint } from "./Invoice/InvoicePrint";
import { PrintButton } from "./Invoice/PrintButton";
import { StatusBadge } from "./StatusBadge";

export function OrdersView() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
    } finally {
      setLoading(false);
    }
  }

  const handlePrint = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTimeout(() => {
      const printContent = document.getElementById("invoice-print");
      const originalContents = document.body.innerHTML;

      if (printContent) {
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
      }
    }, 100);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    searchQuery
      ? transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center">
        <h2 className="text-2xl font-bold mb-2">{t("common.error")}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("orders.title")}</h2>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("orders.search")}
        />
      </div>

      <div className=" flex flex-col overflow-y-auto space-y-6">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {t("orders.orderId")}: {transaction.id}
                </h3>
                <p className="text-sm text-gray-600">
                  {transaction.timestamp.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <PrintButton onClick={() => handlePrint(transaction)} />
                <StatusBadge status={transaction.status} />
              </div>
            </div>

            {/* Rest of the component remains the same */}
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? t("orders.noResults") : t("orders.noOrders")}
          </div>
        )}
      </div>

      {selectedTransaction && (
        <div id="invoice-print" className="hidden">
          <InvoicePrint transaction={selectedTransaction} />
        </div>
      )}
    </div>
  );
}
