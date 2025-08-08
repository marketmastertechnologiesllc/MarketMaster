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
  '&:hover': {
    backgroundColor: '#242830',
    boxShadow: 'none',
  },
  '&:active, &:focus, &.selected': {
    backgroundColor: '#0088cc',
    boxShadow: 'none',
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
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="py-0 px-0">
        <div className="pb-3">
          <Link
            to={'/signal-followers'}
            className="flex flex-row items-center font-extrabold"
          >
            <ReplyRoundedIcon
              fontSize="medium"
              sx={{ color: 'white', fontWeight: 'bold' }}
            />
            <h1 className="text-white text-lg pl-2"> Signal Followers</h1>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Follower Details Panel */}
          <div className="flex flex-col w-full lg:min-w-[400px] lg:max-w-[400px] mb-[20px] rounded bg-[#282D36] text-white">
            <header className="p-[18px]">
              <h2 className="mt-[5px] text-[20px] font-normal">Follower Details</h2>
            </header>
            <div className="box-border p-[15px] bg-[#2E353E]">
              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Profile Name
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <p className="text-white text-sm">{follower.followerName}</p>
                </div>
              </div>

              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Account
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <p className="text-white text-sm">{follower.account}</p>
                </div>
              </div>

              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Access
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <p className="text-white text-sm">{follower.accessRights}</p>
                </div>
              </div>

              <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Max Copiers
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <p className="text-white text-sm">{follower.maxTradeCopiers}</p>
                    </div>
                    <IconButton
                      size="small"
                      onClick={() => setShowMaxTradeCopiersModal(true)}
                      sx={{
                        backgroundColor: '#0099E6',
                        borderRadius: '4px',
                        fontSize: 15,
                      }}
                    >
                      <Icon icon="fa:cogs" color="white" />
                    </IconButton>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <label className="inline-block relative text-right w-2/5 pt-[7px] px-[15px] max-w-full text-[#ccc] text-[13px]">
                  Terms
                </label>
                <div className="flex items-center w-full px-[15px]">
                  <p className="text-white text-sm">{follower.terms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Panel */}
          <div className="flex flex-col w-full mb-[20px] rounded bg-[#282D36] text-white">
            <header className="p-[18px]">
              <h2 className="mt-[5px] text-[20px] font-normal">Transactions</h2>
            </header>
            <div className="box-border p-[15px] bg-[#2E353E]">
              {transactions.length === 0 ? (
                <p className="text-gray-300 text-sm">No transactions have happened.</p>
              ) : (
                <Paper
                  sx={{
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#2E353E',
                    boxShadow: 'none',
                    '& .MuiPaper-root': {
                      color: '#ccc',
                      backgroundColor: '#2E353E',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <TableContainer
                    sx={{
                      '.MuiTable-root': {
                        borderColor: '#282D36',
                        borderWidth: '1px',
                      },
                    }}
                  >
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                      sx={{
                        '& .MuiTableCell-root': {
                          color: '#ccc',
                          backgroundColor: '#2E353E',
                          border: '#282D36',
                        },
                      }}
                    >
                      <TableHead>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': {
                              border: 1,
                              borderColor: '#282D36',
                            },
                          }}
                        >
                          {headers.transactions
                            .filter((item) => item.checked)
                            .map(({ label, id }, index) => (
                              <TableCell
                                key={`transactions_table_header_${index}`}
                                align="center"
                                sx={{
                                  padding: '5px',
                                }}
                              >
                                <div className="flex items-center justify-between p-[3px]">
                                  {label === '' ? <p></p> : <p>{label}</p>}
                                  <div className="flex flex-col cursor-pointer">
                                    <Icon
                                      icon="teenyicons:up-solid"
                                      color="#ccc"
                                      className="mb-[-4px]"
                                      width={11}
                                    />
                                    <Icon
                                      icon="teenyicons:down-solid"
                                      width={11}
                                      color="#ccc"
                                    />
                                  </div>
                                </div>
                              </TableCell>
                            ))}
                        </TableRow>
                      </TableHead>
                      <TableBody
                        sx={{
                          '&:last-child td, &:last-child th': {
                            border: 1,
                            borderColor: '#282D36',
                          },
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
                                    padding: '5px',
                                    paddingLeft: 2,
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
          <section className="mb-[20px] rounded bg-[#282D36] w-[500px] z-[100000]">
            <header className="p-[18px] text-white flex justify-between items-center">
              <h2 className="mt-[5px] text-[20px] font-normal">Adjust Max Trade Copiers</h2>
              <button
                className="bg-[#0099e6] w-[33px] h-[33px] rounded font-extrabold"
                onClick={() => setShowMaxTradeCopiersModal(false)}
              >
                ✖
              </button>
            </header>
            <div className="p-[15px] bg-[#2E353E] text-white">
              <p className="pb-[10px] text-sm">
                By default signal followers that have trade copy rights, can only create one trade copier per signal account. If required you can manually override the maximum amount of trade copiers to a required value.
              </p>

              <div className="mb-[25px]">
                <label className="block text-[#ccc] text-[13px] mb-2">
                  Max Trade Copiers
                </label>
                <input
                  type="number"
                  value={maxTradeCopiers}
                  onChange={(e) => setMaxTradeCopiers(parseInt(e.target.value) || 1)}
                  className="block w-full h-[34px] text-sm bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                  min="1"
                />
              </div>
            </div>
            <footer className="px-4 py-3 text-white flex justify-end items-center">
              <StyledButton
                variant="contained"
                onClick={handleUpdateMaxTradeCopiers}
                sx={{
                  backgroundColor: '#0088CC',
                  '&:hover': { backgroundColor: '#006699' },
                  textTransform: 'none'
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