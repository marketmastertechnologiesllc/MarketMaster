import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Icon } from '@iconify/react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import PerformanceCharts from '../../components/analysis/PerformanceCharts';
import AnalysisByTime from '../../components/analysis/AnalysisByTime';
import TradesAnalysis from '../../components/analysis/TradesAnalysis';
import api from '../../utils/api';
import useToast from '../../hooks/useToast';

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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#0B1220',
    border: '1px solid #11B3AE',
    borderRadius: '12px',
    color: '#E9D8C8',
    minWidth: '400px',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#E9D8C8',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'rgba(17, 179, 174, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(17, 179, 174, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#11B3AE',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#E9D8C8',
    '&.Mui-focused': {
      color: '#11B3AE',
    },
  },
}));

function TimeAnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Debug log to see all available parameters
  console.log('Account ID from params:', id);
  
  // State for data
  const [historyData, setHistoryData] = React.useState([]);
  const [filteredHistoryData, setFilteredHistoryData] = React.useState([]);
  const [accountName, setAccountName] = React.useState('');
  const [accountLogin, setAccountLogin] = React.useState('');
  
  // Date range state
  const [startDate, setStartDate] = React.useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = React.useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  // Modal state
  const [isDateModalOpen, setIsDateModalOpen] = React.useState(true);
  
  // Loading states
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch account data on component mount
  React.useEffect(() => {
    if (id) {
      fetchAccountData();
      fetchAccountNameAndLogin();
    }
  }, [id]);

  // Filter data when date range changes
  React.useEffect(() => {
    if (historyData.length > 0) {
      filterDataByDateRange();
    }
  }, [startDate, endDate, historyData]);

  const fetchAccountData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('AccountId from params:', id); // Debug log
      
      if (!id) {
        setError('Account ID is missing');
        return;
      }
      
      // Fetch history data
      const historyRes = await api.get(`/account/history/${id}`);
      setHistoryData(historyRes.data || []);
      
    } catch (err) {
      console.error('Error fetching account data:', err);
      setError('Failed to load account data. Please try again.');
      showToast('Failed to load account data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountNameAndLogin = async () => {
    try {
      if (!id) {
        console.error('AccountId is undefined in fetchAccountNameAndLogin');
        return;
      }
      
      const response = await api.get('/account/accounts?page=1&pagecount=100&sort=&type=');
      if (response.data && response.data.data) {
        const accounts = response.data.data;
        const account = accounts.find(acc => acc.accountId === id);
        if (account) {
          setAccountName(account.name);
          setAccountLogin(account.login);
        }
      }
    } catch (err) {
      console.error('Error fetching account name and login:', err);
    }
  };

  const filterDataByDateRange = () => {
    if (!startDate || !endDate) return;

    const filtered = historyData.filter(item => {
      const itemDate = new Date(item.openTimeAsDateTime);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      return itemDate >= start && itemDate <= end;
    });

    setFilteredHistoryData(filtered);
  };

  const handleDateModalClose = () => {
    setIsDateModalOpen(false);
  };

  const handleAnalyze = () => {
    if (!startDate || !endDate) {
      showToast('Please select both start and end dates', 'error');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      showToast('Start date cannot be after end date', 'error');
      return;
    }
    
    setIsDateModalOpen(false);
    filterDataByDateRange();
  };

  const handleBackToAnalysis = () => {
    navigate('/analysis');
  };

  const handleOpenDateModal = () => {
    setIsDateModalOpen(true);
  };

  if (error) {
    return (
      <div className="w-auto text-[#E9D8C8] pb-[100px]">
        <div className="mb-6">
          <StyledButton
            variant="outlined"
            startIcon={<Icon icon="mdi:arrow-left" />}
            onClick={handleBackToAnalysis}
            sx={{
              textTransform: 'none',
              borderColor: '#11B3AE!important',
              color: '#11B3AE!important',
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(17, 179, 174, 0.1)!important',
                borderColor: '#0F9A95!important',
                color: '#0F9A95!important',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(17, 179, 174, 0.2)',
              },
            }}
          >
            Back to Analysis
          </StyledButton>
        </div>
        <Alert severity="error" sx={{ backgroundColor: '#0B1220', color: '#E9D8C8', border: '1px solid #11B3AE' }}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Typography 
              sx={{ 
                color: '#E9D8C8', 
                fontSize: '1.5rem', 
                fontWeight: 700, 
                mb: 1 
              }}
            >
              Time Analysis
            </Typography>
            {accountName && accountLogin && (
              <Typography 
                sx={{ 
                  color: '#11B3AE', 
                  fontSize: '1rem', 
                  fontWeight: 500 
                }}
              >
                {accountName} ({accountLogin})
              </Typography>
            )}
            {!isDateModalOpen && startDate && endDate && (
              <div>
                <Typography 
                  sx={{ 
                    color: '#E9D8C8', 
                    fontSize: '0.875rem', 
                    fontWeight: 400,
                    mt: 0.5
                  }}
                >
                  Period: {new Date(startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: '2-digit', 
                    year: 'numeric' 
                  })} - {new Date(endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: '2-digit', 
                    year: 'numeric' 
                  })}
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#11B3AE', 
                    fontSize: '0.75rem', 
                    fontWeight: 400,
                    mt: 0.5
                  }}
                >
                  Note: All data is filtered by date range.
                </Typography>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <StyledButton
              variant="outlined"
              startIcon={<Icon icon="mdi:calendar" />}
              onClick={handleOpenDateModal}
              sx={{
                textTransform: 'none',
                borderColor: '#11B3AE!important',
                color: '#11B3AE!important',
                fontWeight: 500,
                borderRadius: '8px',
                padding: '8px 16px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(17, 179, 174, 0.1)!important',
                  borderColor: '#0F9A95!important',
                  color: '#0F9A95!important',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.2)',
                },
              }}
            >
              Change Period
            </StyledButton>
            <StyledButton
              variant="outlined"
              startIcon={<Icon icon="mdi:arrow-left" />}
              onClick={handleBackToAnalysis}
              sx={{
                textTransform: 'none',
                borderColor: '#11B3AE!important',
                color: '#11B3AE!important',
                fontWeight: 500,
                borderRadius: '8px',
                padding: '8px 16px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(17, 179, 174, 0.1)!important',
                  borderColor: '#0F9A95!important',
                  color: '#0F9A95!important',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.2)',
                },
              }}
            >
              Back to Analysis
            </StyledButton>
          </div>
        </div>
      </div>

      {/* Date Range Selection Modal */}
      <StyledDialog
        open={isDateModalOpen}
        onClose={handleDateModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#E9D8C8', borderBottom: '1px solid rgba(17, 179, 174, 0.2)' }}>
          Select Time Period
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <StyledTextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: endDate,
              }}
            />
            <StyledTextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: startDate,
                max: new Date().toISOString().split('T')[0],
              }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(17, 179, 174, 0.2)' }}>
          <StyledButton
            onClick={handleDateModalClose}
            sx={{
              textTransform: 'none',
              borderColor: 'rgba(17, 179, 174, 0.3)!important',
              color: 'rgba(17, 179, 174, 0.7)!important',
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px',
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            onClick={handleAnalyze}
            variant="contained"
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
            }}
          >
            Analyze
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <CircularProgress sx={{ color: '#11B3AE', mb: 2 }} />
            <Typography sx={{ color: '#E9D8C8', fontSize: '1rem' }}>
              Loading time analysis data...
            </Typography>
          </div>
        </div>
      ) : isDateModalOpen ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <Typography sx={{ color: '#E9D8C8', fontSize: '1.125rem', mb: 2 }}>
              Please select a time period to analyze
            </Typography>
            <Typography sx={{ color: '#11B3AE', fontSize: '0.875rem' }}>
              Choose start and end dates to view data for that specific period
            </Typography>
          </div>
        </div>
             ) : (
         <div className="space-y-6">
           {/* Performance Chart - Full width */}
           <div>
             <div className="bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
               <PerformanceCharts data={filteredHistoryData} />
             </div>
           </div>

           {/* Analysis by Time - Full width */}
           <div>
             <div className="bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
               <AnalysisByTime data={filteredHistoryData} />
             </div>
           </div>

           {/* Trades Analysis - Full width */}
           <div>
             <div className="bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
               <TradesAnalysis />
             </div>
           </div>
         </div>
       )}
    </div>
  );
}

export default TimeAnalysisPage; 