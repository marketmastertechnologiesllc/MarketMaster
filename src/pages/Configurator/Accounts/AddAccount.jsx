import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';
import useAuth from '../../../hooks/useAuth';
import useUtils from '../../../hooks/useUtils';

const StyledButton = styled(LoadingButton)(({ theme }) => ({
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

function AddAccount() {
  const { showToast } = useToast();
  const { user } = useAuth();



  const initialValues = {
    login: '',
    password: '',
    name: '',
    server: '',
    platform: '',
    copyFactoryRoles: [],
  };
  const [values, setValues] = React.useState(initialValues);
  const [isSubscriberChecked, setIsSubscriberChecked] = React.useState(true);
  const [isProviderChecked, setIsProviderChecked] = React.useState(false);
  const [createButtonClicked, setCreateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [brokers, setBrokers] = React.useState([]);

  const dispatch = useDispatch();
  const { ids } = useSelector((state) => state.utils);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  React.useEffect(() => {
    if (isSubscriberChecked) {
      if (values.copyFactoryRoles.includes('SUBSCRIBER') == false) {
        values.copyFactoryRoles.push('SUBSCRIBER');
      }
    } else {
      values.copyFactoryRoles = values.copyFactoryRoles.filter(
        (role) => role !== 'SUBSCRIBER'
      );
    }
    if (isProviderChecked) {
      if (values.copyFactoryRoles.includes('PROVIDER') == false) {
        values.copyFactoryRoles.push('PROVIDER');
      }
    } else {
      values.copyFactoryRoles = values.copyFactoryRoles.filter(
        (role) => role !== 'PROVIDER'
      );
    }
  }, [isSubscriberChecked, isProviderChecked]);

  const handleCreateAccount = async () => {
    try {
      setCreateButtonClicked(true);

      // Check if all required fields are filled
      const isLoginValid = values.login && values.login.toString().trim() !== '' && !isNaN(values.login) && parseInt(values.login) > 0;
      const isPasswordValid = values.password && values.password.trim() !== '';
      const isNameValid = values.name && values.name.trim() !== '' && values.name.trim().length >= 2;
      const isServerValid = values.server && values.server.trim() !== '' && values.server.trim().length >= 2;
      const isPlatformValid = values.platform && values.platform !== '';
      const isCopyFactoryValid = user.role === 'User' || (isProviderChecked || isSubscriberChecked);
      const isLimitValid = user.providerAccountLimit > 0;

      // If any validation fails, show generic message and return
      if (!isLoginValid || !isPasswordValid || !isNameValid || !isServerValid || !isPlatformValid || !isCopyFactoryValid || !isLimitValid) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      // All validations passed, proceed with account creation
      setIsLoading(true);
      let data = {};

      if (user.role === 'User') {
        data = {
          ...values,
          login: parseInt(values.login),
          name: values.name.trim(),
          server: values.server.trim(),
          password: values.password.trim()
        };
        data.copyFactoryRoles = ['SUBSCRIBER'];
      }

      if (user.role === 'Provider' || user.role === 'Admin') {
        data = {
          ...values,
          login: parseInt(values.login),
          name: values.name.trim(),
          server: values.server.trim(),
          password: values.password.trim()
        };
      }

      const result = await api.post('/account/register-account', data);

      if (result.data.AccountRegister) {
        dispatch({
          type: 'ADD_ID',
          payload: result.data.AccountRegister.id,
        });
        showToast('Account created successfully!', 'success');
        setIsLoading(false);
        navigate('/accounts');
      } else if (result.data.Error) {
        throw new Error(result.data.Error);
      } else {
        throw new Error('Please contact support');
      }
    } catch (err) {
      showToast(err.message || 'Account creation failed!', 'error');
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    api
      .get('/settings/brokers')
      .then((res) => {
        if (res.data.status === 'OK') {
          setBrokers(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <div className="py-0 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[200px]">
        <div className="pb-3">
          <Link
            to={'/accounts'}
            className="flex flex-row items-center font-extrabold text-[#E9D8C8] hover:text-[#11B3AE] transition-colors duration-200"
          >
            <ReplyRoundedIcon
              fontSize="medium"
              sx={{ color: '#E9D8C8', fontWeight: 'bold' }}
            />
            <h1 className="text-[#E9D8C8] text-base sm:text-lg pl-2"> Accounts</h1>
          </Link>
        </div>
        <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-[18px] border-b border-[#11B3AE] border-opacity-20 gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-[20px] font-normal text-[#E9D8C8]">Add Account</h2>
            {user.role === 'Provider' ? (
              <label className="text-[#E9D8C8] font-medium text-sm sm:text-base">
                Limit:{' '}
                <span className="text-[#11B3AE]">{user.providerAccountLimit}</span>
              </label>
            ) : (
              <></>
            )}
          </header>
          <div className="p-4 sm:p-[15px] bg-[#0B1220] box-border">
            <div className="border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px] flex flex-col sm:flex-row justify-start">
              <label className="text-[#E9D8C8] text-[13px] text-left sm:text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] inline-block relative max-w-full font-medium mb-2 sm:mb-0">
                Login
              </label>
              <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
                <input
                  name="login"
                  type="number"
                  required
                  className="bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg block w-full h-[34px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                  onChange={handleInputChange}
                />
                {((!values.login || values.login.toString().trim() === '') || (values.login && (isNaN(values.login) || parseInt(values.login) <= 0))) && createButtonClicked && (
                  <p className="mt-2 text-xs text-red-400">
                    Login required!
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-start mb-[15px] pb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
              <label className="text-[#E9D8C8] text-[13px] text-left sm:text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] inline-block relative max-w-full font-medium mb-2 sm:mb-0">
                Password
              </label>
              <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
                <input
                  name="password"
                  type="password"
                  required
                  className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[34px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                  onChange={handleInputChange}
                />
                {(!values.password || values.password.trim() === '') && createButtonClicked && (
                  <p className="mt-2 text-xs text-red-400">
                    Password required!
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-start pb-[15px] mb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
              <label className="text-[#E9D8C8] text-[13px] text-left sm:text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] inline-block relative max-w-full font-medium mb-2 sm:mb-0">
                Name
              </label>
              <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[34px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                  onChange={handleInputChange}
                />
                {((!values.name || values.name.trim() === '') || (values.name && values.name.trim().length < 2)) && createButtonClicked && (
                  <p className="mt-2 text-xs text-red-400">
                    Name required!
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-start pb-[15px] mb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
              <label className="text-[#E9D8C8] text-[13px] text-left sm:text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] inline-block relative max-w-full font-medium mb-2 sm:mb-0">
                Server
              </label>
              <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
                <input
                  name="server"
                  type="text"
                  required
                  minLength={2}
                  className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[34px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                  onChange={handleInputChange}
                />
                {((!values.server || values.server.trim() === '') || (values.server && values.server.trim().length < 2)) && createButtonClicked && (
                  <p className="mt-2 text-xs text-red-400">
                    Server required!
                  </p>
                )}
              </div>
            </div>
            <div
              className={`flex flex-col sm:flex-row justify-start ${user.role === 'User'
                ? ''
                : 'pb-[15px] mb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20'
                }`}
            >
              <label className="text-[#E9D8C8] text-[13px] text-left sm:text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] inline-block relative max-w-full font-medium mb-2 sm:mb-0">
                Platform
              </label>
              <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
                <FormControl fullWidth>
                  <Select
                    name="platform"
                    value={values.platform}
                    onChange={handleInputChange}
                    displayEmpty
                    input={
                      <OutlinedInput
                        sx={{
                          height: '34px',
                          fontSize: '0.875rem',
                          backgroundColor: '#0B1220',
                          color: '#E9D8C8',
                          borderRadius: '8px',
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
                  >
                    <MenuItem value={'mt4'}>MT4</MenuItem>
                    <MenuItem value={'mt5'}>MT5</MenuItem>
                    <MenuItem value={'nt8'}>NT8</MenuItem>
                  </Select>
                </FormControl>
                {(!values.platform || values.platform === '') && createButtonClicked && (
                  <p className="mt-2 text-xs text-red-400">
                    Platform required!
                  </p>
                )}
              </div>
            </div>
            {user.role === 'User' ? (
              <div></div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-start">
                <label className="text-[#E9D8C8] text-[13px] text-left sm:text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] inline-block relative max-w-full font-medium mb-2 sm:mb-0">
                  CopyFactoryRoles
                </label>
                <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-[7px]">
                    <div className="flex items-center cursor-pointer" onClick={() => {
                      setIsSubscriberChecked(true);
                      setIsProviderChecked(false);
                    }}>
                      <input
                        name="copyFactoryRole"
                        type="radio"
                        required
                        checked={isSubscriberChecked}
                        className="bg-[#0B1220] text-[#11B3AE] px-3 py-1.5 rounded w-4 accent-[#11B3AE] cursor-pointer"
                        onChange={() => {
                          setIsSubscriberChecked(true);
                          setIsProviderChecked(false);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label className="inline-block text-right w-1/4 pr-[15px] pl-[5px] relative max-w-full text-[#E9D8C8] text-[13px] font-medium cursor-pointer">
                        Subscriber
                      </label>
                    </div>
                    <div className="flex items-center cursor-pointer" onClick={() => {
                      setIsProviderChecked(true);
                      setIsSubscriberChecked(false);
                    }}>
                      <input
                        name="copyFactoryRole"
                        type="radio"
                        required
                        checked={isProviderChecked}
                        className="bg-[#0B1220] text-[#11B3AE] px-3 py-1.5 rounded w-4 accent-[#11B3AE] cursor-pointer"
                        onChange={() => {
                          setIsProviderChecked(true);
                          setIsSubscriberChecked(false);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label className="inline-block text-right w-1/4 pr-[15px] pl-[5px] relative max-w-full text-[#E9D8C8] text-[13px] font-medium cursor-pointer">
                        Provider
                      </label>
                    </div>
                  </div>
                  {user.role !== 'User' && !isProviderChecked &&
                    !isSubscriberChecked &&
                    createButtonClicked && (
                      <p className="mt-2 text-xs text-red-400">
                        CopyFactoryRoles required!
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>
          <footer className="px-4 sm:px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
            <div className="flex justify-center sm:grid sm:grid-cols-12 sm:gap-3">
              <div className="w-full sm:col-start-4 sm:col-span-4 sm:pl-3.5">
                <StyledButton
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#11B3AE!important',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                    },
                  }}
                  onClick={handleCreateAccount}
                  loading={isLoading}
                >
                  Create
                </StyledButton>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AddAccount;
