import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DataList.css";

const DataList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user/data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id, status) => {
    if (status === "approved") {
      axios
        .patch(
          `http://localhost:3000/api/user/data/${id}/approve`,
          { approved: true },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        )
        .then(() => {
          setData(
            data.map((item) =>
              item._id === id ? { ...item, approved: true, status } : item
            )
          );
        })
        .catch((error) => {
          console.error("Error approving data:", error);
        });
    } else if (status === "rejected") {
      axios
        .delete(`http://localhost:3000/api/user/data/${id}/reject`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
        .then(() => {
          setData(
            data.map((item) => (item._id === id ? { ...item, status } : item))
          );
        })
        .catch((error) => {
          console.error("Error rejecting data:", error);
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <button className="logoutButton" onClick={handleLogout}>
        Logout
      </button>
      <div className="table">
        <div className="tableHeader">
          <span className="headerCell">SNo</span>
          <span className="headerCell">Year</span>
          <span className="headerCell">Dataset</span>
          <span className="headerCell">Description</span>
          <span className="headerCell">Kind of Traffic</span>
          <span className="headerCell">Publically Available</span>
          <span className="headerCell">Count</span>
          <span className="headerCell">Feature Count</span>
          <span className="headerCell">DOI</span>
          <span className="headerCell">Download Links</span>
          <span className="headerCell">Status</span>
          <span className="headerCell">Actions</span>
        </div>
        <div className="tableBody">
          {data.map((item) => (
            <div key={item._id} className="tableRow">
              <span className="tableCell">{item.SNo}</span>
              <span className="tableCell">{item.Year}</span>
              <span className="tableCell">{item.DATASET}</span>
              <span className="tableCell">{item.Discription}</span>
              <span className="tableCell">{item.KindOfTraffic}</span>
              <span className="tableCell">{item.PublicallyAvailable}</span>
              <span className="tableCell">{item.Count}</span>
              <span className="tableCell">{item.FeatureCount}</span>
              <span className="tableCell">{item.DOI}</span>
              <span className="tableCell">{item.DownloadLinks}</span>
              <span className={`tableCell statusTag ${item.status || ""}`}>
                {item.status
                  ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                  : "Pending"}
              </span>
              <div className="buttonGroup">
                <select
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  className="statusDropdown"
                  disabled={
                    item.status === "approved" || item.status === "rejected"
                  }
                  value={item.status || "pending"}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataList;
