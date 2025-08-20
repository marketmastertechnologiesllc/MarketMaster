import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import TableHead from '@mui/material/TableHead';
import { styled, alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Icon } from '@iconify/react';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import DeleteTradeCopierModal from '../../../components/modals/DeleteTradeCopierModal';
import useToast from '../../../hooks/useToast';
import useAuth from '../../../hooks/useAuth';
import api from '../../../utils/api';
import { useLoading } from '../../../contexts/loadingContext';

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
    // vertical padding + font size from searchIcon
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

const StyledInfoButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#11B3AE',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
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

// Add CSS keyframes for loading animation
const GlobalStyle = styled('style')(`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`);

const initialHeaders = [
  { id: 'strategyName', label: 'Strategy Name', checked: true },
  { id: 'strategyDescription', label: 'Strategy Description', checked: true },
  { id: 'accountName', label: 'Account Name', checked: true },
  { id: 'accountLogin', label: 'Login', checked: true },
  { id: 'accountPlatform', label: 'Platform', checked: true },
  { id: 'accountServer', label: 'Server', checked: true },
  { id: 'actions', label: 'Actions', checked: true },
];

export default function TradesTable() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading } = useLoading();
  const [sort, setSort] = React.useState({
    id: '',
    type: '',
  });

  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [deleteTradeCopierModalShow, setDeleteTradeCopierModalShow] = React.useState(false);
  const [selectedTradeCopierData, setSelectedTradeCopierData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingRows, setLoadingRows] = React.useState({});
  const [headers, setHeaders] = React.useState(initialHeaders);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showFilterItems, setShowFilterItems] = React.useState(true);
  const [isCreateButtonLoading, setIsCreateButtonLoading] = React.useState(false);
  const filterModalRef = React.useRef(null);

  const handleConfigButtonClicked = (subscriberId, strategyId) => {
    navigate(`/connect-signal/edit/${subscriberId}/${strategyId}`);
  };

  const handleCreateCopierClick = async () => {
    try {
      setIsCreateButtonLoading(true);
      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/connect-signal/new-connect-signal');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsCreateButtonLoading(false);
    }
  };

  const handleToggleTradeCopier = async (strategyId, accountId) => {
    const rowKey = `${strategyId}-${accountId}`;
    try {
      setLoadingRows(prev => ({ ...prev, [rowKey]: true }));
      const res = await api.post(`/account/toggle-copier`, {
        strategyId,
        accountId,
      });
      const res1 = await api.get(
        `/strategy/strategies-copier/${user.id}?page=1&pagecount=100&sort=&type=`
      );
      setData(res1.data.data);
      setCount(res1.data.data.length);
      showToast(res.data.msg, 'success');
    } catch (e) {
      showToast(e.response.data.msg, 'error');
    } finally {
      setLoadingRows(prev => ({ ...prev, [rowKey]: false }));
    }
  };

  const handleChangeRowsPerPage = (e) => {
    let config = JSON.parse(sessionStorage.getItem('tradeCopier'));
    config.pagecount = e.target.value;
    config.page = 1;
    sessionStorage.setItem('tradeCopier', JSON.stringify(config));

    setRowsPerPage(e.target.value);
    handlePageChange(null, 1);
  };

  const handlePageChange = async (e, value) => {
    setPage(value);

    try {
      loading(true);
      let config = JSON.parse(sessionStorage.getItem('tradeCopier'));
      config.page = value;
      sessionStorage.setItem('tradeCopier', JSON.stringify(config));

      const { page, pagecount, sort, type } = config;
      const res = await api.get(
        `/strategy/strategies-copier/${user.id}?page=${page}&pagecount=${pagecount}&sort=${sort}&type=${type}`
      );
      setData(res.data.data);
      setCount(res.data.data.length);
    } catch (e) {
      console.log(e);
    } finally {
      loading(false);
    }
  };

  const handleDeleteAccountModalButtonClicked = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/strategy/strategies-copier/${selectedTradeCopierData.strategyId}&${selectedTradeCopierData.accountId}`);
      handlePageChange(null, page);
      const res = await api.get(
        `/strategy/strategies-copier/${user.id}?page=1&pagecount=100&sort=&type=`
      );
      setData(res.data.data);
      setCount(res.data.data.length);
      showToast('Account deleted successfully!', 'success');
    } catch (err) {
      showToast('Account deletion failed!', 'error');
      console.log(err);
    } finally {
      setDeleteTradeCopierModalShow(false);
      setIsLoading(false);
    }
  };

  const handleDeleteTradeCopierButtonClicked = (accountData) => {
    setSelectedTradeCopierData(accountData);
    setDeleteTradeCopierModalShow(true);
  };

  /**
   * when visible items is changed...
   * @param {*} e
   */
  const handleVisibleChange = (e) => {
    const { name, checked } = e.target;
    setHeaders((prev) =>
      prev.map((item) =>
        item.id === name ? { ...item, checked } : item
      )
    );
  };

  /**
   * Handle click on entire row (checkbox + title)
   */
  const handleRowClick = (itemId, currentChecked) => {
    setHeaders((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !currentChecked } : item
      )
    );
  };

  /**
   * when click view all button
   */
  const handleViewAll = (e) => {
    const allChecked = headers.every(item => item.checked);
    setHeaders((prev) =>
      prev.map((item) => ({
        ...item,
        checked: !allChecked,
      }))
    );
  };

  const resetColumns = () => {
    setHeaders((prev) =>
      prev.map((item) => ({ ...item, checked: true }))
    );
  };

  // Handle click outside to close filter modal
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterModalRef.current && !filterModalRef.current.contains(event.target)) {
        setShowFilterModal(false);
      }
    };

    if (showFilterModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterModal]);

  React.useEffect(() => {
    let config = JSON.parse(sessionStorage.getItem('tradeCopier'));

    if (!config) {
      config = {
        page: 1,
        pagecount: 10,
        sort: '',
        type: '',
      };

      sessionStorage.setItem('tradeCopier', JSON.stringify(config));
    }

    setPage(config.page);
    setRowsPerPage(config.pagecount);
    setSort({
      id: config.sort,
      type: config.type,
    });

    async function fetchData() {
      try {
        loading(true);
        const { page, pagecount, sort, type } = config;
        const res = await api.get(
          `/strategy/strategies-copier/${user.id}?page=1&pagecount=100&sort=&type=`
        );
        setData(res.data.data);
        setCount(res.data.data.length);
      } catch (error) {
        console.error('Error fetching trade copier data:', error);
      } finally {
        loading(false);
      }
    }
      fetchData();
    }, []);

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <GlobalStyle />
      {deleteTradeCopierModalShow && (
        <DeleteTradeCopierModal
          deleteTradeCopierModalShow={setDeleteTradeCopierModalShow}
          selectedTradeCopierData={selectedTradeCopierData}
          handleDeleteAccountModalButtonClicked={
            handleDeleteAccountModalButtonClicked
          }
          isLoading={isLoading}
        />
      )}

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <StyledButton
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleCreateCopierClick}
          loading={isCreateButtonLoading}
          sx={{
            textTransform: 'none',
            backgroundColor: '#11B3AE!important',
            color: '#FFFFFF',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#0F9A95!important',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
            },
          }}
        >
          New Connect
        </StyledButton>
        <div className="relative" ref={filterModalRef}>
          <StyledButton
            variant="contained"
            size="small"
            onClick={() => setShowFilterModal((prev) => !prev)}
            startIcon={<VisibilityOffIcon />}
            sx={{
              textTransform: 'none',
              backgroundColor: '#11B3AE!important',
              color: '#FFFFFF',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#0F9A95!important',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
              },
            }}
          >
            Columns
          </StyledButton>
          {showFilterModal && (
            <div className="absolute z-50 top-full mt-2 p-4 w-[280px] text-white bg-[#0B1220] border border-[#11B3AE] rounded-lg shadow-xl right-0">
              <div className="text-[#E9D8C8] font-medium mb-3 text-sm sm:text-base">Toggle visible columns</div>
              <div className="space-y-2">
                <StyledButton
                  onClick={() => setShowFilterItems((prev) => !prev)}
                  sx={{
                    width: '100%',
                    padding: { xs: '4px 8px', sm: '8px 12px' },
                    borderRadius: '8px',
                    fontSize: { xs: '0.875rem', sm: '0.95rem' },
                    backgroundColor: '#11B3AE',
                    color: '#FFFFFF !important',
                    fontWeight: 500,
                    textTransform: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#0F9A95',
                      color: '#FFFFFF !important',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Selected ({headers.filter(item => item.checked).length})
                </StyledButton>
                {showFilterItems && (
                  <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                    <div
                      className={`flex pl-4 py-2 hover:bg-[#11B3AE] hover:bg-opacity-20 gap-2 cursor-pointer transition-all duration-200 rounded-t-lg ${headers.every(item => item.checked) && 'bg-[#11B3AE] bg-opacity-30'
                        }`}
                      onClick={handleViewAll}
                    >
                      <input
                        type="checkbox"
                        checked={headers.every(item => item.checked)}
                        onChange={handleViewAll}
                        className="accent-[#11B3AE]"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="text-[0.8rem] sm:text-[0.9rem] p-1 cursor-pointer font-medium text-[#E9D8C8]">
                        View all
                      </div>
                    </div>
                    {headers.map((item, i) => (
                      <div
                        key={`input_${i}`}
                        className={`flex pl-4 py-2 hover:bg-[#11B3AE] hover:bg-opacity-20 gap-2 cursor-pointer transition-all duration-200 ${item.checked && 'bg-[#11B3AE] bg-opacity-30'
                          }`}
                        onClick={() => handleRowClick(item.id, item.checked)}
                      >
                        <input
                          name={item.id}
                          checked={item.checked}
                          type="checkbox"
                          className="accent-[#11B3AE]"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="text-[0.8rem] sm:text-[0.9rem] p-1 cursor-pointer text-[#E9D8C8]">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <StyledButton
                  onClick={resetColumns}
                  sx={{
                    width: '100%',
                    padding: { xs: '4px 8px', sm: '8px 12px' },
                    borderRadius: '8px',
                    fontSize: { xs: '0.875rem', sm: '0.95rem' },
                    backgroundColor: '#11B3AE',
                    color: '#FFFFFF !important',
                    fontWeight: 500,
                    textTransform: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#0F9A95',
                      color: '#FFFFFF !important',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Reset Columns
                </StyledButton>
              </div>
            </div>
          )}
        </div>
      </Stack>

      <div className="mt-4 text-[#E9D8C8] bg-[#0B1220] p-3 sm:p-6 rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)] pb-[20px]">
        <div className="flex flex-col sm:flex-row justify-between w-full pb-4 gap-4">
          <div className="flex items-center gap-3">
            <FormControl size="small">
              <Select
                displayEmpty
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
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
                    },
                  },
                }}
                input={
                  <OutlinedInput
                    sx={{
                      width: { xs: '70px', sm: '80px' },
                      color: '#E9D8C8',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(17, 179, 174, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(17, 179, 174, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#11B3AE',
                        boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
                      },
                      '& .MuiSelect-icon': {
                        color: '#E9D8C8',
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
            />
          </Search>
        </div>

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
              aria-label="unified table"
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
                  {headers
                    .filter((item) => item.checked && item.id !== 'actions')
                    .map(({ label, id }, i) => (
                      <TableCell
                        key={`header_${i}`}
                        align="center"
                        sx={{
                          padding: '12px 8px',
                          fontWeight: 600,
                        }}
                      >
                        <div className="flex items-center justify-between p-[6px]">
                          {label}
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
                  {headers.find(({ id }) => id === 'actions')?.checked && (
                    <TableCell
                      key={'option'}
                      align="center"
                      sx={{
                        padding: '12px 8px',
                        fontWeight: 600,
                      }}
                    >
                      Actions
                    </TableCell>
                  )}
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
                {data && data.length > 0 && data.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`unified_data_${index}`}
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(17, 179, 174, 0.08)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                        },
                      }}
                    >
                      {headers
                        .filter((item) => item.checked && item.id !== 'actions')
                        .map(({ id }) => {
                          let value = row[id];
                          if (id === 'strategyName') {
                            value = row.strategyName + ' (' + row.strategyLogin + ')';
                          }
                          return (
                            <TableCell
                              key={id}
                              align="left"
                              sx={{
                                padding: '12px 16px',
                                fontSize: '0.875rem',
                              }}
                            >
                              <div className="truncate font-medium">{value}</div>
                            </TableCell>
                          );
                        })}
                      {headers.find(({ id }) => id === 'actions')?.checked && row.strategyId && (
                        <TableCell
                          key={row.id + 'option'}
                          align="left"
                          sx={{
                            width: '0',
                            padding: '12px 8px',
                          }}
                        >
                          <div className="flex gap-1">
                            <IconButton
                              size="small"
                              color="inherit"
                              disabled={loadingRows[`${row.strategyId}-${row.accountId}`]}
                              sx={{
                                backgroundColor: row.enabled ? '#fa5252' : '#11B3AE',
                                borderRadius: '8px',
                                fontSize: 24,
                                paddingX: '7px',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: row.enabled ? '#e03131' : '#0F9A95',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                                },
                                '&:disabled': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  opacity: 0.6,
                                },
                              }}
                              onClick={() => {
                                handleToggleTradeCopier(row.strategyId, row.accountId);
                              }}
                            >
                              {loadingRows[`${row.strategyId}-${row.accountId}`] ? <Icon icon="mdi:loading" color="white" style={{ animation: 'spin 1s linear infinite' }} /> : row.enabled ? <Icon icon="mdi:pause" color="white" /> : <Icon icon="mdi:play" color="white" />}
                            </IconButton>

                            <IconButton
                              size="small"
                              color="inherit"
                              sx={{
                                backgroundColor: '#fa5252',
                                borderRadius: '8px',
                                fontSize: 18,
                                padding: '10px 10px!important',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: '#e03131',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(250, 82, 82, 0.3)',
                                },
                              }}
                              onClick={() =>
                                handleDeleteTradeCopierButtonClicked({
                                  strategyId: row.strategyId,
                                  accountId: row.accountId,
                                })
                              }
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

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-20 gap-4">
            <Typography sx={{
              color: '#E9D8C8',
              fontSize: { xs: 12, sm: 14 },
              fontWeight: 500,
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              Showing {rowsPerPage * (page - 1) + 1} to{' '}
              {rowsPerPage * page > count ? count : rowsPerPage * page} of{' '}
              {count} entries
            </Typography>
            <Pagination
              sx={{
                paddingY: 2,
                '& .MuiPaginationItem-root': {
                  color: '#E9D8C8',
                  borderColor: 'rgba(17, 179, 174, 0.3)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  minWidth: { xs: '32px', sm: '40px' },
                  height: { xs: '32px', sm: '40px' },
                  '&:hover': {
                    backgroundColor: 'rgba(17, 179, 174, 0.1)',
                    borderColor: 'rgba(17, 179, 174, 0.5)',
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
                count % rowsPerPage === 0
                  ? count / rowsPerPage
                  : Math.floor(count / rowsPerPage) + 1
              }
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
              size="small"
            />
          </div>
        </Paper>
      </div>
    </div>
  );
}
