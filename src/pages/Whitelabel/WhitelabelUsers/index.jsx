import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Icon } from '@iconify/react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import IconButton from '@mui/material/IconButton';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import DeleteUserModal from '../../../components/modals/DeleteUserModal';
import useToast from '../../../hooks/useToast';
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

const headers = [
  { id: 'email', label: 'Email' },
  { id: 'fullName', label: 'Full Name' },
  { id: '_id', label: 'ID' },
  { id: 'role', label: 'Role' },
  { id: 'strategies', label: 'Strategies' },
  { id: 'copiers', label: 'Copiers' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'maxAccount', label: 'Max Accounts' },
  { id: 'isPending', label: 'Status' },
  { id: 'providerAccountLimit', label: 'Limit' },
];

export default function WhitelabelUsers() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { loading } = useLoading();
  const [sort, setSort] = React.useState({
    id: '',
    type: '',
  });
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  // const [exclamationModalShow, setExclamationModalShow] = React.useState(false);
  const [DeleteUserModalShow, setDeleteUserModalShow] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedAccountData, setSelectedAccountData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    let config = JSON.parse(sessionStorage.getItem('users'));

    if (!config) {
      config = {
        page: 1,
        pagecount: 10,
        sort: '',
        type: '',
      };

      sessionStorage.setItem('users', JSON.stringify(config));
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
          `/users/all?page=${page}&pagecount=${pagecount}&sort=${sort}&type=${type}`
        );
        setData(res.data.data);
        setCount(res.data.count);
      } catch (err) {
        console.log(err);
      } finally {
        loading(false);
      }
    }

    fetchData();
  }, []);

  const handleChangeRowsPerPage = (e) => {
    let config = JSON.parse(sessionStorage.getItem('users'));
    config.pagecount = e.target.value;
    config.page = 1;
    sessionStorage.setItem('users', JSON.stringify(config));

    setRowsPerPage(e.target.value);
    handlePageChange(null, 1);
  };



  const handlePageChange = async (e, value) => {
    setPage(value);

    try {
      let config = JSON.parse(sessionStorage.getItem('users'));
      config.page = value;
      sessionStorage.setItem('users', JSON.stringify(config));

      const { page, pagecount, sort, type } = config;
      const res = await api.get(
        `/users/all?page=${page}&pagecount=${pagecount}&sort=${sort}&type=${type}`
      );

      setData(res.data.data);
      setCount(res.data.count);
    } catch (e) {
      console.log(e);
    }
  };

  const handleConfigButtonClicked = async (id) => {
    // const res = await api.post('/notification', {
    //   userId: id,
    // });
    // if (res.data.status === 'OK') {
    navigate(`/whitelabel/users/edit/${id}`);
    // } else {
    //   showToast('Something went wrong!', 'error');
    // }
  };

  const handleDeleteAccountButtonClicked = (accountData) => {
    setSelectedAccountData(accountData);
    setDeleteUserModalShow(true);
  };

  const handleDeleteUserModalButtonClicked = async () => {
    try {
      setIsLoading(true);
      const res = await api.delete(`users/${selectedAccountData.id}`);
      if (res.data.status === 'OK') {
        handlePageChange(null, page);
        showToast('Account deleted successfully!', 'success');
      } else {
        showToast('Account deletion failed!', 'error');
      }
    } catch (err) {
      showToast('Account deletion failed!', 'error');
      console.log(err);
    } finally {
      setDeleteUserModalShow(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      {DeleteUserModalShow && (
        <DeleteUserModal
          DeleteUserModalShow={setDeleteUserModalShow}
          selectedUserName={selectedAccountData.fullName}
          handleDeleteUserModalButtonClicked={
            handleDeleteUserModalButtonClicked
          }
          isLoading={isLoading}
        />
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={{ xs: 2, sm: 1 }}
        display={'flex'}
        justifyContent={'space-between'}
        sx={{ gap: { xs: 2, sm: 1 } }}
      >
        <div className="flex gap-2 justify-center sm:justify-start">
          <Link to="/whitelabel/users/add-user">
            <StyledButton
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: '#11B3AE',
                textTransform: 'none',
                color: '#FFFFFF',
                fontWeight: 500,
                padding: { xs: '4px 8px', sm: '8px 12px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                border: '1px solid #11B3AE',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#0F9A95',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
              }}
            >
              Add User
            </StyledButton>
          </Link>
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
                  {headers.map(({ label, id }, index) => (
                    <TableCell
                      key={`users_header_${index}`}
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
                {
                  data &&
                  data.length > 0 &&
                  data.map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={`users_table_data_${index}`}
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'rgba(17, 179, 174, 0.08)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                          },
                        }}
                      >
                        {headers.map(({ id }) => {
                          let value = row[id];
                          if (id === 'isPending') {
                            value = value === true ? 'Pending' : 'Approved';
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
                              {value === 'Pending' ? (
                                <div className="text-[#edbc37] font-bold">
                                  {value}
                                </div>
                              ) : value === 'Approved' ? (
                                <div className="text-[#5ad462] font-bold">
                                  {value}
                                </div>
                              ) : (
                                <div className="truncate font-medium">{value}</div>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell
                          key={row.id + 'option'}
                          align="left"
                          sx={{
                            width: '0',
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
                              onClick={() =>
                                handleConfigButtonClicked(row._id)
                              }
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
                              onClick={() =>
                                handleDeleteAccountButtonClicked({
                                  fullName: row.fullName,
                                  id: row._id,
                                })
                              }
                            >
                              <Icon icon="ion:trash-sharp" color="white" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
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
