import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../redux/suppliers/suppliersSlice";
import styles from "./suppliersPage.module.css";

const SuppliersPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.suppliers);
  const [filter, setFilter] = useState("");
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    company: "",
    address: "",
    phone: "",
  });
  const [editSupplier, setEditSupplier] = useState(null);

  useEffect(() => {
    dispatch(fetchSuppliers())
      .unwrap()
      .catch((error) => {
        console.error("Failed to fetch suppliers:", error);
      });
  }, [dispatch]);

  // Filter suppliers
  const filteredSuppliers = items.filter((supplier) =>
    supplier.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Update supplier
  const handleUpdateSupplier = () => {
    if (editSupplier) {
      dispatch(
        updateSupplier({ id: editSupplier._id, supplierData: editSupplier })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchSuppliers());
        });
      setEditSupplier(null); // Reset editing mode
    }
  };

  return (
    <div className={styles.suppliersPage}>
      <h1>Suppliers</h1>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Add Supplier Form */}
      <div className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={newSupplier.name}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Company"
          value={newSupplier.company}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, company: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          value={newSupplier.address}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, address: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone"
          value={newSupplier.phone}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, phone: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Сумма закупки"
          value={newSupplier.amount}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, amount: Number(e.target.value) })
          }
        />

        <button onClick={() => dispatch(addSupplier(newSupplier))}>
          Add Supplier
        </button>
      </div>

      {/* Edit Supplier Form */}
      {editSupplier && (
        <div className={styles.form}>
          <h3>Edit Supplier</h3>
          <input
            type="text"
            value={editSupplier.name}
            onChange={(e) =>
              setEditSupplier({ ...editSupplier, name: e.target.value })
            }
          />
          <input
            type="text"
            value={editSupplier.company}
            onChange={(e) =>
              setEditSupplier({ ...editSupplier, company: e.target.value })
            }
          />
          <input
            type="text"
            value={editSupplier.address}
            onChange={(e) =>
              setEditSupplier({ ...editSupplier, address: e.target.value })
            }
          />
          <input
            type="text"
            value={editSupplier.phone}
            onChange={(e) =>
              setEditSupplier({ ...editSupplier, phone: e.target.value })
            }
          />
          <button onClick={handleUpdateSupplier}>Update Supplier</button>
          <button onClick={() => setEditSupplier(null)}>Cancel</button>
        </div>
      )}

      {/* Suppliers Table */}
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <ul>
        {filteredSuppliers.map((supplier) => (
          <li key={supplier._id}>
            {supplier.name} - {supplier.company} - {supplier.address} -{" "}
            {supplier.phone}
            <button onClick={() => setEditSupplier(supplier)}>Edit</button>
            <button onClick={() => dispatch(deleteSupplier(supplier._id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuppliersPage;
