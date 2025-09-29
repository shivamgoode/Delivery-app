import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null); // item being edited
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: null,
  });

  // Fetch list
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.data) {
        setList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Failed to fetch list");
      console.error(error);
    }
  };

  // Remove food
  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { _id: foodId });
    await fetchList();
    if (response.data.success === true) {
      toast.success("Food Removed");
    } else {
      toast.error("Error");
    }
  };

  // Open edit modal
  const openEdit = (item) => {
    setEditItem(item._id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || "",
      image: null,
    });
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit edit
  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("description", formData.description);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await axios.put(`${url}/api/food/update/${editItem}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Food updated successfully!");
        setEditItem(null);
        fetchList();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating food");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-add flex col">
      <p>ALL FOOD LIST</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={item.imageUrl} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => openEdit(item)}>Edit</button>
              <p onClick={() => removeFood(item._id)} className="cursor">X</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= Edit Modal ================= */}
      {editItem && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Food</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Food Name"
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />
            <input type="file" name="image" onChange={handleChange} />

            <div className="edit-actions">
              <button className="save-btn" onClick={handleUpdate}>Save</button>
              <button className="cancel-btn" onClick={() => setEditItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
