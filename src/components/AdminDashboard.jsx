import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllRegistrations } from '../services/firebase';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getAllRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner-large"></div>
          <p>Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-container">
          <p className="error-text">⚠️ {error}</p>
          <button onClick={fetchRegistrations} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <motion.div 
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Admin Dashboard</h1>
        <p className="subtitle">{registrations.length} Total Registrations</p>
      </motion.div>

      {registrations.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-icon">📋</div>
          <h2>No Registrations Yet</h2>
          <p>Registrations will appear here once users submit the form.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="cards-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {registrations.map((user, index) => (
            <motion.div
              key={user.id}
              className="user-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              onClick={() => setSelectedUser(user)}
            >
              <div className="card-image-wrapper">
                <img 
                  src={user.imageUrl} 
                  alt={user.name}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <h3 className="card-name">{user.name}</h3>
                <p className="card-description">
                  {user.description.length > 100 
                    ? `${user.description.substring(0, 100)}...` 
                    : user.description}
                </p>
                <div className="card-meta">
                  <span className="location-badge">📍 {user.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
              
              <div className="modal-image-wrapper">
                <img 
                  src={selectedUser.imageUrl} 
                  alt={selectedUser.name}
                  className="modal-image"
                />
              </div>
              
              <div className="modal-details">
                <h2>{selectedUser.name}</h2>
                
                <div className="detail-section">
                  <h3>About</h3>
                  <p>{selectedUser.description}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Location</h3>
                  <p>📍 {selectedUser.location}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Submitted On</h3>
                  <p>🕒 {formatDate(selectedUser.timestamp)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
