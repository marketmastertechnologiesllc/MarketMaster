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
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
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
}));

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

function SignalFollowers() {
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
    navigate('/signal-followers/add');
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
    navigate(`/signal-followers/details/${followerId}`);
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
    <div>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        display={'flex'}
        justifyContent={'space-between'}
        className="relative"
      >
        <div className="absolute right-0 top-0 flex gap-2">
          <Link to="/signal-followers/add">
            <StyledButton
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{
                textTransform: 'none',
                backgroundColor: '#0088CC!important',
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
            backgroundColor: activeTab == 'followers' ? '#0088CC' : '#282d36',
            textTransform: 'none',
          }}
          onClick={() => setActiveTab('followers')}
        >
          Followers
        </StyledButton>
        <StyledButton
          onClick={() => setActiveTab('deleted')}
          variant="contained"
          sx={{
            backgroundColor: activeTab == 'deleted' ? '#0088CC' : '#282d36',
            textTransform: 'none',
          }}
        >
          Deleted Followers
        </StyledButton>
      </div>

      <div className="mt-2 text-[#ccc] bg-[#2E353E] p-5 rounded pb-[10px]">
        <div className="flex justify-between w-full pb-3">
          <div className="flex items-center gap-2">
            <FormControl size="small">
              <Select
                displayEmpty
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                input={
                  <OutlinedInput
                    sx={{
                      width: '80px',
                      color: 'white',
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
            <Typography>records per page</Typography>
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
            />
          </Search>
        </div>

        {/* Empty State */}
        {getCurrentData().length === 0 && activeTab === 'followers' ? (
          <div className="text-center py-8">
            <h3 className="text-white text-xl mb-4">There are currently no users following your signal</h3>
            <p className="text-gray-300 mb-6">
              You can offer your trading expertise out to other people by creating a signal provider page from your account.
            </p>
            <StyledButton
              variant="contained"
              onClick={handleAddFollower}
              sx={{
                backgroundColor: '#0099e6',
                '&:hover': { backgroundColor: '#0088cc' },
                textTransform: 'none'
              }}
            >
              <Icon icon="typcn:plus" width="16" height="16" style={{ marginRight: '4px' }} />
              Add Follower
            </StyledButton>
            {/* <div className="mt-8">
              <h3 className="text-white text-xl mb-4">How do I manage signal followers?</h3>
              <p className="text-gray-300 mb-6">
                Here you can find the documentation on how to manage clients following your signal.
              </p>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#0099e6',
                  '&:hover': { backgroundColor: '#0088cc' },
                  textTransform: 'none'
                }}
              >
                Documentation
              </Button>
            </div> */}
          </div>
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
                {getHeaders()
                  .filter((item) => item.checked && item.id !== 'actions')
                  .map(({ label, id }, index) => (
                  <TableCell
                    key={`signal_followers_table_header_${index}`}
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
                <TableCell
                  key={'option'}
                  align="center"
                  sx={{
                    padding: '5px',
                  }}
                ></TableCell>
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
                  {getCurrentData() &&
                    getCurrentData().length > 0 &&
                    getCurrentData().map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={`signal_followers_table_row_${index}`}
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
                            value = <span style={{ color: '#d2322d' }}>{row[id]}</span>;
                          }
                          return (
                            <TableCell
                              key={id + row.id}
                              align="left"
                              sx={{
                                padding: '5px',
                                paddingLeft: 2,
                              }}
                            >
                              {id === 'emailAlerts' || id === 'tradeCopier' ? (
                                <Icon
                                  icon={row[id] ? 'mdi:check-bold' : 'mdi:close-bold'}
                                  width={22}
                                  className="font-bold"
                                  color={row[id] ? 'green' : '#D64742'}
                                />
                              ) : (
                                <div className="truncate">{value}</div>
                              )}
                            </TableCell>
                          );
                        })}
                        {getHeaders().find(({ id }) => id === 'actions').checked && (
                          <TableCell
                            key={row.id + 'option'}
                            align="center"
                            sx={{
                              padding: '5px',
                            }}
                          >
                            <div className="flex gap-2">
                              <IconButton
                                size="small"
                                color="inherit"
                                sx={{
                                  backgroundColor: '#0099E6',
                                  borderRadius: '4px',
                                  fontSize: 14,
                                  padding: '8px 6px',
                                }}
                                onClick={() => handleEditFollower(row.id)}
                              >
                                <Icon icon="fa:cogs" color="white" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="inherit"
                                sx={{
                                  backgroundColor: '#D64742',
                                  borderRadius: '4px',
                                  fontSize: 14,
                                  padding: '8px 6px',
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
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="flex justify-between items-center">
              <Typography sx={{ color: '#ccc', fontSize: 13 }}>
                Showing {rowsPerPage * (page - 1) + 1} to{' '}
                {rowsPerPage * page > totalCount ? totalCount : rowsPerPage * page} of{' '}
                {totalCount} entries
              </Typography>
              <Pagination
                sx={{
                  paddingY: 2,
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
            className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1202] bg-opacity-80 bg-[#1D2127]"
            onClick={() => setShowRemoveModal(false)}
          ></div>
          <section className="mb-[20px] rounded bg-[#282D36] w-[500px] z-[100000]">
            <header className="p-[18px] text-white flex justify-between items-center">
              <h2 className="mt-[5px] text-[20px] font-normal">Remove follower access</h2>
              <button
                className="bg-[#0099e6] w-[33px] h-[33px] rounded font-extrabold"
                onClick={() => setShowRemoveModal(false)}
              >
                ✖
              </button>
            </header>
            <div className="p-[15px] bg-[#2E353E] text-white text-center">
              <p className="pb-[10px] text-sm">
                Are you sure you want revoke access for <font className="font-bold">{selectedFollower.followerName}</font>?
              </p>
              <p className="text-[13px] text-[#ccc] mb-[10px]">
                Any configured trade alerts and trade copiers relating to this signal will be deleted.
              </p>
              <p className="text-[13px] text-[#ccc] mb-[10px]">
                <b>This process can not be undone.</b>
              </p>
              <label className="flex gap-2 justify-center items-center mb-[25px]">
                <input
                  type="checkbox"
                  id="confirm-remove"
                  checked={confirmRemove}
                  onChange={(e) => setConfirmRemove(e.target.checked)}
                />
                <span className="text-[13px] text-[#ccc]">Are you sure?</span>
              </label>
            </div>
            <footer className="px-4 py-3 text-white flex justify-end items-center">
              <StyledButton
                variant="contained"
                disabled={!confirmRemove}
                onClick={handleRemoveFollower}
                sx={{
                  backgroundColor: confirmRemove ? '#d2322d' : '#666',
                  '&:hover': { 
                    backgroundColor: confirmRemove ? '#b02a25' : '#666' 
                  },
                  textTransform: 'none',
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

export default SignalFollowers;



