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

const AccountAnalysisStats = ({ accountData, accountInfo }) => {
  return (
    <div className="h-full">
      {/* Tab Header */}
      <div className="p-4 border-b border-[#11B3AE] border-opacity-20">
        <StyledTab active={true}>
          Account Analysis
        </StyledTab>
      </div>

      {/* Content */}
      <div className="p-4">
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
                <StyledTableCell>Account</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountData).length > 0 && accountData.name}
                </StyledTableCell>
                <StyledTableCell>Growth %</StyledTableCell>
                <StyledTableCell>
                  <span style={{ 
                    color: Object.keys(accountData).length > 0 && accountData.growth ? 
                      (accountData.growth > 0 ? '#47A447' : accountData.growth < 0 ? '#f40b0b' : '#E9D8C8') : '#E9D8C8'
                  }}>
                    {Object.keys(accountData).length > 0 && accountData.growth}%
                  </span>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Profit</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountData).length > 0 && formatNumber(accountData.profit)} USD
                </StyledTableCell>
                <StyledTableCell>Balance</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountData).length > 0 && accountData.balance.toFixed(2)} USD
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Equity</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountData).length > 0 && accountData.equity.toFixed(2)} USD
                </StyledTableCell>
                <StyledTableCell>Trades</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && accountInfo.totalTrades}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Won</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && accountInfo.winCount}
                </StyledTableCell>
                <StyledTableCell>Lost</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && accountInfo.loseCount}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Lots</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && formatNumber(accountInfo.lots)}
                </StyledTableCell>
                <StyledTableCell>Commission</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && formatNumber(accountInfo.commission || 0)} USD
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Swap</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && formatNumber(accountInfo.swap || 0)} USD
                </StyledTableCell>
                <StyledTableCell>Deposits</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && accountInfo.deposits.toFixed(2)} USD
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Withdrawals</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && accountInfo.withdrawals.toFixed(2)} USD
                </StyledTableCell>
                <StyledTableCell>Win %</StyledTableCell>
                <StyledTableCell>
                  {Object.keys(accountInfo).length > 0 && (
                    <>
                      {formatNumber(accountInfo.winPercentage)}%
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>
                        {' '}({accountInfo.winCount} of {accountInfo.totalTrades})
                      </span>
                    </>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AccountAnalysisStats; 