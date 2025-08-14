import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Radio from '@mui/material/Radio';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

//import componenets
import AccountDetails from '../../components/analysis/AccountDetails';
import PerformanceChart from '../../components/analysis/PerformanceCharts';
import TradingStats from '../../components/analysis/TradingStats';

import api from '../../utils/api';
import useToast from '../../hooks/useToast';
import AnalysisByTime from '../../components/analysis/AnalysisByTime';
import TradesAnalysis from '../../components/analysis/TradesAnalysis';
import { useParams } from 'react-router-dom';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

const StyledButton = styled(LoadingButton)(({ theme }) => ({
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

function AccountAnalysis() {
  const { id } = useParams();
  const [details, setDetails] = React.useState({});
  const [accountInfo, setAccountInfo] = React.useState({});
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    async function fetcher() {
      try {
        const res = await api.get(`/account/accounts/${id}`);
        setDetails(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetcher();
  }, [id]);

  React.useEffect(() => {
    async function fetcher() {
      try {
        const res = await api.get(`/account/accountInfo/${id}`);
        if (Object.keys(res.data).length > 0) {
          setAccountInfo(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetcher();
  }, [id]);

  React.useEffect(() => {
    async function fetcher() {
      try {
        const res = await api.get(`/account/history/${id}`);
        setHistory(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetcher();
  }, [id]);

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      {/* Header with back button */}
      <Link
        to={'/dashboard'}
        className="flex flex-row items-center font-extrabold hover:opacity-80 transition-opacity"
      >
        <ReplyRoundedIcon
          fontSize="medium"
          sx={{ color: '#11B3AE', fontWeight: 'bold' }}
        />
        <Typography sx={{ color: '#E9D8C8', fontSize: '1.125rem', fontWeight: 700, ml: 1 }}>
          Back to Dashboard
        </Typography>
      </Link>
      <div className="my-6 p-4 bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
        <Typography sx={{ color: '#E9D8C8', fontSize: '1.5rem', fontWeight: 600, mt: 2 }}>
          Account Analysis
        </Typography>
        <Typography sx={{ color: '#11B3AE', fontSize: '0.875rem', mt: 0.5 }}>
          Account ID: {id}
        </Typography>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Account Details - 1/4 width */}
        <div className="lg:col-span-1">
          <div className="bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <AccountDetails data={details} />
          </div>
        </div>

        {/* Performance Chart - 3/4 width */}
        <div className="lg:col-span-3">
          <div className="bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <PerformanceChart data={history} />
          </div>
        </div>
      </div>

      {/* Trading Stats - Full width */}
      <div className="mt-6">
        <div className="bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
          <TradingStats data={accountInfo} />
        </div>
      </div>

      {/* Analysis by Time - Full width */}
      <div className="mt-6">
        <div className="bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
          <AnalysisByTime data={history} />
        </div>
      </div>

      {/* Trades Analysis - Full width */}
      <div className="mt-6">
        <div className="bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
          <TradesAnalysis />
        </div>
      </div>
    </div>
  );
}

export default AccountAnalysis;
