import React, { useState, useContext, useEffect } from "react";
import "./home.css";
import UploadPopup from "../dashboard/uploadDocument";
import { DocumentContext } from "../../context/DocumentContext";

const Home = () => {
  const [openUpload, setOpenUpload] = useState(false);
  const { totalDocsCount, expiringDocsCount, permanentDocsCount, temporaryDocsCount, fetchDocuments } = useContext(DocumentContext);

  // Fetch documents when component mounts
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const stats = [
    { title: "Total Documents", value: totalDocsCount },
    { title: "Expiring Soon", value: expiringDocsCount },
    { title: "Permanent", value: permanentDocsCount },
    { title: "Temporary", value: temporaryDocsCount }
  ];
  return (
    <div className="main">

      {/* Header */}
      <div className="header">
        <h1 >Dashboard</h1>
        <div className="profile">Welcome, User</div>
      </div>

      {/* Stats Cards */}
      <div className="cards">
        {stats.map((item, index) => (
          <div className="card" key={index}>
            <h3>{item.title}</h3>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <button
        className="upload"
        onClick={() => setOpenUpload(true)}
      >
        + Upload New Document
      </button>

      {/* Documents Section */}
      { totalDocsCount === 0 ? (
        <div className="documents">
          <h3>No documents uploaded yet</h3>
          <p>Upload your first document to get started</p>
        </div>
      ) : null }

      {/* WhatsApp Alert */}
      <div className="whatsapp-alert">
        <div className="wa-icon">
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
            alt="WhatsApp"
          />
        </div>

        <div className="wa-text">
          <h4>WhatsApp Notifications Enabled</h4>
          <p>
            You will receive automatic reminders via WhatsApp:
            30 days before expiry and on expiry day.
          </p>
        </div>
      </div>

         {openUpload && (
        <UploadPopup
          open={openUpload}
          onClose={() => setOpenUpload(false)}
        />
      )}

    </div>
  );
};

export default Home;