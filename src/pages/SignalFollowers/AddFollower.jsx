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
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#0F9A95',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
    transform: 'translateY(-1px)',
  },
}));

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
    <div className="w-auto text-[#E9D8C8]">
      <div className="py-0 px-[200px]">
        <div className="pb-3">
          <Link
            to={'/signal-followers'}
            className="flex flex-row items-center font-extrabold text-[#E9D8C8] hover:text-[#11B3AE] transition-colors"
          >
            <ReplyRoundedIcon
              fontSize="medium"
              sx={{ color: 'currentColor', fontWeight: 'bold' }}
            />
            <h1 className="text-lg pl-2"> Signal Followers</h1>
          </Link>
        </div>
        <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
          <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
            <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Add Signal Follower</h2>
          </header>
          <div className="box-border p-[15px] bg-[#0B1220]">
            <form onSubmit={handleSubmit}>
              {/* Signal Account */}
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Signal Account
                </label>
                <div className="w-1/2 px-[15px]">
                  <FormControl fullWidth>
                    <Select
                      value={formData.signalAccount}
                      onChange={(e) => handleInputChange('signalAccount', e.target.value)}
                      input={<OutlinedInput sx={{ 
                        color: '#E9D8C8', 
                        backgroundColor: '#0B1220', 
                        height: '40px',
                        borderRadius: '8px',
                        borderColor: 'rgba(17, 179, 174, 0.3)',
                        '&:hover': {
                          borderColor: 'rgba(17, 179, 174, 0.5)',
                        },
                        '&.Mui-focused': {
                          borderColor: '#11B3AE',
                          boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
                        },
                      }} />}
                      required
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#0B1220',
                            border: '1px solid rgba(17, 179, 174, 0.3)',
                            borderRadius: '8px',
                            maxHeight: '200px',
                            '& .MuiMenuItem-root': {
                              color: '#E9D8C8',
                              '&:hover': {
                                backgroundColor: 'rgba(17, 179, 174, 0.2)',
                                color: '#E9D8C8',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#11B3AE',
                                color: '#FFFFFF',
                                '&:hover': {
                                  backgroundColor: '#0F9A95',
                                },
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
                    <p className="mt-2 text-sm text-[#fa5252] font-medium">
                      {errors.signalAccount}
                    </p>
                  )}
                </div>
              </div>

              {/* Identify By */}
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
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
                        className="mr-2 accent-[#11B3AE]"
                      />
                      <span className="text-[#E9D8C8] text-sm">Email Address</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="identifyBy"
                        value="profileId"
                        checked={formData.identifyBy === 'profileId'}
                        onChange={(e) => handleInputChange('identifyBy', e.target.value)}
                        className="mr-2 accent-[#11B3AE]"
                      />
                      <span className="text-[#E9D8C8] text-sm">Profile ID</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Email or Profile ID */}
              {formData.identifyBy === 'email' ? (
                <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                  <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                    Email address
                  </label>
                  <div className="w-1/2 px-[15px]">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                      placeholder="Enter email address"
                      required
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-[#fa5252] font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                  <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                    Profile ID
                  </label>
                  <div className="w-1/2 px-[15px]">
                    <input
                      type="text"
                      value={formData.profileId}
                      onChange={(e) => handleInputChange('profileId', e.target.value)}
                      className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                      placeholder="Enter profile ID"
                      required
                    />
                    {errors.profileId && (
                      <p className="mt-2 text-sm text-[#fa5252] font-medium">
                        {errors.profileId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Email Alerts */}
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Email Alerts
                </label>
                <div className="w-1/2 px-[15px]">
                  <FormControl fullWidth>
                    <Select
                      value={formData.emailAlerts}
                      onChange={(e) => handleInputChange('emailAlerts', e.target.value)}
                      input={<OutlinedInput sx={{ 
                        color: '#E9D8C8', 
                        backgroundColor: '#0B1220', 
                        height: '40px',
                        borderRadius: '8px',
                        borderColor: 'rgba(17, 179, 174, 0.3)',
                        '&:hover': {
                          borderColor: 'rgba(17, 179, 174, 0.5)',
                        },
                        '&.Mui-focused': {
                          borderColor: '#11B3AE',
                          boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
                        },
                      }} />}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#0B1220',
                            border: '1px solid rgba(17, 179, 174, 0.3)',
                            borderRadius: '8px',
                            maxHeight: '200px',
                            '& .MuiMenuItem-root': {
                              color: '#E9D8C8',
                              '&:hover': {
                                backgroundColor: 'rgba(17, 179, 174, 0.2)',
                                color: '#E9D8C8',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#11B3AE',
                                color: '#FFFFFF',
                                '&:hover': {
                                  backgroundColor: '#0F9A95',
                                },
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
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Trade Copy
                </label>
                <div className="w-1/2 px-[15px]">
                  <FormControl fullWidth>
                    <Select
                      value={formData.tradeCopy}
                      onChange={(e) => handleInputChange('tradeCopy', e.target.value)}
                      input={<OutlinedInput sx={{ 
                        color: '#E9D8C8', 
                        backgroundColor: '#0B1220', 
                        height: '40px',
                        borderRadius: '8px',
                        borderColor: 'rgba(17, 179, 174, 0.3)',
                        '&:hover': {
                          borderColor: 'rgba(17, 179, 174, 0.5)',
                        },
                        '&.Mui-focused': {
                          borderColor: '#11B3AE',
                          boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
                        },
                      }} />}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#0B1220',
                            border: '1px solid rgba(17, 179, 174, 0.3)',
                            borderRadius: '8px',
                            maxHeight: '200px',
                            '& .MuiMenuItem-root': {
                              color: '#E9D8C8',
                              '&:hover': {
                                backgroundColor: 'rgba(17, 179, 174, 0.2)',
                                color: '#E9D8C8',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#11B3AE',
                                color: '#FFFFFF',
                                '&:hover': {
                                  backgroundColor: '#0F9A95',
                                },
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
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Does access expire?
                </label>
                <div className="w-1/2 px-[15px]">
                  <FormControl fullWidth>
                    <Select
                      value={formData.accessExpires}
                      onChange={(e) => handleInputChange('accessExpires', e.target.value)}
                      input={<OutlinedInput sx={{ 
                        color: '#E9D8C8', 
                        backgroundColor: '#0B1220', 
                        height: '40px',
                        borderRadius: '8px',
                        borderColor: 'rgba(17, 179, 174, 0.3)',
                        '&:hover': {
                          borderColor: 'rgba(17, 179, 174, 0.5)',
                        },
                        '&.Mui-focused': {
                          borderColor: '#11B3AE',
                          boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
                        },
                      }} />}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#0B1220',
                            border: '1px solid rgba(17, 179, 174, 0.3)',
                            borderRadius: '8px',
                            maxHeight: '200px',
                            '& .MuiMenuItem-root': {
                              color: '#E9D8C8',
                              '&:hover': {
                                backgroundColor: 'rgba(17, 179, 174, 0.2)',
                                color: '#E9D8C8',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#11B3AE',
                                color: '#FFFFFF',
                                '&:hover': {
                                  backgroundColor: '#0F9A95',
                                },
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
                  <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                    Expiration Date
                  </label>
                  <div className="w-1/2 px-[15px]">
                    <input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                      className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                      required
                    />
                    {errors.expirationDate && (
                      <p className="mt-2 text-sm text-[#fa5252] font-medium">
                        {errors.expirationDate}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-start-4 col-span-4 pl-3.5">
                <StyledButton
                  variant="contained"
                  size="small"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: '#11B3AE!important',
                    color: '#FFFFFF!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                    },
                    '&:disabled': {
                      backgroundColor: '#666!important',
                      color: '#999!important',
                    },
                  }}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Adding...' : 'Add Follower'}
                </StyledButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFollower; 