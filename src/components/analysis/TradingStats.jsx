import * as React from 'react';
import { formatNumber } from '../../utils/formatNumber';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#E9D8C8',
  backgroundColor: 'transparent',
  borderColor: 'rgba(17, 179, 174, 0.15)',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '12px 16px',
  '&.MuiTableCell-head': {
    backgroundColor: 'rgba(17, 179, 174, 0.1)',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderColor: 'rgba(17, 179, 174, 0.2)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(17, 179, 174, 0.05)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TradingStats = ({ data }) => {
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
            Stats
          </StyledTab>
          <StyledTab 
            active={tab === 2}
            onClick={() => setTab(2)}
          >
            Profile
          </StyledTab>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {tab === 1 && (
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              borderRadius: '12px',
              border: '1px solid rgba(17, 179, 174, 0.2)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Metric</StyledTableCell>
                  <StyledTableCell>Value</StyledTableCell>
                  <StyledTableCell>Metric</StyledTableCell>
                  <StyledTableCell>Value</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell>Total Trades</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.totalTrades}
                  </StyledTableCell>
                  <StyledTableCell>Shorts Won</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && (
                      <>
                        {data.shortsWonCount}
                        <span style={{ fontSize: '0.75rem', color: '#666' }}> of</span> {data.shortsCount}
                      </>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell>Win %</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && (
                      <>
                        {formatNumber(data.winPercentage)}%{' '}
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>
                          {data.winCount} of {data.totalTrades}
                        </span>
                      </>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>Best Trade</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && (
                      <>
                        {data.bestTradeProfit} USD (
                        {data.bestTradeDate.substr(0, 10)})
                      </>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell>Loss %</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && (
                      <>
                        {formatNumber(data.lostPercentage)}%{' '}
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>
                          {data.loseCount} of {data.totalTrades}
                        </span>
                      </>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>Worst Trade</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && (
                      <>
                        {formatNumber(data.worstTradeProfit)} USD (
                        {data.worstTradeDate.substr(0, 10)})
                      </>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell>Lots</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && formatNumber(data.lots)}
                  </StyledTableCell>
                  <StyledTableCell>Average Win</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && (
                      <>{formatNumber(data.averageWon)} USD</>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell>Longs Won</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && (
                      <>
                        {data.longsWonCount}
                        <span style={{ fontSize: '0.75rem', color: '#666' }}> of</span> {data.longsCount}
                      </>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>Average Loss</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && (
                      <>{data.averageLoss} USD</>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 2 && (
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              borderRadius: '12px',
              border: '1px solid rgba(17, 179, 174, 0.2)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Metric</StyledTableCell>
                  <StyledTableCell>Value</StyledTableCell>
                  <StyledTableCell>Metric</StyledTableCell>
                  <StyledTableCell>Value</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell>Balance</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.balance.toFixed(2)} USD
                  </StyledTableCell>
                  <StyledTableCell>Broker Server</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.server}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell>Deposits</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.deposits.toFixed(2)} USD
                  </StyledTableCell>
                  <StyledTableCell>Leverage</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.leverage} : 1
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell>Withdrawals</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.withdrawals.toFixed(2)} USD
                  </StyledTableCell>
                  <StyledTableCell>Credit</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.credit}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell>Broker</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.broker}
                  </StyledTableCell>
                  <StyledTableCell>Account Type</StyledTableCell>
                  <StyledTableCell>
                    {Object.keys(data).length > 0 && data.accountType}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default TradingStats;
