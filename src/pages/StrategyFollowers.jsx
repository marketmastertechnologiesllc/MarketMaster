import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Icon } from '@iconify/react';

import useToast from '../hooks/useToast';
import api from '../utils/api';

const initialHeaders = {
  followers: [
    { id: 'followerName', label: 'Follower Name', checked: true },
    { id: 'followerId', label: 'Follower ID', checked: true },
    { id: 'entityId', label: 'Entity ID', checked: true },
    { id: 'email', label: 'Email', checked: true },
    { id: 'account', label: 'Account', checked: true },
    { id: 'emailAlerts', label: 'Email Alerts', checked: true },
    { id: 'tradeCopier', label: 'Trade Copier', checked: true },
    { id: 'accessTerms', label: 'Access Terms', checked: true },
    { id: 'expires', label: 'Expires', checked: true },
    { id: 'actions', label: 'Actions', checked: true },
  ],
  deleted: [
    { id: 'deleted', label: 'Deleted', checked: true },
    { id: 'followerName', label: 'Follower Name', checked: true },
    { id: 'followerId', label: 'Follower ID', checked: true },
    { id: 'entityId', label: 'Entity ID', checked: true },
    { id: 'email', label: 'Email', checked: true },
    { id: 'account', label: 'Account', checked: true },
    { id: 'emailAlerts', label: 'Email Alerts', checked: true },
    { id: 'tradeCopier', label: 'Trade Copier', checked: true },
    { id: 'accessTerms', label: 'Access Terms', checked: true },
    { id: 'expires', label: 'Expires', checked: true },
    { id: 'actions', label: 'Actions', checked: true },
  ],
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(17, 179, 174, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(17, 179, 174, 0.5)',
  },
  '&:focus-within': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid #11B3AE',
    boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#E9D8C8',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#E9D8C8',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#E9D8C8',
    opacity: 0.7,
  },
}));

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

function StrategyFollowers() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [deletedFollowers, setDeletedFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [headers, setHeaders] = useState(initialHeaders);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Mock data for demonstration - replace with actual API calls
  const mockFollowers = [
    {
      id: 1,
      followerName: 'Profile cutting edge',
      followerId: 'eTEsi6sfXM',
      entityId: '268298',
      email: 'cutting.edge.1010101@gmail.com',
      account: 'Crypto algo master (1285318)',
      emailAlerts: false,
      tradeCopier: false,
      accessTerms: 'Non billable access',
      expires: null
    }
  ];
  const mockDeletedFollowers = [
    {
      id: 1,
      deleted: '2025-02-23 08:03:47',
      followerName: 'User not found',
      followerId: 'N/A',
      entityId: 'User not found',
      email: 'User not found',
      account: 'Account no longer exists',
      emailAlerts: true,
      tradeCopier: false,
      accessTerms: 'Non billable access',
      expires: null
    },
    {
      id: 2,
      deleted: '2025-03-05 08:00:05',
      followerName: 'User not found',
      followerId: 'N/A',
      entityId: 'User not found',
      email: 'User not found',
      account: 'Account no longer exists',
      emailAlerts: true,
      tradeCopier: true,
      accessTerms: 'Non billable access',
      expires: '2025-03-11'
    },
    {
      id: 3,
      deleted: '2025-03-17 00:34:44',
      followerName: 'User not found',
      followerId: 'N/A',
      entityId: 'User not found',
      email: 'User not found',
      account: 'Account no longer exists',
      emailAlerts: true,
      tradeCopier: true,
      accessTerms: 'Non billable access',
      expires: null
    }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab, page, rowsPerPage]);

  const loadData = async () => {
    setIsLoading(true);
    setIsDataLoading(true);
    try {
      if (activeTab === 'followers') {
        // Replace with actual API call
        // const response = await api.get(`/followers?page=${page}&limit=${rowsPerPage}&search=${searchTerm}`);
        // setFollowers(response.data.data);
        // setTotalCount(response.data.count);
        setFollowers(mockFollowers);
        setTotalCount(1);
      } else {
        // Replace with actual API call
        // const response = await api.get(`/followers/deleted?page=${page}&limit=${rowsPerPage}&search=${searchTerm}`);
        // setDeletedFollowers(response.data.data);
        // setTotalCount(response.data.count);
        setDeletedFollowers(mockDeletedFollowers);
        setTotalCount(3);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
      setIsDataLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleAddFollower = () => {
    navigate('/strategy-followers/add');
  };

  const getHeaders = () => {
    return headers[activeTab];
  };

  const getCurrentData = () => {
    return activeTab === 'followers' ? followers : deletedFollowers;
  };

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleEditFollower = (followerId) => {
    navigate(`/strategy-followers/details/${followerId}`);
  };

  const handleDeleteFollower = (followerData) => {
    setSelectedFollower(followerData);
    setConfirmRemove(false);
    setShowRemoveModal(true);
  };

  const handleRemoveFollower = async () => {
    if (!confirmRemove) {
      showToast('Please confirm by checking the checkbox', 'error');
      return;
    }

    try {
      // Replace with actual API call
      // await api.delete(`/followers/${selectedFollower.followerId}`);
      showToast('Follower removed successfully!', 'success');
      setShowRemoveModal(false);
      setSelectedFollower(null);
      setConfirmRemove(false);
      loadData();
    } catch (error) {
      console.error('Error removing follower:', error);
      showToast('Failed to remove follower', 'error');
    }
  };

  return (
    <div className="w-auto text-[#E9D8C8]">
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        display={'flex'}
        justifyContent={'space-between'}
        className="relative"
      >
        <div className="absolute right-0 top-0 flex gap-2">
          <Link to="/strategy-followers/add">
            <StyledButton
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: '#11B3AE!important',
                color: '#FFFFFF!important',
                fontWeight: 500,
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#0F9A95!important',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
              }}
            >
              Add Follower
            </StyledButton>
          </Link>
        </div>
      </Stack>

      {/* Tabs */}
      <div className="flex gap-2">
        <StyledButton
          variant="contained"
          size="small"
          sx={{
            backgroundColor: activeTab == 'followers' ? '#11B3AE' : '#0B1220',
            color: activeTab == 'followers' ? '#FFFFFF' : '#E9D8C8',
            border: activeTab == 'followers' ? '1px solid #11B3AE' : '1px solid rgba(17, 179, 174, 0.3)',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: activeTab == 'followers' ? '#0F9A95' : 'rgba(17, 179, 174, 0.1)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
            },
          }}
          onClick={() => setActiveTab('followers')}
        >
          Followers
        </StyledButton>
        <StyledButton
          onClick={() => setActiveTab('deleted')}
          variant="contained"
          sx={{
            backgroundColor: activeTab == 'deleted' ? '#11B3AE' : '#0B1220',
            color: activeTab == 'deleted' ? '#FFFFFF' : '#E9D8C8',
            border: activeTab == 'deleted' ? '1px solid #11B3AE' : '1px solid rgba(17, 179, 174, 0.3)',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: activeTab == 'deleted' ? '#0F9A95' : 'rgba(17, 179, 174, 0.1)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
            },
          }}
        >
          Deleted Followers
        </StyledButton>
      </div>

      <div className="mt-4 text-[#E9D8C8] bg-[#0B1220] p-3 sm:p-6 rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)] pb-[20px]">
        <div className="flex flex-col sm:flex-row justify-between w-full pb-4 gap-4">
          <div className="flex items-center gap-3">
            <FormControl size="small">
              <Select
                displayEmpty
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                disabled={isDataLoading}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#0B1220',
                      border: '1px solid rgba(17, 179, 174, 0.3)',
                      borderRadius: '8px',
                      maxHeight: '200px',
                      '& .MuiMenuItem-root': {
                        color: '#E9D8C8',
                        '&:hover': {
                          backgroundColor: 'rgba(17, 179, 174, 0.1)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#11B3AE',
                          color: '#FFFFFF',
                          '&:hover': {
                            backgroundColor: '#0F9A95',
                          },
                        },
                      },
                    },
                  },
                }}
                input={
                  <OutlinedInput
                    sx={{
                      width: { xs: '70px', sm: '80px' },
                      color: isDataLoading ? '#666' : '#E9D8C8',
                      borderRadius: '8px',
                      backgroundColor: isDataLoading ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDataLoading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 179, 174, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDataLoading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 179, 174, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDataLoading ? 'rgba(255, 255, 255, 0.1)' : '#11B3AE',
                        boxShadow: isDataLoading ? 'none' : '0 0 0 2px rgba(17, 179, 174, 0.2)',
                      },
                      '& .MuiSelect-icon': {
                        color: isDataLoading ? '#666' : '#E9D8C8',
                      },
                    }}
                  />
                }
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Typography sx={{ 
              color: '#E9D8C8', 
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              records per page
            </Typography>
          </div>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={isDataLoading}
            />
          </Search>
        </div>

        {/* Empty State */}
        {getCurrentData().length === 0 && activeTab === 'followers' && !isDataLoading ? (
          <div className="text-center py-8">
            <h3 className="text-[#E9D8C8] text-xl mb-4 font-semibold">There are currently no users following your strategy</h3>
            <p className="text-[#E9D8C8] opacity-80 mb-6">
              You can offer your trading expertise out to other people by creating a strategy provider page from your account.
            </p>
            <StyledButton
              variant="contained"
              onClick={handleAddFollower}
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
              <Icon icon="typcn:plus" width="16" height="16" style={{ marginRight: '4px' }} />
              Add Follower
            </StyledButton>
          </div>
        ) : (
          <Paper
            sx={{
              width: '100%',
              overflow: 'hidden',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          >
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
                    {getHeaders()
                      .filter((item) => item.checked && item.id !== 'actions')
                      .map(({ label, id }, index) => (
                      <TableCell
                        key={`strategy_followers_table_header_${index}`}
                        align="center"
                        sx={{
                          padding: '12px 8px',
                          fontWeight: 600,
                        }}
                      >
                        <div className="flex items-center justify-between p-[6px]">
                          {label === '' ? <p></p> : <p className="font-semibold">{label}</p>}
                          <div className="flex flex-col cursor-pointer">
                            <Icon
                              icon="teenyicons:up-solid"
                              color="#11B3AE"
                              className="mb-[-4px] hover:text-[#E9D8C8] transition-colors"
                              width={11}
                            />
                            <Icon
                              icon="teenyicons:down-solid"
                              width={11}
                              color="#11B3AE"
                              className="hover:text-[#E9D8C8] transition-colors"
                            />
                          </div>
                        </div>
                      </TableCell>
                    ))}
                    <TableCell
                      key={'option'}
                      align="center"
                      sx={{
                        padding: '12px 8px',
                        fontWeight: 600,
                      }}
                    ></TableCell>
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
                  {isDataLoading ? (
                    <TableRow>
                      <TableCell 
                        colSpan={getHeaders().filter(item => item.checked).length} 
                        align="center"
                        sx={{
                          padding: '60px 20px',
                          border: 'none',
                        }}
                      >
                        <div className="flex flex-col justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11B3AE] mb-4"></div>
                          <span className="text-[#E9D8C8] text-lg font-medium">Loading followers...</span>
                          <span className="text-[#E9D8C8] text-sm opacity-70 mt-1">Please wait while we fetch your follower data</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : getCurrentData() && getCurrentData().length > 0 ? (
                    getCurrentData().map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={`strategy_followers_table_row_${index}`}
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(17, 179, 174, 0.08)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                            },
                          }}
                        >
                          {getHeaders()
                            .filter((item) => item.checked && item.id !== 'actions')
                            .map(({ id }) => {
                            let value = row[id];
                            if (id === 'emailAlerts' || id === 'tradeCopier') {
                              value = row[id] ? 'Yes' : 'No';
                            } else if (id === 'expires') {
                              value = row[id] || 'No';
                            } else if (id === 'account' && activeTab === 'deleted') {
                              value = <span style={{ color: '#fa5252' }}>{row[id]}</span>;
                            }
                            return (
                              <TableCell
                                key={id + row.id}
                                align="left"
                                sx={{
                                  padding: '12px 16px',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {id === 'emailAlerts' || id === 'tradeCopier' ? (
                                  <Icon
                                    icon={row[id] ? 'mdi:check-bold' : 'mdi:close-bold'}
                                    width={22}
                                    className="font-bold"
                                    color={row[id] ? '#11B3AE' : '#fa5252'}
                                  />
                                ) : (
                                  <div className="truncate font-medium">{value}</div>
                                )}
                              </TableCell>
                            );
                          })}
                          {getHeaders().find(({ id }) => id === 'actions').checked && (
                            <TableCell
                              key={row.id + 'option'}
                              align="center"
                              sx={{
                                padding: '12px 8px',
                              }}
                            >
                              <div className="flex gap-2 justify-center">
                                <IconButton
                                  size="small"
                                  color="inherit"
                                  sx={{
                                    backgroundColor: '#11B3AE',
                                    borderRadius: '8px',
                                    fontSize: 16,
                                    padding: '10px 10px',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                      backgroundColor: '#0F9A95',
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                                    },
                                  }}
                                  onClick={() => handleEditFollower(row.id)}
                                >
                                  <Icon icon="fa:cogs" color="white" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="inherit"
                                  sx={{
                                    backgroundColor: '#fa5252',
                                    borderRadius: '8px',
                                    fontSize: 16,
                                    padding: '10px 10px',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                      backgroundColor: '#e03131',
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 4px 12px rgba(250, 82, 82, 0.3)',
                                    },
                                  }}
                                  onClick={() => handleDeleteFollower({
                                    followerName: row.followerName,
                                    followerId: row.id,
                                  })}
                                >
                                  <Icon icon="ion:trash-sharp" color="white" />
                                </IconButton>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell 
                        colSpan={getHeaders().filter(item => item.checked).length} 
                        align="center"
                        sx={{
                          padding: '60px 20px',
                          border: 'none',
                        }}
                      >
                        <div className="flex flex-col justify-center items-center">
                          <span className="text-[#E9D8C8] text-lg font-medium">No followers found</span>
                          <span className="text-[#E9D8C8] text-sm opacity-70 mt-1">Try adjusting your search criteria</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="flex justify-between items-center mt-4">
              <Typography sx={{ color: '#E9D8C8', fontSize: { xs: 12, sm: 14 }, fontWeight: 500 }}>
                Showing {rowsPerPage * (page - 1) + 1} to{' '}
                {rowsPerPage * page > totalCount ? totalCount : rowsPerPage * page} of{' '}
                {totalCount} entries
              </Typography>
              <Pagination
                sx={{
                  paddingY: 2,
                  '& .MuiPaginationItem-root': {
                    color: '#E9D8C8',
                    borderColor: 'rgba(17, 179, 174, 0.3)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minWidth: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    '&:hover': {
                      backgroundColor: 'rgba(17, 179, 174, 0.2)',
                      color: '#E9D8C8',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#11B3AE',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#0F9A95',
                      },
                    },
                  },
                }}
                count={
                  totalCount % rowsPerPage === 0
                    ? totalCount / rowsPerPage
                    : Math.floor(totalCount / rowsPerPage) + 1
                }
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </div>
          </Paper>
        )}
      </div>

      {/* Remove Follower Modal */}
      {showRemoveModal && selectedFollower && (
        <div className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1201]">
          <div
            className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1202] bg-opacity-90 bg-[#0e1013]"
            onClick={() => setShowRemoveModal(false)}
          ></div>
          <section className="mb-[20px] rounded-xl bg-[#0B1220] w-[500px] z-[100000] border border-[#11B3AE] shadow-[0_0_32px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Remove follower access</h2>
              <button
                className="bg-[#11B3AE] hover:bg-[#0F9A95] w-[33px] h-[33px] rounded font-extrabold text-white transition-all duration-200"
                onClick={() => setShowRemoveModal(false)}
              >
                ✖
              </button>
            </header>
            <div className="p-[15px] bg-[#0B1220] text-[#E9D8C8] text-center">
              <p className="pb-[10px] text-sm">
                Are you sure you want revoke access for <font className="font-bold">{selectedFollower.followerName}</font>?
              </p>
              <p className="text-[13px] text-[#E9D8C8] opacity-80 mb-[10px]">
                Any configured trade alerts and trade copiers relating to this strategy will be deleted.
              </p>
              <p className="text-[13px] text-[#E9D8C8] opacity-80 mb-[10px]">
                <b>This process can not be undone.</b>
              </p>
              <label className="flex gap-2 justify-center items-center mb-[25px]">
                <input
                  type="checkbox"
                  id="confirm-remove"
                  checked={confirmRemove}
                  onChange={(e) => setConfirmRemove(e.target.checked)}
                  className="accent-[#11B3AE]"
                />
                <span className="text-[13px] text-[#E9D8C8]">Are you sure?</span>
              </label>
            </div>
            <footer className="px-4 py-3 text-[#E9D8C8] flex justify-end items-center border-t border-[#11B3AE] border-opacity-20">
              <StyledButton
                variant="contained"
                disabled={!confirmRemove}
                onClick={handleRemoveFollower}
                sx={{
                  backgroundColor: confirmRemove ? '#fa5252!important' : '#666!important',
                  color: '#FFFFFF!important',
                  fontWeight: 500,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: confirmRemove ? '#e03131!important' : '#666!important',
                    transform: 'translateY(-1px)',
                    boxShadow: confirmRemove ? '0 4px 12px rgba(250, 82, 82, 0.3)' : 'none',
                  },
                  '&:disabled': {
                    backgroundColor: '#666!important',
                    color: '#999!important',
                  },
                }}
              >
                Remove
              </StyledButton>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default StrategyFollowers;



