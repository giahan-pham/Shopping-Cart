import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRecords } from "../api/recordsApi";
import { isLoggedIn } from "../api/authApi";
import { filterRecords } from "../utils/filterRecords";
import { sortRecords } from "../utils/sortRecords";

import RecordCard from "../components/records/RecordCard";
import RecordFilters from "../components/records/RecordFilters";
import RecordDetails from "../modals/RecordDetails";
import LoginWarning from "../modals/LoginWarning";

import { addItemToCart, getCart } from "../api/cartApi";

import "./RecordShoppingPage.css";

function RecordShoppingPage({ setCart, openCartPanel, showToast }) {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title-a-z");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoginWarningOpen, setIsLoginWarningOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  //Fetch records
  useEffect(() => {
    async function loadRecords() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getRecords();
        setRecords(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecords();
  }, []);

  //Search and sort records
  const visibleRecords = useMemo(() => {
    const filtered = filterRecords(records, searchTerm);
    return sortRecords(filtered, sortOption);
  }, [records, searchTerm, sortOption]);

  //Handle add record to cart with quantity, check stock and login status
  async function handleAddToCart(record, quantity = 1) {
    if (Number(record.stock) <= 0) {
      const message = `${record.title} is out of stock.`;
      showToast?.(message, "error");
      return;
    }
    //Guest cannot add to cart, show login warning modal
    if (!isLoggedIn()) {
      setIsLoginWarningOpen(true);
      return;
    }
    //Ensure quantity is a positive integer, default to 1 if invalid
    const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

    try {
      await addItemToCart(record.id, safeQuantity);

      const updatedCart = await getCart();
      setCart(updatedCart);
      openCartPanel();
      showToast?.(`${record.title} added to cart`, "success");

      setSelectedRecord(null);
    } catch (error) {
      // Handle errors when adding to cart
      showToast?.(error.message, "error");
    }
  }

  return (
    <main className="record-page">
      <RecordFilters
        title="Browse Records"
        description="Discover records and add to your cart."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {isLoading && <p>Loading records...</p>}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!isLoading && !errorMessage && records.length === 0 && (
        <p>No records available yet.</p>
      )}

      {!isLoading &&
        !errorMessage &&
        records.length > 0 &&
        visibleRecords.length === 0 && (
          <p>No matched records found.</p>
        )}

      {!isLoading && !errorMessage && visibleRecords.length > 0 && (
        <section className="record-grid">
          {visibleRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onViewDetails={setSelectedRecord}
              onAddToCart={handleAddToCart}
            />
          ))}
        </section>
      )}

      <RecordDetails
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onAddToCart={handleAddToCart}
      />

      <LoginWarning
        isOpen={isLoginWarningOpen}
        onLogin={() => {
          setIsLoginWarningOpen(false);
          navigate("/auth");
        }}
        onContinue={() => setIsLoginWarningOpen(false)}
      />
    </main>
  );
}

export default RecordShoppingPage;