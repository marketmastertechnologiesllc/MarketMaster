import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Icon } from '@iconify/react';
import Pagination from '@mui/material/Pagination';
import { Link, useNavigate, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import LoadingButton from '@mui/lab/LoadingButton';
import api from '../../../utils/api';
import DeleteSignalModal from '../../../components/modals/DeleteSignalModal';
import useToast from '../../../hooks/useToast';

const headers = [[
  { id: 'strategyId', label: 'Strategy ID' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'created_at', label: 'CreatedAt' },
  { id: 'updated_at', label: 'UpdatedAt' },],
[
  { id: 'accountId', label: 'Account ID' },
  { id: 'name', label: 'Name' },
  { id: 'login', label: 'Login' },
  { id: 'platform', label: 'Platform' },
  { id: 'server', label: 'Server' },
  { id: 'created_at', label: 'CreatedAt' },
  { id: 'updated_at', label: 'UpdatedAt' },],
[
  // { id: 'strategyId', label: 'Strategy ID' },
  { id: 'strategyName', label: 'Strategy Name' },
  { id: 'strategyDescription', label: 'Description' },
  { id: 'name', label: 'Copier Name' },
  { id: 'login', label: 'Login' },
  { id: 'platform', label: 'Platform' },
  { id: 'server', label: 'Server' },
  { id: 'created_at', label: 'CreatedAt' },
  { id: 'updated_at', label: 'UpdatedAt' },
]];  // 0: signals, 1: accounts, 2: copiers

export default function EditUser() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUpdateButtonClicked, setIsUpdateButtonClicked] =
    React.useState(false);
  const { id } = useParams();
  const [userInfo, setUserInfo] = React.useState({});
  const [signals, setSignals] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [copiers, setCopiers] = React.useState([]);
  const [values, setValues] = React.useState({
    role: '',
    providerAccountLimit: 0,
  });

  const [showMaxAccountModal, setShowMaxAccountModal] = React.useState(false);

  const [maxAccount, setMaxAccount] = React.useState(0);
  const [tempMaxAccount, setTempMaxAccount] = React.useState(0);

  React.useEffect(() => {
    async function fetchData() {
      const res = await api.get(`/users/detail/${id}`);
      if (res.data.status === 'OK') {
        setUserInfo(res.data.data.userInfo);
        setSignals(res.data.data.strategies);
        setAccounts(res.data.data.accounts);
        setCopiers(res.data.data.copiers);
        setMaxAccount(res.data.data.maxAccount);
        setTempMaxAccount(res.data.data.maxAccount);
        setValues({
          ...values,
          role: res.data.data.role,
          providerAccountLimit: res.data.data.providerAccountLimit,
        });
      }
    }

    fetchData();
  }, [id]);

  const handleOpenMaxAccountModal = () => {
    setTempMaxAccount(userInfo.maxAccount);
    setShowMaxAccountModal(true);
  };

  const handleUpdateMaxAccount = async () => {
    try {
      setIsLoading(true);
      await api.put(`/users/max-account/${id}`, { maxAccount: tempMaxAccount });
      
      // Update the local state
      setUserInfo(prev => ({
        ...prev,
        maxAccount: tempMaxAccount,
      }));
      setMaxAccount(tempMaxAccount);
      
      setShowMaxAccountModal(false);
      showToast('Updated successfully', 'success');
    } catch (err) {
      console.log(err);
      showToast('Update failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateButtonClicked = async () => {
    try {
      setIsUpdateButtonClicked(true);
      setIsLoading(true);
      const res = await api.put(`/users/convert-provider/${id}`, {
        role: values.role,
        providerAccountLimit: values.providerAccountLimit,
      });
      if (res.data.status === 'OK') {
        showToast('Updated successfully!', 'success');
      }
      if (res.data.status === 'EX') {
        showToast(res.data.data, 'error');
      }
    } catch (err) {
      console.log(err);
      showToast('Update failed!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    try {
      const { name, value } = e.target;
      setValues({
        ...values,
        [name]: value,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="pb-3">
        <Link
          to={`/whitelabel/users`}
          className="flex flex-row items-center font-extrabold"
        >
          <ReplyRoundedIcon
            fontSize="medium"
            sx={{ color: '#E9D8C8', fontWeight: 'bold' }}
          />
          <h1 className="text-[#E9D8C8] text-lg pl-2"> Whitelabel Users</h1>
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-3">
          <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center bg-[#0B1220] rounded-t-xl border border-[#11B3AE] border-b-0 shadow-[0_0_16px_rgba(17,179,174,0.5)]">
            <h2 className="mt-[5px] text-[20px] font-normal text-[#FFFFFF]">User Details</h2>
          </header>
          <div className="text-[#E9D8C8] bg-[#0B1220] p-4 rounded-b-xl border border-[#11B3AE] border-t-0 shadow-[0_0_16px_rgba(17,179,174,0.5)]">
            <p className="mb-2 text-sm">Profile Name</p>
            <h1 className="text-xl text-[#FFFFFF]">{userInfo.fullName}</h1>
            <p className="my-2 text-sm">Registered</p>
            <h1 className="text-xl text-[#FFFFFF]">
              {userInfo.created_at && userInfo.created_at.substring(0, 10)}
            </h1>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="my-2 text-sm">Max Accounts</p>
                <h1 className="text-xl text-[#FFFFFF]">{userInfo.maxAccount}</h1>
              </div>
              <IconButton
                size="small"
                color="inherit"
                sx={{
                  backgroundColor: '#11B3AE',
                  borderRadius: '8px',
                  fontSize: 13,
                  paddingX: '11px',
                  paddingY: '11px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#0F9A95',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                  },
                }}

                onClick={handleOpenMaxAccountModal}
              >
                <Icon icon="fa:cogs" color="white" />
              </IconButton>
            </div>
            <fieldset className="grid grid-cols-12 border-2 border-[#11B3AE] border-opacity-30 rounded-lg p-3 gap-3">
              <div className="col-span-6">
                <p className="mb-2 text-sm">Role</p>
                <div>
                  <select
                    name="role"
                    className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[34px] text-lg border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                    value={values.role}
                    onChange={handleInputChange}
                  >
                    <option className="text-base" value={'User'}>
                      User
                    </option>
                    <option className="text-base" value={'Provider'}>
                      Provider
                    </option>
                  </select>
                </div>
              </div>
              {values.role === 'Provider' ? (
                <div
                  className={`col-span-6 ${values.role === 'Provider' ? '' : 'hidden'
                    }`}
                >
                  <p className="mb-2 text-sm">Account Limit</p>
                  <div>
                    <input
                      name="providerAccountLimit"
                      type="number"
                      required
                      className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[34px] text-lg border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                      onChange={handleInputChange}
                      value={values.providerAccountLimit}
                    />
                    {values.providerAccountLimit == '' &&
                      isUpdateButtonClicked && (
                        <p className="mt-2 text-xs text-red-400">
                          Limit required!
                        </p>
                      )}
                  </div>
                </div>
              ) : (
                <div className="col-span-6"></div>
              )}
              <LoadingButton
                className="col-start-8"
                sx={{
                  backgroundColor: '#11B3AE',
                  '&:hover': { backgroundColor: '#0F9A95' },
                  textTransform: 'none',
                  color: 'white',
                  paddingX: '40px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#0F9A95',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                  },
                }}
                loading={isLoading}
                onClick={handleUpdateButtonClicked}
              >
                Approve
              </LoadingButton>
            </fieldset>
          </div>
        </div>
        <div className="col-span-9 flex flex-col gap-5">
          <div>
            <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center bg-[#0B1220] rounded-t-xl border border-[#11B3AE] border-b-0 shadow-[0_0_16px_rgba(17,179,174,0.5)]">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#FFFFFF]">Signals</h2>
            </header>
            <div className="text-[#E9D8C8] bg-[#0B1220] p-5 rounded-b-xl border border-[#11B3AE] border-t-0 shadow-[0_0_16px_rgba(17,179,174,0.5)] pb-[10px]">
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
                        {headers[0].map(({ label, id }) => (
                          <TableCell
                            key={id}
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
                        signals &&
                        signals.length > 0 &&
                        signals.map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                              sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'rgba(17, 179, 174, 0.08)',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                                },
                              }}
                            >
                              {headers[0].map(({ id }) => {
                                let value = row[id];
                                if (id === 'account') {
                                  value = `${value[0].name}(${value[0].login})`;
                                } else if (id === 'signal') {
                                  value = `${row.name}(${row.strategyId})`;
                                }
                                if (
                                  id === 'created_at' ||
                                  id === 'updated_at'
                                ) {
                                  if (value) {
                                    value =
                                      value.substr(0, 10) +
                                      ' ' +
                                      value.substr(11, 8);
                                  } else {
                                    value = 'N/A';
                                  }
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
                                    {id === 'live' ? (
                                      <Icon
                                        icon={
                                          row[id]
                                            ? 'mdi:check-bold'
                                            : 'mdi:close-bold'
                                        }
                                        width={22}
                                        className="font-bold"
                                        color={row[id] ? 'green' : '#D64742'}
                                      />
                                    ) : (
                                      <div className="truncate font-medium">{value}</div>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </div>
          <div>
            <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center bg-[#0B1220] rounded-t-xl border border-[#11B3AE] border-b-0 shadow-[0_0_16px_rgba(17,179,174,0.5)]">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#FFFFFF]">Accounts</h2>
            </header>
            <div className="text-[#E9D8C8] bg-[#0B1220] p-5 rounded-b-xl border border-[#11B3AE] border-t-0 shadow-[0_0_16px_rgba(17,179,174,0.5)] pb-[10px]">
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
                        {headers[1].map(({ label, id }) => (
                          <TableCell
                            key={id}
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
                        accounts &&
                        accounts.length > 0 &&
                        accounts.map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                              sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'rgba(17, 179, 174, 0.08)',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                                },
                              }}
                            >
                              {headers[1].map(({ id }) => {
                                let value = row[id];
                                if (id === 'account') {
                                  value = `${value[0].name}(${value[0].login})`;
                                } else if (id === 'signal') {
                                  value = `${row.name}(${row.strategyId})`;
                                }
                                if (
                                  id === 'created_at' ||
                                  id === 'updated_at'
                                ) {
                                  if (value) {
                                    value =
                                      value.substr(0, 10) +
                                      ' ' +
                                      value.substr(11, 8);
                                  } else {
                                    value = 'N/A';
                                  }
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
                                    {id === 'live' ? (
                                      <Icon
                                        icon={
                                          row[id]
                                            ? 'mdi:check-bold'
                                            : 'mdi:close-bold'
                                        }
                                        width={22}
                                        className="font-bold"
                                        color={row[id] ? 'green' : '#D64742'}
                                      />
                                    ) : (
                                      <div className="truncate font-medium">{value}</div>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </div>
          <div>
            <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center bg-[#0B1220] rounded-t-xl border border-[#11B3AE] border-b-0 shadow-[0_0_16px_rgba(17,179,174,0.5)]">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#FFFFFF]">Copiers</h2>
            </header>
            <div className="text-[#E9D8C8] bg-[#0B1220] p-5 rounded-b-xl border border-[#11B3AE] border-t-0 shadow-[0_0_16px_rgba(17,179,174,0.5)] pb-[10px]">
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
                        {headers[2].map(({ label, id }) => (
                          <TableCell
                            key={id}
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
                        copiers &&
                        copiers.length > 0 &&
                        copiers.map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                              sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'rgba(17, 179, 174, 0.08)',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                                },
                              }}
                            >
                              {headers[2].map(({ id, index }) => {
                                let value = row[id];
                                if (id === 'account') {
                                  value = `${value[0].name}(${value[0].login})`;
                                } else if (id === 'signal') {
                                  value = `${row.name}(${row.strategyId})`;
                                }
                                if (
                                  id === 'created_at' ||
                                  id === 'updated_at'
                                ) {
                                  if (value) {
                                    value =
                                      value.substr(0, 10) +
                                      ' ' +
                                      value.substr(11, 8);
                                  } else {
                                    value = 'N/A';
                                  }
                                }
                                return (
                                  <TableCell
                                    key={index}
                                    align="left"
                                    sx={{
                                      padding: '12px 16px',
                                      fontSize: '0.875rem',
                                    }}
                                  >
                                    {id === 'live' ? (
                                      <Icon
                                        icon={
                                          row[id]
                                            ? 'mdi:check-bold'
                                            : 'mdi:close-bold'
                                        }
                                        width={22}
                                        className="font-bold"
                                        color={row[id] ? 'green' : '#D64742'}
                                      />
                                    ) : (
                                      <div className="truncate font-medium">{value}</div>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1201] ${!showMaxAccountModal && 'hidden'
          }`}
      >
        <div
          className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1202] bg-opacity-80 bg-[#0B1220]"
          onClick={() => {
            setShowMaxAccountModal(false);
            setTempMaxAccount(userInfo.maxAccount);
          }}
        ></div>
        <section className="mb-[20px] bg-[#0B1220] w-[500px] z-[100000] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
          <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center border-b border-[#11B3AE] border-opacity-20">
            <h2 className="mt-[5px] text-[20px] font-normal text-[#FFFFFF]">
              Adjust max account limit
            </h2>
            <button
              className="bg-[#11B3AE] w-[33px] h-[33px] font-extrabold rounded-lg hover:bg-[#0F9A95] transition-all duration-200"
              onClick={() => {
                setShowMaxAccountModal(false);
                setTempMaxAccount(userInfo.maxAccount);
              }}
            >
              ✖
            </button>
          </header>
          <div className="p-[15px] bg-[#0B1220] text-[#E9D8C8] text-center flex justify-center gap-2 items-center py-10">
            <div className="text-sm">Max account limit: </div>
            <input
              name="maxAccount"
              type="number"
              min="1"
              required
              value={tempMaxAccount}
              className="bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg block w-[40%] h-[34px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
              onChange={(e) => setTempMaxAccount(parseInt(e.target.value) || 0)}
            />
          </div>
          <footer className="px-4 py-3 text-[#E9D8C8] flex justify-end items-center border-t border-[#11B3AE] border-opacity-20">
            <LoadingButton
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                color: '#ffffff!important',
                backgroundColor: '#11B3AE!important',
                borderRadius: '8px',
                paddingX: '12px',
                paddingY: '6px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#0F9A95!important',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
                '&:disabled': { opacity: 0.5 },
              }}
              onClick={handleUpdateMaxAccount}
              loading={isLoading}
              disabled={tempMaxAccount <= 0}
            >
              Update
            </LoadingButton>
          </footer>
        </section>
      </div>
    </div>
  );
}
