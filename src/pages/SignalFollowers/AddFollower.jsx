import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';

const StyledButton = styled(Button)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#242830',
    boxShadow: 'none',
  },
  '&:active, &:focus, &.selected': {
    backgroundColor: '#0088cc',
    boxShadow: 'none',
  },
}));
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

function AddFollower() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    signalAccount: '',
    identifyBy: 'email',
    email: '',
    profileId: '',
    emailAlerts: 'no',
    tradeCopy: 'no',
    accessExpires: 'no',
    expirationDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signalAccounts, setSignalAccounts] = useState([]);

  useEffect(() => {
    const fetchSignalAccounts = async () => {
      try {
        const response = await api.get('/strategy/strategy-list');
        setSignalAccounts(response.data);
      } catch (error) {
        console.error('Error fetching subscriber strategies:', error);
      }
    }
    fetchSignalAccounts();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Signal Account
    if (!formData.signalAccount.trim()) {
      newErrors.signalAccount = 'Signal Account is required';
    }

    // Validate Email or Profile ID based on identifyBy selection
    if (formData.identifyBy === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.profileId.trim()) {
        newErrors.profileId = 'Profile ID is required';
      }
    }

    // Validate expiration date if access expires is set to yes
    if (formData.accessExpires === 'yes' && !formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required when access expires is set to yes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with actual API call
      // await api.post('/followers', formData);
      console.log(formData);
      showToast('Follower added successfully!', 'success');
      navigate('/signal-followers');
    } catch (error) {
      console.error('Error adding follower:', error);
      showToast('Failed to add follower', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="py-0 px-[200px]">
        <div className="pb-3">
          <Link
            to={'/signal-followers'}
            className="flex flex-row items-center font-extrabold"
          >
            <ReplyRoundedIcon
              fontSize="medium"
              sx={{ color: 'white', fontWeight: 'bold' }}
            />
            <h1 className="text-white text-lg pl-2"> Signal Followers</h1>
          </Link>
        </div>
        <div className="mb-[20px] rounded bg-[#282D36] text-white">
          <header className="p-[18px]">
            <h2 className="mt-[5px] text-[20px] font-normal">Add Signal Follower</h2>
          </header>
          <div className="box-border p-[15px] bg-[#2E353E]">
            <form onSubmit={handleSubmit}>
              {/* Signal Account */}
              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Signal Account
                </label>
                <div className="w-1/2 px-[15px]">
                  <FormControl fullWidth>
                    <Select
                      value={formData.signalAccount}
                      onChange={(e) => handleInputChange('signalAccount', e.target.value)}
                      input={<OutlinedInput sx={{ color: 'white', backgroundColor: '#282d36', height: '34px' }} />}
                      required
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#282d36',
                            color: 'white',
                            '& .MuiMenuItem-root': {
                              '&:hover': {
                                backgroundColor: '#3E454E',
                              },
                            },
                          },
                        },
                      }}
                    >
                      {signalAccounts.map((account, index) => {
                        return (
                          <MenuItem key={index} value={account.accountId}>
                            {account.name} ({account.accounts.login})
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                  {errors.signalAccount && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                      {errors.signalAccount}
                    </p>
                  )}
                </div>
              </div>

              {/* Identify By */}
              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Identify By
                </label>
                <div className="w-1/2 px-[15px]">
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
                      <span className="text-gray-300 text-sm">Email Address</span>
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
                      <span className="text-gray-300 text-sm">Profile ID</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Email or Profile ID */}
              {formData.identifyBy === 'email' ? (
                <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                  <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                    Email address
                  </label>
                  <div className="w-1/2 px-[15px]">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="block w-full h-[34px] text-sm bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                      placeholder="Enter email address"
                      required
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                  <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                    Profile ID
                  </label>
                  <div className="w-1/2 px-[15px]">
                    <input
                      type="text"
                      value={formData.profileId}
                      onChange={(e) => handleInputChange('profileId', e.target.value)}
                      className="block w-full h-[34px] text-sm bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                      placeholder="Enter profile ID"
                      required
                    />
                    {errors.profileId && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {errors.profileId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Email Alerts */}
              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Email Alerts
                </label>
                <div className="w-1/2 px-[15px]">
                  <FormControl fullWidth>
                    <Select
                      value={formData.emailAlerts}
                      onChange={(e) => handleInputChange('emailAlerts', e.target.value)}
                      input={<OutlinedInput sx={{ color: 'white', backgroundColor: '#282d36', height: '34px' }} />}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#282d36',
                            color: 'white',
                            '& .MuiMenuItem-root': {
                              '&:hover': {
                                backgroundColor: '#3E454E',
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="no">No</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Trade Copy */}
              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Trade Copy
                </label>
                <div className="w-1/2 px-[15px]">
                  <FormControl fullWidth>
                    <Select
                      value={formData.tradeCopy}
                      onChange={(e) => handleInputChange('tradeCopy', e.target.value)}
                      input={<OutlinedInput sx={{ color: 'white', backgroundColor: '#282d36', height: '34px' }} />}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#282d36',
                            color: 'white',
                            '& .MuiMenuItem-root': {
                              '&:hover': {
                                backgroundColor: '#3E454E',
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="no">No</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Access Expires */}
              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Does access expire?
                </label>
                <div className="w-1/2 px-[15px]">
                  <FormControl fullWidth>
                    <Select
                      value={formData.accessExpires}
                      onChange={(e) => handleInputChange('accessExpires', e.target.value)}
                      input={<OutlinedInput sx={{ color: 'white', backgroundColor: '#282d36', height: '34px' }} />}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#282d36',
                            color: 'white',
                            '& .MuiMenuItem-root': {
                              '&:hover': {
                                backgroundColor: '#3E454E',
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="no">No</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Expiration Date - Only show when access expires is "yes" */}
              {formData.accessExpires === 'yes' && (
                <div className="flex justify-start">
                  <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                    Expiration Date
                  </label>
                  <div className="w-1/2 px-[15px]">
                    <input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                      className="block w-full h-[34px] text-sm bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                      required
                    />
                    {errors.expirationDate && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {errors.expirationDate}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="px-[15px] py-[10px]">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-start-4 col-span-4 pl-3.5">
                <Button
                  variant="contained"
                  size="small"
                  disabled={isSubmitting}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#0088CC!important',
                    '&:disabled': {
                      backgroundColor: '#666!important',
                      color: '#999!important',
                    },
                  }}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Adding...' : 'Add Follower'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFollower; 