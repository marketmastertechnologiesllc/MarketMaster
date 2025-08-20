import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Icon } from '@iconify/react';

import TradingStats from '../../components/analysis/TradingStats';
import AnalysisByTime from '../../components/analysis/AnalysisByTime';
import api from '../../utils/api';
import useToast from '../../hooks/useToast';
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

function TradingStatsPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading } = useLoading();
  // State for data
  const [accountDetails, setAccountDetails] = React.useState({});
  const [accountInfo, setAccountInfo] = React.useState({});
  const [historyData, setHistoryData] = React.useState([]);
  const [accountName, setAccountName] = React.useState('');
  const [accountLogin, setAccountLogin] = React.useState('');
  
  // Loading states
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch account data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      loading(true);
      if (accountId) {
        await fetchAccountData();
        await fetchAccountNameAndLogin();
      }
      loading(false);
    };
    
    fetchData();
  }, [accountId]);

  const fetchAccountData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch account details, account info, and history in parallel
      const [detailsRes, infoRes, historyRes] = await Promise.all([
        api.get(`/account/accounts/${accountId}`),
        api.get(`/account/accountInfo/${accountId}`),
        api.get(`/account/history/${accountId}`)
      ]);
      
      setAccountDetails(detailsRes.data || {});
      
      setAccountInfo(infoRes.data || {});
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
      const response = await api.get('/account/accounts?page=1&pagecount=100&sort=&type=');
      if (response.data && response.data.data) {
        const accounts = response.data.data;
        const account = accounts.find(acc => acc.accountId === accountId);
        if (account) {
          setAccountName(account.name);
          setAccountLogin(account.login);
        }
      }
    } catch (err) {
      console.error('Error fetching account name and login:', err);
    }
  };

  const handleBackToAnalysis = () => {
    navigate('/analysis');
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
              Trading Statistics
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
          </div>
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

      {/* Content */}
      {
      // isLoading ? (
      //   <div className="flex justify-center items-center py-16">
      //     <div className="text-center">
      //       <CircularProgress sx={{ color: '#11B3AE', mb: 2 }} />
      //       <Typography sx={{ color: '#E9D8C8', fontSize: '1rem' }}>
      //         Loading trading statistics...
      //       </Typography>
      //     </div>
      //   </div>
      // ) : 
      (
        <div className="space-y-8">
          <div className="rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <TradingStats data={accountInfo} />
          </div>
          <div className="rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <AnalysisByTime data={historyData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TradingStatsPage; 