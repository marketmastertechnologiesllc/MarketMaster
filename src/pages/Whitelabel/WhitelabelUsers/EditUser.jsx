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

  React.useEffect(() => {
    async function fetchData() {
      const res = await api.get(`/users/detail/${id}`);
      if (res.data.status === 'OK') {
        setUserInfo(res.data.data.userInfo);
        setSignals(res.data.data.strategies);
        setAccounts(res.data.data.accounts);
        setCopiers(res.data.data.copiers);
        setMaxAccount(res.data.data.maxAccount);
        setValues({
          ...values,
          role: res.data.data.role,
          providerAccountLimit: res.data.data.providerAccountLimit,
        });
      }
    }

    fetchData();
  }, [id]);

  const handleUpdateMaxAccount = async () => {
    try {
      await api.put(`/users/max-account/${id}`, { maxAccount: maxAccount });
      setUserInfo({
        ...data,
        maxAccount: maxAccount,
      });
      setShowMaxAccountModal(false);
      showToast('Updated successfully', 'success');
    } catch (err) {
      console.log(err);
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
    <div className="mb-28">
      <div className="pb-3">
        <Link
          to={`/whitelabel/users`}
          className="flex flex-row items-center font-extrabold"
        >
          <ReplyRoundedIcon
            fontSize="medium"
            sx={{ color: 'white', fontWeight: 'bold' }}
          />
          <h1 className="text-white text-lg pl-2"> Whitelabel Users</h1>
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-3">
          <header className="p-[18px] text-white flex justify-between items-center bg-[#282D36] rounded-t">
            <h2 className="mt-[5px] text-[20px] font-normal">User Details</h2>
          </header>
          <div className="text-[#ccc] bg-[#2E353E] p-4 rounded-b">
            <p className="mb-2 text-sm">Profile Name</p>
            <h1 className="text-xl">{userInfo.fullName}</h1>
            <p className="my-2 text-sm">Registered</p>
            <h1 className="text-xl">
              {userInfo.created_at && userInfo.created_at.substring(0, 10)}
            </h1>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="my-2 text-sm">Max Accounts</p>
                <h1 className="text-xl">{userInfo.maxAccount}</h1>
              </div>
              <IconButton
                size="small"
                color="inherit"
                sx={{
                  backgroundColor: '#0099E6',
                  borderRadius: '4px',
                  fontSize: 13,
                  paddingX: '11px',
                  paddingY: '11px',
                }}

                onClick={() => setShowMaxAccountModal(true)}
              >
                <Icon icon="fa:cogs" color="white" />
              </IconButton>
            </div>
            <fieldset className="grid grid-cols-12 border-2 border-[#282d36] rounded-md p-3 gap-3">
              <div className="col-span-6">
                <p className="mb-2 text-sm">Role</p>
                <div>
                  <select
                    name="role"
                    className="block bg-[#282d36] text-[#fff] px-3 py-1.5 rounded w-full h-[34px] text-lg"
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
                      className="block bg-[#282d36] text-[#fff] px-3 py-1.5 rounded w-full h-[34px] text-lg"
                      onChange={handleInputChange}
                      value={values.providerAccountLimit}
                    />
                    {values.providerAccountLimit == '' &&
                      isUpdateButtonClicked && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-500">
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
                  backgroundColor: '#0099E6',
                  '&:hover': { backgroundColor: '#0088cc' },
                  textTransform: 'none',
                  color: 'white',
                  paddingX: '40px',
                }}
                loading={isLoading}
                onClick={handleUpdateButtonClicked}
              >
                Update
              </LoadingButton>
            </fieldset>
          </div>
        </div>
        <div className="col-span-9 flex flex-col gap-5">
          <div>
            <header className="p-[18px] text-white flex justify-between items-center bg-[#282D36] rounded-t">
              <h2 className="mt-[5px] text-[20px] font-normal">Signals</h2>
            </header>
            <div className="text-[#ccc] bg-[#2E353E] p-5 rounded-b pb-[10px]">
              <Paper
                sx={{
                  width: '100%',
                  // marginBottom: 10,
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
                    // maxHeight: 440,
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
                        {headers[0].map(({ label, id }) => (
                          <TableCell
                            key={id}
                            align="center"
                            // style={{ minWidth: column.minWidth }}
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
                      {
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        signals &&
                        signals.length > 0 &&
                        signals.map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
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
                                      padding: '5px',
                                      paddingLeft: 2,
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
                                      <div className="truncate">{value}</div>
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

                {/* <Typography color="white" mb={1}>
                  No signals have been added.
                </Typography> */}
              </Paper>
            </div>
          </div>
          <div>
            <header className="p-[18px] text-white flex justify-between items-center bg-[#282D36] rounded-t">
              <h2 className="mt-[5px] text-[20px] font-normal">Accounts</h2>
            </header>
            <div className="text-[#ccc] bg-[#2E353E] p-5 rounded-b pb-[10px]">
              <Paper
                sx={{
                  width: '100%',
                  // marginBottom: 10,
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
                    // maxHeight: 440,
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
                        {headers[1].map(({ label, id }) => (
                          <TableCell
                            key={id}
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
                      {
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        accounts &&
                        accounts.length > 0 &&
                        accounts.map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
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
                                      padding: '5px',
                                      paddingLeft: 2,
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
                                      <div className="truncate">{value}</div>
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

                {/* <Typography color="white" mb={1}>
                  No accounts have been added.
                </Typography> */}
              </Paper>
            </div>
          </div>
          <div>
            <header className="p-[18px] text-white flex justify-between items-center bg-[#282D36] rounded-t">
              <h2 className="mt-[5px] text-[20px] font-normal">Copiers</h2>
            </header>
            <div className="text-[#ccc] bg-[#2E353E] p-5 rounded-b pb-[10px]">
              <Paper
                sx={{
                  width: '100%',
                  // marginBottom: 10,
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
                    // maxHeight: 440,
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
                        {headers[2].map(({ label, id }) => (
                          <TableCell
                            key={id}
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
                      {
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        copiers &&
                        copiers.length > 0 &&
                        copiers.map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
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
                                      padding: '5px',
                                      paddingLeft: 2,
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
                                      <div className="truncate">{value}</div>
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

                {/* <Typography color="white" mb={1}>
                  No copiers have been added.
                </Typography> */}
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
          className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1202] bg-opacity-80 bg-[#1D2127]"
          onClick={() => setShowMaxAccountModal(false)}
        ></div>
        <section className="mb-[20px] bg-[#282D36] w-[500px] z-[100000]">
          <header className="p-[18px] text-white flex justify-between items-center">
            <h2 className="mt-[5px] text-[20px] font-normal">
              Adjust max account limit
            </h2>
            <button
              className="bg-[#0099e6] w-[33px] h-[33px] font-extrabold"
              onClick={() => setShowMaxAccountModal(false)}
            >
              ✖
            </button>
          </header>
          <div className="p-[15px] bg-[#2E353E] text-white text-center flex justify-center gap-2 items-center py-10">
            <div className="text-sm">Max account limt: </div>
            <input
              name="fullName"
              type="number"
              required
              value={maxAccount}
              className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded block w-[40%] h-[34px] text-sm"
              onChange={(e) => setMaxAccount(e.target.value)}
            />
          </div>
          <footer className="px-4 py-3 text-white flex justify-end items-center">
            <LoadingButton
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                color: '#ffffff!important',
                backgroundColor: '#0099e6!important',
                borderRadius: '1px',
                paddingX: '12px',
                paddingY: '6px',
                '&:disabled': { opacity: 0.5 },
              }}
              onClick={handleUpdateMaxAccount}
              loading={isLoading}
            // disabled={!checkboxSelected}
            >
              Update
            </LoadingButton>
          </footer>
        </section>
      </div>
    </div>
  );
}
