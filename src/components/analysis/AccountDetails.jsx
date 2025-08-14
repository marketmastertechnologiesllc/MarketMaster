import * as React from 'react';
import { formatNumber } from '../../utils/formatNumber';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledTab = styled('div')(({ theme, active }) => ({
  display: 'inline-block',
  padding: '12px 16px',
  color: active ? '#FFFFFF' : '#E9D8C8',
  backgroundColor: active ? '#11B3AE' : 'transparent',
  borderRadius: '8px 8px 0 0',
  borderTop: `3px solid ${active ? '#11B3AE' : 'transparent'}`,
  fontWeight: 600,
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: active ? '#0F9A95' : 'rgba(17, 179, 174, 0.1)',
    transform: 'translateY(-1px)',
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(17, 179, 174, 0.2)',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: 'rgba(17, 179, 174, 0.4)',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
    transform: 'translateY(-1px)',
  },
}));

const AccountDetails = ({ data }) => {
  return (
    <div className="h-full">
      {/* Tab Header */}
      <div className="p-4 border-b border-[#11B3AE] border-opacity-20">
        <StyledTab active={true}>
          Account Details
        </StyledTab>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Account Name */}
        <Typography 
          sx={{ 
            color: '#E9D8C8', 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            mb: 3,
            textAlign: 'center'
          }}
        >
          {Object.keys(data).length > 0 && data.name}
        </Typography>

        {/* Stats Grid */}
        <div className="space-y-5">
          {/* Growth */}
          <StatCard>
            <Typography sx={{ color: '#E9D8C8', fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
              Growth
            </Typography>
            <Typography 
              sx={{ 
                color: Object.keys(data).length > 0 && data.growth ? 
                  (data.growth > 0 ? '#47A447' : data.growth < 0 ? '#f40b0b' : '#E9D8C8') : '#E9D8C8', 
                fontSize: '1.125rem', 
                fontWeight: 700 
              }}
            >
              {Object.keys(data).length > 0 && data.growth} <small>%</small>
            </Typography>
          </StatCard>

          {/* Profit/Loss */}
          <StatCard>
            <Typography sx={{ color: '#E9D8C8', fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
              Profit/Loss
            </Typography>
            <Typography 
              sx={{ 
                color: '#E9D8C8', 
                fontSize: '1.125rem', 
                fontWeight: 700 
              }}
            >
              {formatNumber(data.profit)} <small>USD</small>
            </Typography>
          </StatCard>

          {/* Balance */}
          <StatCard>
            <Typography sx={{ color: '#E9D8C8', fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
              Balance
            </Typography>
            <Typography 
              sx={{ 
                color: '#11B3AE', 
                fontSize: '1.125rem', 
                fontWeight: 700 
              }}
            >
              {Object.keys(data).length > 0 && data.balance.toFixed(2)} <small>USD</small>
            </Typography>
          </StatCard>

          {/* Equity */}
          <StatCard>
            <Typography sx={{ color: '#E9D8C8', fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
              Equity
            </Typography>
            <Typography 
              sx={{ 
                color: '#11B3AE', 
                fontSize: '1.125rem', 
                fontWeight: 700 
              }}
            >
              {Object.keys(data).length > 0 && data.equity.toFixed(2)} <small>USD</small>
            </Typography>
          </StatCard>

          {/* Equity Percentage */}
          <StatCard>
            <Typography sx={{ color: '#E9D8C8', fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
              Equity Percentage
            </Typography>
            <Typography 
              sx={{ 
                color: '#11B3AE', 
                fontSize: '1.125rem', 
                fontWeight: 700 
              }}
            >
              {Object.keys(data).length > 0 && data.equityPercentage}
              <small>%</small>
            </Typography>
          </StatCard>
        </div>

        {/* Updated timestamp */}
        {/* <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(17, 179, 174, 0.1)' }}>
          <Typography sx={{ color: '#666', fontSize: '0.75rem', textAlign: 'center' }}>
            Updated:&nbsp;
            {Object.keys(data).length > 0 && data.updatedAt &&
              data.updatedAt.substr(0, 10) + ' ' + data.updatedAt.substr(11, 5)}
          </Typography>
        </Box> */}
      </div>
    </div>
  );
};

export default AccountDetails;
