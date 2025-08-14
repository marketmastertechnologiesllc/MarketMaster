import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';

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

function CreateNewTradeCopier() {
  const { showToast } = useToast();

  const initialValues = {
    copyFrom: '',
    sendTo: '',
    // name: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    React.useState(false);
  const [createCopierButtonClicked, setCreateCopierButtonClicked] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [accountData, setAccountData] = React.useState([]);
  const [strategyData, setStrategyData] = React.useState([]);
  const [isDataLoading, setIsDataLoading] = React.useState(true);

  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchData() {
      try {
        setIsDataLoading(true);
        // let tempStrategy = [];
        const response = await api.get('/account/my-accounts');
        const responseStrategyList = await api.get('/strategy/strategy-list');
        setAccountData(response.data.data);
        setStrategyData(responseStrategyList.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load data. Please try again.', 'error');
      } finally {
        setIsDataLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleCreateCopierButtonClick = async () => {
    try {
      setCreateCopierButtonClicked(true);
      
      // Validation checks
      if (values.copyFrom === '') {
        showToast('Please select a strategy to copy from!', 'error');
        return;
      }
      
      if (values.sendTo === '') {
        showToast('Please select an account to send to!', 'error');
        return;
      }
      
      if (!isTermsAndConditionsChecked) {
        showToast('Please accept the Terms & Conditions!', 'error');
        return;
      }

      // All validations passed, proceed with request
      const selectedStrategy = strategyData.find(strategy => strategy.strategyId === values.copyFrom);
      const selectedAccount = accountData.find(account => account.accountId === values.sendTo);
      setIsLoading(true);
      setCreateCopierButtonClicked(true);
      const data = {
        subject: 'Request to create a new trade copier',
        department: 'Create Copier',
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #0088CC; padding-bottom: 10px;">
                Trade Copier Creation Request
              </h2>
              
              <div style="margin-bottom: 20px;">
                <h3 style="color: #0088CC; margin-bottom: 10px;">Copy From (Strategy)</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #0088CC;">
                  <strong>Name:</strong> ${selectedStrategy.name}<br>
                  <strong>Login:</strong> ${selectedStrategy.accounts.login}<br>
                  <strong>Strategy ID:</strong> ${values.copyFrom}
                </div>
              </div>
              
              <div style="margin-bottom: 20px;">
                <h3 style="color: #0088CC; margin-bottom: 10px;">Send To (Account)</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">
                  <strong>Name:</strong> ${selectedAccount.name}<br>
                  <strong>Login:</strong> ${selectedAccount.login}<br>
                  <strong>Subscriber ID:</strong> ${values.sendTo}
                </div>
              </div>
            </div>
          </div>
        `
      }
      const addCopier = await api.post('/strategy/add-copier', {
        strategyId: values.copyFrom,
        copierId: values.sendTo,
      });
      if (addCopier.data.status === "OK") {
        showToast('New copier created successfully!', 'success');
      } else {
        const res = await api.post('/users/contact', data);
        if (res.data.status === "OK") {
          showToast("Request sent successfully", "success");
        } else {
          showToast("Request failed", "error");
        }
      }
      setIsLoading(false);
      navigate('/trade-copier');
    } catch (err) {
      showToast(err.response?.data?.msg || 'An error occurred while creating the copier', 'error');
      console.log(err);
      setIsLoading(false);
    }
  };
return (
  <div className="w-auto text-[#E9D8C8] pb-[100px]">
    <div className="py-0 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <div className="pb-3">
        <Link
          to={'/trade-copier'}
          className="flex flex-row items-center font-extrabold text-[#E9D8C8] hover:text-[#11B3AE] transition-colors duration-200"
        >
          <ReplyRoundedIcon
            fontSize="medium"
            sx={{ color: 'currentColor', fontWeight: 'bold' }}
          />
          <h1 className="text-base sm:text-lg pl-2"> My Copiers</h1>
        </Link>
      </div>
      <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <header className="p-4 sm:p-[18px] bg-[#0B1220] rounded-t-xl border-b border-[#11B3AE] border-opacity-20">
          <h2 className="mt-[5px] text-lg sm:text-[20px] font-normal text-[#E9D8C8]">
            Create New Trade Copier
          </h2>
        </header>
        <div className="box-border p-4 sm:p-[15px] bg-[#0B1220]">
          <div className="flex flex-col sm:flex-row justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
            <label className="inline-block relative max-w-full text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] text-[#E9D8C8] text-[13px] font-medium mb-2 sm:mb-0">
              Copy from
            </label>
            <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
              <FormControl fullWidth>
                <Select
                  name="copyFrom"
                  value={values.copyFrom}
                  onChange={handleInputChange}
                  disabled={isDataLoading}
                  displayEmpty
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
                        height: '40px',
                        color: isDataLoading ? '#666' : '#E9D8C8',
                        borderRadius: '8px',
                        backgroundColor: isDataLoading ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
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
                  {isDataLoading && (
                    <MenuItem value="" disabled sx={{ color: '#E9D8C8 !important' }}>
                      <em>Loading strategies...</em>
                    </MenuItem>
                  )}
                  {!isDataLoading && strategyData.length > 0 &&
                    strategyData.map((account, idx) => (
                      <MenuItem
                        key={idx}
                        value={account.strategyId}
                        sx={{
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
                        }}
                      >
                        {`${account.name}(${account.accounts.login})`}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {values.copyFrom == '' && createCopierButtonClicked && (
                <p className="mt-2 text-xs text-[#fa5252] font-medium">
                  Copy from required!
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
            <label className="inline-block relative max-w-full text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] text-[#E9D8C8] text-[13px] font-medium mb-2 sm:mb-0">
              Send to
            </label>
            <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
              <FormControl fullWidth>
                <Select
                  name="sendTo"
                  value={values.sendTo}
                  onChange={handleInputChange}
                  disabled={isDataLoading}
                  displayEmpty
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
                        height: '40px',
                        color: isDataLoading ? '#666' : '#E9D8C8',
                        borderRadius: '8px',
                        backgroundColor: isDataLoading ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
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
                  {isDataLoading && (
                    <MenuItem value="" disabled sx={{ color: '#E9D8C8 !important' }}>
                      <em>Loading accounts...</em>
                    </MenuItem>
                  )}
                  {!isDataLoading && accountData.length > 0 &&
                    accountData
                      .filter(
                        (account) =>
                          account.copyFactoryRoles.indexOf('SUBSCRIBER') !== -1
                      )
                      .map((account) => (
                        <MenuItem
                          key={account.accountId}
                          value={account.accountId}
                          sx={{
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
                          }}
                        >
                          {`${account.name}(${account.login})`}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
              {values.sendTo == '' && createCopierButtonClicked && (
                <p className="mt-2 text-xs text-[#fa5252] font-medium">
                  Send to required!
                </p>
              )}
            </div>
          </div>
          {/* <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
            <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#ccc] text-[13px]">
              Name
            </label>
            <div className="w-1/2 px-[15px]">
              <input
                name="name"
                type="text"
                required
                minLength={2}
                className="block w-full h-[34px] text-sm bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                onChange={handleInputChange}
              />
              {values.name == '' && createCopierButtonClicked && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  Name required!
                </p>
              )}
            </div>
          </div> */}
          <div className="flex flex-col sm:flex-row justify-start">
            <label className="inline-block relative max-w-full text-right w-full sm:w-1/4 pt-[7px] px-0 sm:px-[15px] text-[#E9D8C8] text-[13px]"></label>
            <div className="w-full sm:w-1/2 px-0 sm:px-[15px]">
              <label className="flex items-center gap-1 pt-[7px] cursor-pointer hover:opacity-80 transition-opacity duration-200">
                <input
                  name="subscriber"
                  type="checkbox"
                  required
                  className="bg-[#0B1220] text-[#11B3AE] px-3 py-1.5 rounded w-4 h-4 border-[#11B3AE] border-opacity-30 focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                  onChange={() =>
                    setIsTermsAndConditionsChecked(
                      !isTermsAndConditionsChecked
                    )
                  }
                />
                <span className="text-[#E9D8C8] text-[13px] font-medium select-none">
                  I have read the T&C&apos;s
                </span>
              </label>
              {createCopierButtonClicked &&
                isTermsAndConditionsChecked == false && (
                  <p className="mt-2 text-xs text-[#fa5252] font-medium">
                    Please check T&C!
                  </p>
                )}
            </div>
          </div>
        </div>
        <footer className="px-4 sm:px-[15px] py-[10px] bg-[#0B1220] rounded-b-xl border-t border-[#11B3AE] border-opacity-20">
          <div className="flex justify-center sm:grid sm:grid-cols-12 sm:gap-3">
            <div className="w-full sm:col-start-4 sm:col-span-4 sm:pl-3.5">
              <StyledButton
                variant="contained"
                size="small"
                disabled={isDataLoading}
                sx={{
                  backgroundColor: isDataLoading ? '#666!important' : '#11B3AE!important',
                  color: '#FFFFFF',
                  fontWeight: 500,
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: isDataLoading ? '#666!important' : '#0F9A95!important',
                    transform: isDataLoading ? 'none' : 'translateY(-1px)',
                    boxShadow: isDataLoading ? 'none' : '0 4px 12px rgba(17, 179, 174, 0.3)',
                  },
                  '&:disabled': {
                    backgroundColor: '#666!important',
                    color: '#999',
                    cursor: 'not-allowed',
                  },
                }}
                onClick={handleCreateCopierButtonClick}
                loading={isLoading}
              >
                {isDataLoading ? 'Loading...' : 'Create Copier'}
              </StyledButton>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
);
}

export default CreateNewTradeCopier;
