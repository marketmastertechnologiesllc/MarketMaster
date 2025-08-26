import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';

function AddFollowerModal({ onClose, onSuccess }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    strategyAccount: '',
    identifyBy: 'email',
    email: '',
    profileId: '',
    emailAlerts: 'no',
    tradeCopy: 'no',
    accessExpires: 'no',
    expirationDate: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual API call
      // await api.post('/followers', formData);
      showToast('Follower added successfully!', 'success');
      onSuccess();
    } catch (error) {
      console.error('Error adding follower:', error);
      showToast('Failed to add follower', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1201]">
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-[1202]"
        onClick={onClose}
      ></div>
      <div className="bg-[#282D36] rounded-lg w-[500px] z-[1203] max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center mb-4">
            <Link to="/strategy-followers" className="flex items-center text-blue-500 hover:text-blue-400">
              <Icon icon="mdi:arrow-left" width="20" height="20" className="mr-2" />
              My Followers
            </Link>
          </div>
          <h2 className="text-white text-xl font-semibold">Add Strategy Follower</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Strategy Account */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Strategy Account
            </label>
            <select
              value={formData.strategyAccount}
              onChange={(e) => handleInputChange('strategyAccount', e.target.value)}
              className="w-full p-2 bg-[#2E353E] border border-gray-600 rounded text-white"
              required
            >
              <option value="">Select account</option>
              <option value="account1">Account 1</option>
              <option value="account2">Account 2</option>
            </select>
          </div>

          {/* Identify By */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Identify By
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="identifyBy"
                  value="email"
                  checked={formData.identifyBy === 'email'}
                  onChange={(e) => handleInputChange('identifyBy', e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-300">Email Address</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="identifyBy"
                  value="profileId"
                  checked={formData.identifyBy === 'profileId'}
                  onChange={(e) => handleInputChange('identifyBy', e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-300">Profile ID</span>
              </label>
            </div>
          </div>

          {/* Email or Profile ID */}
          {formData.identifyBy === 'email' ? (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-2 bg-[#2E353E] border border-gray-600 rounded text-white"
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Profile ID
              </label>
              <input
                type="text"
                value={formData.profileId}
                onChange={(e) => handleInputChange('profileId', e.target.value)}
                className="w-full p-2 bg-[#2E353E] border border-gray-600 rounded text-white"
                required
              />
            </div>
          )}

          {/* Email Alerts */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Alerts
            </label>
            <select
              value={formData.emailAlerts}
              onChange={(e) => handleInputChange('emailAlerts', e.target.value)}
              className="w-full p-2 bg-[#2E353E] border border-gray-600 rounded text-white"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {/* Trade Copy */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Trade Copy
            </label>
            <select
              value={formData.tradeCopy}
              onChange={(e) => handleInputChange('tradeCopy', e.target.value)}
              className="w-full p-2 bg-[#2E353E] border border-gray-600 rounded text-white"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {/* Access Expires */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Does access expire?
            </label>
            <select
              value={formData.accessExpires}
              onChange={(e) => handleInputChange('accessExpires', e.target.value)}
              className="w-full p-2 bg-[#2E353E] border border-gray-600 rounded text-white"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#0099e6',
                '&:hover': { backgroundColor: '#0088cc' }
              }}
            >
              Add Follower
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFollowerModal; 