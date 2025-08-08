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
}));

const StyledInfoButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#1B5E20',
    boxShadow: 'none',
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

const headers = [
  // { id: 'strategyId', label: 'Strategy ID' },
  { id: 'strategyName', label: 'Strategy Name' },
  { id: 'strategyDescription', label: 'Strategy Description' },
  // { id: 'accountId', label: 'Account ID' },
  { id: 'accountName', label: 'Account Name' },
  { id: 'accountLogin', label: 'Login' },
  { id: 'accountPlatform', label: 'Platform' },
  { id: 'accountServer', label: 'Server' },
  // { id: 'created_at', label: 'Created At' },
  // { id: 'updated_at', label: 'Updated At' },
];
export default function TradesTable() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleConfigButtonClicked = (subscriberId, strategyId) => {
    navigate(`/trade-copier/edit/${subscriberId}/${strategyId}`);
  };

  const handleToggleTradeCopier = async (strategyId, accountId) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
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
      const { page, pagecount, sort, type } = config;
      const res = await api.get(
        `/strategy/strategies-copier/${user.id}?page=1&pagecount=100&sort=&type=`
      );
      setData(res.data.data);
      setCount(res.data.data.length);
    }

    fetchData();
  }, []);

  return (
    <div>
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
        <Link to={'/trade-copier/create-new-trade-copier'}>
          <StyledButton
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none', backgroundColor: '#0088CC!important' }}
          >
            Create Copier
          </StyledButton>
        </Link>
        <StyledButton
          variant="contained"
          size="small"
          startIcon={<VisibilityOffIcon />}
          sx={{ textTransform: 'none', backgroundColor: '#0088CC!important' }}
        >
          Columns
        </StyledButton>
      </Stack>

      <div className="mt-2 text-[#ccc] bg-[#2E353E] p-5 rounded pb-[10px]">
        <div className="flex justify-between w-full pb-3">
          <div className="flex items-center gap-2">
            <FormControl size="small">
              <Select
                displayEmpty
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
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
            />
          </Search>
        </div>

        <TableContainer
          aria-label="unified table"
          sx={{
            '& .MuiTableCell-root': {
              color: '#ccc',
              backgroundColor: '#2E353E',
              border: '#282D36',
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 1,
                    borderColor: '#282D36',
                  },
                }}
              >
                {headers.map(({ label, id }, index) => (
                  <TableCell
                    key={`header_${index}`}
                    align="center"
                    sx={{
                      padding: '5px',
                    }}
                  >
                    <div className="flex items-center justify-between p-[3px]">
                      {label}
                      <div className="flex flex-col width={11} cursor-pointer">
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
                >
                  Actions
                </TableCell>
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
              {data && data.length > 0 && data.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`unified_data_${index}`}>


                    {headers.map(({ id }) => {
                      let value = row[id];
                      if (id === 'strategyName') {
                        value = row.strategyName + ' (' + row.strategyLogin + ')';
                      }
                      return (
                        <TableCell
                          key={id}
                          align="left"
                          sx={{
                            padding: '5px',
                            paddingLeft: 2,
                          }}
                        >
                          <div className="truncate">{value}</div>
                        </TableCell>
                      );
                    })}
                    {row.strategyId && (
                      <TableCell
                        key={row.id + 'option'}
                        align="left"
                        sx={{
                          width: '0',
                          padding: '5px',
                        }}
                      >
                        <div className="flex gap-1">
                          <IconButton
                            size="small"
                            color="inherit"
                            loading={isLoading}
                            sx={{
                              backgroundColor: row.enabled ? '#D64742' : '#2e7d32',
                              borderRadius: '4px',
                              fontSize: 24,
                              paddingX: '6px',
                            }}
                            onClick={() => {
                              handleToggleTradeCopier(row.strategyId, row.accountId);
                            }}
                          >
                            {isLoading ? <Icon icon="mdi:loading" color="white" style={{ animation: 'spin 1s linear infinite' }} /> : row.enabled ? <Icon icon="mdi:pause" color="white" /> : <Icon icon="mdi:play" color="white" />}
                          </IconButton>
                          {/* <IconButton
                            size="small"
                            color="inherit"
                            sx={{
                              backgroundColor: '#0099E6',
                              borderRadius: '4px',
                              fontSize: 13,
                              paddingX: '11px',
                            }}
                            onClick={() =>
                              handleConfigButtonClicked(
                                row.subscriberId,
                                row.strategyId
                              )
                            }
                          >
                            <Icon icon="fa:cogs" color="white" />
                          </IconButton> */}
                          <IconButton
                            size="small"
                            color="inherit"
                            sx={{
                              backgroundColor: '#D64742',
                              borderRadius: '4px',
                              fontSize: 13,
                              padding: '10px 11px!important',
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

        <div className="flex justify-between items-center">
          <Typography sx={{ color: '#ccc', fontSize: 13 }}>
            Showing {rowsPerPage * (page - 1) + 1} to{' '}
            {rowsPerPage * page > count ? count : rowsPerPage * page} of{' '}
            {count} entries
          </Typography>
          <Pagination
            sx={{
              paddingY: 2,
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
          />
        </div>
      </div>
    </div>
  );
}
