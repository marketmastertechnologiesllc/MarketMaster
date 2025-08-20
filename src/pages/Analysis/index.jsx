import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Icon } from '@iconify/react';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import api from '../../utils/api';
import useToast from '../../hooks/useToast';
import { formatNumber } from '../../utils/formatNumber';
import { useLoading } from '../../contexts/loadingContext';
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#0B1220',
    boxShadow: '0 4px 12px rgba(11, 18, 32, 0.3)',
    transform: 'translateY(-1px)',
  },
  '&:active, &:focus, &.selected': {
    backgroundColor: '#11B3AE',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.4)',
  },
}));

function Analysis() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading } = useLoading();
  // State for accounts and data
  const [accounts, setAccounts] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState('');
  const [accountDetails, setAccountDetails] = React.useState({});
  const [accountInfo, setAccountInfo] = React.useState({});
  const [recentActivity, setRecentActivity] = React.useState([]);
  const [performanceMetrics, setPerformanceMetrics] = React.useState({
    winRate: 0,
    profitFactor: 0,
    totalTrades: 0,
    totalProfit: 0
  });
  
  // Loading states
  const [isLoadingAccounts, setIsLoadingAccounts] = React.useState(true);
  const [isLoadingAccountData, setIsLoadingAccountData] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Fetch user accounts on component mount
  React.useEffect(() => {
    fetchUserAccounts();
  }, []);

  // Fetch account data when selected account changes
  React.useEffect(() => {
    if (selectedAccount) {
      fetchAccountData(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchUserAccounts = async () => {
    try {
      loading(true);
      setIsLoadingAccounts(true);
      setError(null);
      
      const response = await api.get('/account/my-accounts?page=1&pagecount=100&sort=&type=');
      
      if (response.data && response.data.data) {
        const accountsList = response.data.data;
        setAccounts(accountsList);
        
        // Set first account as default if available
        if (accountsList.length > 0) {
          setSelectedAccount(accountsList[0].accountId);
        }
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to load accounts. Please try again.');
      showToast('Failed to load accounts', 'error');
    } finally {
      setIsLoadingAccounts(false);
      loading(false);
    }
  };

  const fetchAccountData = async (accountId) => {
    if (!accountId) return;
    
    try {
      loading(true);
      setIsLoadingAccountData(true);
      setError(null);
      
      // Fetch account details, info, and history in parallel
      const [detailsRes, infoRes, historyRes] = await Promise.all([
        api.get(`/account/accounts/${accountId}`),
        api.get(`/account/accountInfo/${accountId}`),
        api.get(`/account/history/${accountId}`)
      ]);
      
      setAccountDetails(detailsRes.data || {});
      setAccountInfo(infoRes.data || {});
      
      // Process history data for recent activity
      const historyData = historyRes.data || [];
      setRecentActivity(historyData.slice(0, 5)); // Get last 5 trades
      
      // Calculate performance metrics
      calculatePerformanceMetrics(historyData);
      
    } catch (err) {
      console.error('Error fetching account data:', err);
      setError('Failed to load account data. Please try again.');
      showToast('Failed to load account data', 'error');
    } finally {
      setIsLoadingAccountData(false);
      loading(false);
    }
  };

  const calculatePerformanceMetrics = (historyData) => {
    if (!historyData || historyData.length === 0) {
      setPerformanceMetrics({
        winRate: 0,
        profitFactor: 0,
        totalTrades: 0,
        totalProfit: 0
      });
      return;
    }

    const totalTrades = historyData.length;
    const winningTrades = historyData.filter(trade => trade.profit > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    const totalProfit = historyData.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const grossProfit = historyData
      .filter(trade => trade.profit > 0)
      .reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const grossLoss = Math.abs(historyData
      .filter(trade => trade.profit < 0)
      .reduce((sum, trade) => sum + (trade.profit || 0), 0));
    
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

    setPerformanceMetrics({
      winRate: winRate.toFixed(2),
      profitFactor: profitFactor.toFixed(2),
      totalTrades,
      totalProfit
    });
  };

  const handleAnalyseAccount = () => {
    if (selectedAccount) {
      navigate(`/analysis/analysis-account/${selectedAccount}`);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getSelectedAccountName = () => {
    const account = accounts.find(acc => acc.accountId === selectedAccount);
    return account ? `${account.name} (${account.accountId})` : '';
  };

  if (error) {
    return (
      <div className="w-auto text-[#E9D8C8] pb-[100px]">
        <Alert severity="error" sx={{ backgroundColor: '#0B1220', color: '#E9D8C8', border: '1px solid #11B3AE' }}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="w-auto text-[#E9D8C8] grid grid-cols-12 gap-8">
        <div className="col-span-6">
          <section className="mb-[20px] rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Account Statistics
              </h2>
            </header>
            <div className="p-[15px] bg-[#0B1220]">
              <label className="text-[#E9D8C8] max-w-full inline-block mb-[5px] text-[13px] font-medium">
                Choose account
              </label>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  disabled={isLoadingAccounts}
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
                            backgroundColor: 'rgba(17, 179, 174, 0.1)',
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
                  input={
                    <OutlinedInput
                      sx={{
                        color: '#E9D8C8',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(17, 179, 174, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(17, 179, 174, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#11B3AE',
                          boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
                        },
                        '& .MuiSelect-icon': {
                          color: '#E9D8C8',
                        },
                      }}
                    />
                  }
                >
                  {isLoadingAccounts ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ color: '#11B3AE', mr: 1 }} />
                      Loading accounts...
                    </MenuItem>
                  ) : accounts.length === 0 ? (
                    <MenuItem disabled>No accounts available</MenuItem>
                  ) : (
                    accounts.map((account) => (
                      <MenuItem key={account.accountId} value={account.accountId}>
                        {account.name} ({account.login})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </div>
            <footer className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
              <div className="flex justify-end">
                <StyledButton
                  variant="contained"
                  size="small"
                  onClick={handleAnalyseAccount}
                  disabled={!selectedAccount || isLoadingAccountData}
                  sx={{
                    textTransform: 'none',
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
                      backgroundColor: 'rgba(17, 179, 174, 0.3)!important',
                      color: 'rgba(255, 255, 255, 0.5)!important',
                    },
                  }}
                >
                  {isLoadingAccountData ? (
                    <>
                      <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: 1 }} />
                      Loading...
                    </>
                  ) : (
                    'Analyse Account'
                  )}
                </StyledButton>
              </div>
            </footer>
          </section>
          
          <section className="mb-[20px] rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Performance Overview
              </h2>
            </header>
            <div className="p-[15px] bg-[#0B1220]">
              {isLoadingAccountData ? (
                <div className="flex justify-center items-center py-8">
                  <CircularProgress sx={{ color: '#11B3AE' }} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0B1220] border border-[#11B3AE] border-opacity-30 rounded-lg p-4">
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
                      Win Rate
                    </Typography>
                    <Typography sx={{ color: '#11B3AE', fontSize: '1.5rem', fontWeight: 700 }}>
                      {performanceMetrics.winRate}%
                    </Typography>
                  </div>
                  <div className="bg-[#0B1220] border border-[#11B3AE] border-opacity-30 rounded-lg p-4">
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
                      Profit Factor
                    </Typography>
                    <Typography sx={{ color: '#11B3AE', fontSize: '1.5rem', fontWeight: 700 }}>
                      {performanceMetrics.profitFactor}
                    </Typography>
                  </div>
                  <div className="bg-[#0B1220] border border-[#11B3AE] border-opacity-30 rounded-lg p-4">
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
                      Total Trades
                    </Typography>
                    <Typography sx={{ color: '#11B3AE', fontSize: '1.5rem', fontWeight: 700 }}>
                      {performanceMetrics.totalTrades}
                    </Typography>
                  </div>
                  <div className="bg-[#0B1220] border border-[#11B3AE] border-opacity-30 rounded-lg p-4">
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
                      Total Profit
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: performanceMetrics.totalProfit >= 0 ? '#47A447' : '#f40b0b', 
                        fontSize: '1.5rem', 
                        fontWeight: 700 
                      }}
                    >
                      {formatNumber(performanceMetrics.totalProfit)}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
        
        <div className="col-span-6">
          <section className="mb-[20px] rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Quick Actions
              </h2>
            </header>
            <div className="p-[15px] bg-[#0B1220]">
              <div className="space-y-3">
                <StyledButton
                  variant="contained"
                  fullWidth
                  startIcon={<Icon icon="mdi:chart-line" />}
                  onClick={() => selectedAccount && navigate(`/analysis/performance-chart/${selectedAccount}`)}
                  disabled={!selectedAccount || isLoadingAccountData}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#11B3AE!important',
                    color: '#FFFFFF!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(17, 179, 174, 0.3)!important',
                      color: 'rgba(255, 255, 255, 0.5)!important',
                    },
                  }}
                >
                  View Performance Charts
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:table" />}
                  onClick={() => selectedAccount && navigate(`/analysis/trading-stats/${selectedAccount}`)}
                  disabled={!selectedAccount || isLoadingAccountData}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#11B3AE!important',
                    color: '#11B3AE!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(17, 179, 174, 0.1)!important',
                      borderColor: '#0F9A95!important',
                      color: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.2)',
                    },
                    '&:disabled': {
                      borderColor: 'rgba(17, 179, 174, 0.3)!important',
                      color: 'rgba(17, 179, 174, 0.5)!important',
                    },
                  }}
                >
                  Trading Statistics
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:clock-outline" />}
                  onClick={() => selectedAccount && navigate(`/analysis/time-analysis/${selectedAccount}`)}
                  disabled={!selectedAccount || isLoadingAccountData}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#11B3AE!important',
                    color: '#11B3AE!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(17, 179, 174, 0.1)!important',
                      borderColor: '#0F9A95!important',
                      color: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.2)',
                    },
                    '&:disabled': {
                      borderColor: 'rgba(17, 179, 174, 0.3)!important',
                      color: 'rgba(17, 179, 174, 0.5)!important',
                    },
                  }}
                >
                  Time Analysis
                </StyledButton>
              </div>
            </div>
          </section>
          
          <section className="mb-[20px] rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Recent Activity
              </h2>
            </header>
            <div className="p-[15px] bg-[#0B1220]">
              {isLoadingAccountData ? (
                <div className="flex justify-center items-center py-8">
                  <CircularProgress sx={{ color: '#11B3AE' }} />
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem' }}>
                    No recent activity found
                  </Typography>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#0B1220] border border-[#11B3AE] border-opacity-20 rounded-lg">
                      <div>
                        <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500 }}>
                          {activity.symbol || 'Trade'}
                        </Typography>
                        <Typography sx={{ color: '#11B3AE', fontSize: '0.75rem' }}>
                          {formatTimeAgo(activity.closeTimeAsDateTime || activity.openTimeAsDateTime)}
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Typography 
                          sx={{ 
                            color: (activity.profit || 0) >= 0 ? '#47A447' : '#f40b0b', 
                            fontSize: '0.875rem', 
                            fontWeight: 600 
                          }}
                        >
                          {(activity.profit || 0) >= 0 ? '+' : ''}{formatNumber(activity.profit || 0)}
                        </Typography>
                        <Typography sx={{ color: '#E9D8C8', fontSize: '0.75rem' }}>
                          {activity.type === 'DealSell' ? 'Buy' : activity.type === 'DealBuy' ? 'Sell' : activity.type || 'N/A'}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
