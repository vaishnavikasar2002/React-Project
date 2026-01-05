import React, { useState, useEffect } from "react";

function App() {
  const initialProducts = [
    { id: 1, name: "Laptop", price: 50000, category: "Electronics", stock: 5, description: "Gaming Laptop" },
    { id: 2, name: "Phone", price: 20000, category: "Electronics", stock: 10, description: "Smartphone" },
    { id: 3, name: "Shoes", price: 3000, category: "Fashion", stock: 15, description: "Running Shoes" }
  ];

  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchText, setSearchText] = useState("");
  const [view, setView] = useState("list");

  // Form state for editing
  const [editProductId, setEditProductId] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = products.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(result);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, products]);

  // Add / Update Product handler
  const handleAddProduct = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const price = Number(e.target.price.value);
    const category = e.target.category.value.trim();
    const stock = Number(e.target.stock.value);
    const description = e.target.description.value.trim();

    if (!name || !price || !category) {
      alert("Please fill all required fields!");
      return;
    }

    if (editProductId) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p.id === editProductId
          ? { ...p, name, price, category, stock, description }
          : p
      );
      setProducts(updatedProducts);
      setEditProductId(null);
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        name,
        price,
        category,
        stock,
        description
      };
      setProducts([...products, newProduct]);
    }

    e.target.reset();
  };

  // Edit button click
  const handleEdit = (product) => {
    setEditProductId(product.id);
    const form = document.getElementById("productForm");
    form.name.value = product.name;
    form.price.value = product.price;
    form.category.value = product.category;
    form.stock.value = product.stock;
    form.description.value = product.description;
  };

  // Delete product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Product Management</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search product..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "200px" }}
      />

      {/* View buttons */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setView("list")} style={{ marginRight: "5px" }}>List View</button>
        <button onClick={() => setView("card")}>Card View</button>
      </div>

      {/* Add / Edit Product Form */}
      <form id="productForm" onSubmit={handleAddProduct} style={{ marginBottom: "20px" }}>
        <input name="name" placeholder="Name" required style={{ margin: "5px" }} />
        <input name="price" type="number" placeholder="Price" required style={{ margin: "5px" }} />
        <input name="category" placeholder="Category" required style={{ margin: "5px" }} />
        <input name="stock" type="number" placeholder="Stock" style={{ margin: "5px" }} />
        <textarea name="description" placeholder="Description" style={{ margin: "5px", verticalAlign: "top" }} />
        <button type="submit" style={{ margin: "5px" }}>
          {editProductId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Table View */}
      {view === "list" && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.category || "-"}</td>
                <td>{item.stock || 0}</td>
                <td>{item.description || "-"}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "5px" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Card View */}
      {view === "card" && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid black",
                padding: "10px",
                width: "200px"
              }}
            >
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
              <p>Category: {item.category || "-"}</p>
              <p>Stock: {item.stock || 0}</p>
              <p>{item.description || "-"}</p>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "5px" }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
