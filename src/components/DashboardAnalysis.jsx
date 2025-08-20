import * as React from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../utils/formatNumber';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';
import { useLoading } from '../contexts/loadingContext';

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

const DashboardAnalysis = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = React.useState([]);
  // const [loading, setLoading] = React.useState(true);
  const { loading } = useLoading();

  React.useEffect(() => {
    async function fetchAccounts() {
      try {
        loading(true);
        const res = await api.get('/account/accounts?page=1&pagecount=100&sort=&type=');
        const accountsData = res.data.data;
        
        // Fetch detailed info for each account
        const accountsWithDetails = await Promise.all(
          accountsData.map(async (account) => {
            try {
              // Fetch account details (for growth data)
              const accountDetailsRes = await api.get(`/account/accounts/${account.accountId}`);
              // Fetch account info (for commission, swap, etc.)
              const accountInfoRes = await api.get(`/account/accountInfo/${account.accountId}`);
              
              return {
                ...account,
                accountDetails: accountDetailsRes.data,
                accountInfo: accountInfoRes.data
              };
            } catch (error) {
              console.error(`Error fetching account details for ${account.accountId}:`, error);
              return {
                ...account,
                accountDetails: {},
                accountInfo: {}
              };
            }
          })
        );
        setAccounts(accountsWithDetails);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        loading(false);
      } finally {
        // setLoading(false);
        loading(false);
      }
    }

    fetchAccounts();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="mt-4 text-[#E9D8C8] bg-[#0B1220] p-3 sm:p-6 rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)] pb-[20px]">
  //       <div className="flex items-center justify-center h-32">
  //         <Typography sx={{ color: '#E9D8C8' }}>
  //           Loading analysis data...
  //         </Typography>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="mt-4 text-[#E9D8C8] bg-[#0B1220] p-3 sm:p-6 rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)] pb-[20px]">
      {/* Content */}
      <div className="p-4">
        <TableContainer
          sx={{
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            maxWidth: '100%',
            overflowX: 'auto',
            '.MuiTable-root': {
              borderColor: 'rgba(17, 179, 174, 0.2)',
              borderWidth: '1px',
              minWidth: { xs: '600px', sm: 'auto' },
            },
          }}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{
              borderRadius: '12px',
              '& .MuiTableCell-root': {
                color: '#E9D8C8',
                backgroundColor: 'transparent',
                borderColor: 'rgba(17, 179, 174, 0.15)',
                fontSize: '0.875rem',
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                backgroundColor: 'rgba(17, 179, 174, 0.1)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderColor: 'rgba(17, 179, 174, 0.2)',
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: 'rgba(17, 179, 174, 0.05)',
              },
            }}
          >
            <TableHead sx={{
              borderRadius: '12px',
            }}>
              <TableRow
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 1,
                    borderColor: 'rgba(17, 179, 174, 0.2)',
                  },
                }}
              >
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Account</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Growth %</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Profit</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Balance</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Equity</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Trades</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Won</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Lost</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Lots</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Com</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Swap</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Deposits</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Withdrawals</p>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  <div className="flex items-center justify-between p-[6px]">
                    <p className="font-semibold">Actions</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '&:last-child td, &:last-child th': {
                  border: 1,
                  borderColor: 'rgba(17, 179, 174, 0.15)',
                },
              }}
            >
              {accounts.map((account, index) => {
                const accountInfo = account.accountInfo || {};
                const accountDetails = account.accountDetails || {};
                const growth = parseFloat(accountDetails.growth) || 0;
                
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`dashboard_analysis_row_${index}`}
                    sx={{
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(17, 179, 174, 0.08)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                      },
                    }}
                  >
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div>
                        <div className="font-medium">{account.name || account.accountName}</div>
                        <div className="text-xs text-gray-400">{account.login}</div>
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <span style={{ 
                        color: growth > 0 ? '#47A447' : growth < 0 ? '#f40b0b' : '#E9D8C8'
                      }}>
                        {growth.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {formatNumber(accountDetails.profit || account.profit || account.totalProfit || 0)} USD
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {accountDetails.balance ? accountDetails.balance.toFixed(2) : account.balance ? account.balance.toFixed(2) : '0.00'} USD
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {accountDetails.equity ? accountDetails.equity.toFixed(2) : account.equity ? account.equity.toFixed(2) : '0.00'} USD
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {accountInfo.totalTrades || 0}
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {accountInfo.winCount || 0}
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {accountInfo.loseCount || 0}
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {formatNumber(accountInfo.lots || 0)}
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {formatNumber(accountInfo.commission || 0)} USD
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {formatNumber(accountInfo.swap || 0)} USD
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {accountInfo.deposits ? accountInfo.deposits.toFixed(2) : '0.00'} USD
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div className="truncate font-medium">
                        {accountInfo.withdrawals ? accountInfo.withdrawals.toFixed(2) : '0.00'} USD
                      </div>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: '12px 8px',
                      }}
                    >
                      <Link to={`/analysis/analysis-account/${account.accountId}`}>
                        <IconButton
                          size="small"
                          color="inherit"
                          sx={{
                            backgroundColor: '#11B3AE',
                            borderRadius: '8px',
                            fontSize: 14,
                            padding: '10px 8px',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: '#0F9A95',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                            },
                          }}
                        >
                          <Icon icon="fa:bar-chart" color="white" />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        {accounts.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <Typography sx={{ color: '#E9D8C8' }}>
              No accounts found
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalysis; 