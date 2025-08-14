import * as React from 'react';
import OpenTradeTable from '../Tables/OpenTradeTable';
import CloseTradeTable from '../Tables/CloseTradeTable';
import { styled } from '@mui/material/styles';

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

const TradesAnalysis = () => {
  const [tab, setTab] = React.useState(1);

  return (
    <div className="h-full">
      {/* Tab Header */}
      <div className="p-4 border-b border-[#11B3AE] border-opacity-20">
        <div className="flex space-x-1">
          <StyledTab 
            active={tab === 1}
            onClick={() => setTab(1)}
          >
            Open Trades
          </StyledTab>
          <StyledTab 
            active={tab === 2}
            onClick={() => setTab(2)}
          >
            Close Trades
          </StyledTab>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {tab === 1 && <OpenTradeTable />}
        {tab === 2 && <CloseTradeTable />}
      </div>
    </div>
  );
};

export default TradesAnalysis;
