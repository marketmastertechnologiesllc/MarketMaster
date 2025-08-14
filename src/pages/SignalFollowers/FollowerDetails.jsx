import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

const initialHeaders = {
  transactions: [
    { id: 'date', label: 'Date', checked: true },
    { id: 'type', label: 'Type', checked: true },
    { id: 'expiry', label: 'Expiry', checked: true },
    { id: 'payment', label: 'Payment', checked: true },
    { id: 'amount', label: 'Amount', checked: true },
    { id: 'comments', label: 'Comments', checked: true },
  ],
};

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

function FollowerDetails() {
  const { followerId } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [follower, setFollower] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showMaxTradeCopiersModal, setShowMaxTradeCopiersModal] = useState(false);
  const [maxTradeCopiers, setMaxTradeCopiers] = useState(1);
  const [headers, setHeaders] = useState(initialHeaders);

  // Mock data for demonstration
  const mockFollower = {
    id: followerId,
    followerName: 'Profile cutting edge',
    entityId: '268298',
    account: 'Crypto algo master (1285318)',
    accessRights: 'Follow only',
    maxTradeCopiers: 1,
    terms: 'Non billable access'
  };

  const mockTransactions = [
    {
      id: 1,
      date: '2025-03-05',
      type: 'Removed by provider',
      expiry: '',
      payment: '',
      amount: '',
      comments: ''
    }
  ];

  useEffect(() => {
    loadFollowerData();
    loadTransactions();
  }, [followerId]);

  const loadFollowerData = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get(`/followers/${followerId}`);
      // setFollower(response.data);
      setFollower(mockFollower);
      setMaxTradeCopiers(mockFollower.maxTradeCopiers);
    } catch (error) {
      console.error('Error loading follower data:', error);
      showToast('Failed to load follower data', 'error');
    }
  };

  const loadTransactions = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get(`/followers/${followerId}/transactions`);
      // setTransactions(response.data);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      showToast('Failed to load transactions', 'error');
    }
  };

  const handleUpdateMaxTradeCopiers = async () => {
    try {
      // Replace with actual API call
      // await api.put(`/followers/${followerId}/max-trade-copiers`, { maxTradeCopiers });
      showToast('Max trade copiers updated successfully!', 'success');
      setShowMaxTradeCopiersModal(false);
      loadFollowerData();
    } catch (error) {
      console.error('Error updating max trade copiers:', error);
      showToast('Failed to update max trade copiers', 'error');
    }
  };

  if (!follower) {
    return <div className="text-center py-8 text-[#E9D8C8]">Loading...</div>;
  }

  return (
    <div className="w-auto text-[#E9D8C8]">
      <div className="py-0 px-0">
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Follower Details Panel */}
          <div className="flex flex-col w-full lg:min-w-[400px] lg:max-w-[400px] mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Follower Details</h2>
            </header>
            <div className="box-border p-[15px] bg-[#0B1220]">
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Profile Name
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <p className="text-[#E9D8C8] text-sm">{follower.followerName}</p>
                </div>
              </div>

              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Account
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <p className="text-[#E9D8C8] text-sm">{follower.account}</p>
                </div>
              </div>

              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Access
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <p className="text-[#E9D8C8] text-sm">{follower.accessRights}</p>
                </div>
              </div>

              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Max Copiers
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <p className="text-[#E9D8C8] text-sm">{follower.maxTradeCopiers}</p>
                    </div>
                    <IconButton
                      size="small"
                      onClick={() => setShowMaxTradeCopiersModal(true)}
                      sx={{
                        backgroundColor: '#11B3AE',
                        borderRadius: '8px',
                        fontSize: 15,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#0F9A95',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                        },
                      }}
                    >
                      <Icon icon="fa:cogs" color="white" />
                    </IconButton>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                  Terms
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <p className="text-[#E9D8C8] text-sm">{follower.terms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Panel */}
          <div className="flex flex-col w-full mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Transactions</h2>
            </header>
            <div className="box-border p-[15px] bg-[#0B1220]">
              {transactions.length === 0 ? (
                <p className="text-[#E9D8C8] text-sm opacity-80">No transactions have happened.</p>
              ) : (
                <Paper
                  sx={{
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '& .MuiPaper-root': {
                      color: '#E9D8C8',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <TableContainer
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      maxWidth: '100%',
                      overflowX: 'auto',
                      borderColor: 'rgba(17, 179, 174, 0.2)',
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
                          color: '#E9D8C8',
                          fontWeight: 600,
                          borderColor: 'rgba(17, 179, 174, 0.2)',
                        },
                        '& .MuiTableRow-root:hover': {
                          backgroundColor: 'rgba(17, 179, 174, 0.08)',
                          transition: 'all 0.2s ease-in-out',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                        },
                      }}
                    >
                      <TableHead>
                        <TableRow
                          sx={{
                            borderColor: 'rgba(17, 179, 174, 0.2)',
                          }}
                        >
                          {headers.transactions
                            .filter((item) => item.checked)
                            .map(({ label, id }, index) => (
                              <TableCell
                                key={`transactions_table_header_${index}`}
                                align="center"
                                sx={{
                                  padding: '12px 8px',
                                  fontWeight: 600,
                                }}
                              >
                                <div className="flex items-center justify-between p-[3px]">
                                  {label === '' ? <p></p> : <p>{label}</p>}
                                  <div className="flex flex-col cursor-pointer">
                                    <Icon
                                      icon="teenyicons:up-solid"
                                      color="#11B3AE"
                                      className="mb-[-4px] hover:text-[#E9D8C8]"
                                      width={11}
                                    />
                                    <Icon
                                      icon="teenyicons:down-solid"
                                      width={11}
                                      color="#11B3AE"
                                      className="hover:text-[#E9D8C8]"
                                    />
                                  </div>
                                </div>
                              </TableCell>
                            ))}
                        </TableRow>
                      </TableHead>
                      <TableBody
                        sx={{
                          borderColor: 'rgba(17, 179, 174, 0.15)',
                        }}
                      >
                        {transactions.map((transaction) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={transaction.id}
                          >
                            {headers.transactions
                              .filter((item) => item.checked)
                              .map(({ id }) => (
                                <TableCell
                                  key={id + transaction.id}
                                  align="left"
                                  sx={{
                                    padding: '12px 8px',
                                    fontSize: '0.875rem',
                                  }}
                                >
                                  <div className="truncate">{transaction[id]}</div>
                                </TableCell>
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Max Trade Copiers Modal */}
      {showMaxTradeCopiersModal && (
        <div className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1201]">
          <div
            className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1202] bg-opacity-90 bg-[#0e1013]"
            onClick={() => setShowMaxTradeCopiersModal(false)}
          ></div>
          <section className="mb-[20px] rounded-xl bg-[#0B1220] w-[500px] z-[100000] border border-[#11B3AE] shadow-[0_0_32px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Adjust Max Trade Copiers</h2>
              <button
                className="bg-[#11B3AE] hover:bg-[#0F9A95] w-[33px] h-[33px] rounded font-extrabold text-white transition-all duration-200"
                onClick={() => setShowMaxTradeCopiersModal(false)}
              >
                ✖
              </button>
            </header>
            <div className="p-[15px] bg-[#0B1220] text-[#E9D8C8]">
              <p className="pb-[10px] text-sm opacity-80">
                By default signal followers that have trade copy rights, can only create one trade copier per signal account. If required you can manually override the maximum amount of trade copiers to a required value.
              </p>

              <div className="mb-[25px]">
                <label className="block text-[#E9D8C8] text-[13px] mb-2 font-medium">
                  Max Trade Copiers
                </label>
                <input
                  type="number"
                  value={maxTradeCopiers}
                  onChange={(e) => setMaxTradeCopiers(parseInt(e.target.value) || 1)}
                  className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                  min="1"
                />
              </div>
            </div>
            <footer className="px-4 py-3 text-[#E9D8C8] flex justify-end items-center border-t border-[#11B3AE] border-opacity-20">
              <StyledButton
                variant="contained"
                onClick={handleUpdateMaxTradeCopiers}
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
                }}
              >
                Update
              </StyledButton>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default FollowerDetails; 