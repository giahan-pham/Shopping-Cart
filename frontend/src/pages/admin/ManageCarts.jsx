import { useEffect, useMemo, useState } from "react";

import { getAllUsersCarts } from "../../api/adminApi";
import UserCartFilter from "../../components/admin/UserCartFilter";
import UserCartList from "../../components/admin/UserCartList";
import { filterUsers } from "../../utils/filterUser";
import { sortUsers } from "../../utils/sortUser";

import "./styles/ManageCarts.css";

function ManageCarts() {
  const [userCarts, setUserCarts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("username-a-z");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  //Fetch all user carts when page first opens
  useEffect(() => {
    async function loadUserCarts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getAllUsersCarts();
        // Empty arry if the API doesn't return valid list
        setUserCarts(Array.isArray(data) ? data : []);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserCarts();
  }, []);

  //Search and sort user carts
  const visibleUserCarts = useMemo(() => {
    const filtered = filterUsers(userCarts, searchTerm);
    return sortUsers(filtered, sortOption);
  }, [userCarts, searchTerm, sortOption]);

  return (
    <section className="manage-carts-page">
      <header className="manage-carts-header">
        <h1>Manage Carts</h1>
        <p>View user carts with item details and totals.</p>
      </header>

      <UserCartFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {isLoading && <p>Loading user carts...</p>}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!isLoading && !errorMessage && userCarts.length === 0 && (
        <p>No active user carts found.</p>
      )}

      {!isLoading && !errorMessage && userCarts.length > 0 && (
        <section className="user-cart-list-section">
          <h2>Current Carts</h2>

          {visibleUserCarts.length === 0 && <p>No user carts match your filters.</p>}

          {visibleUserCarts.length > 0 && (
            <UserCartList userCarts={visibleUserCarts} />
          )}
        </section>
      )}
    </section>
  );
}

export default ManageCarts;