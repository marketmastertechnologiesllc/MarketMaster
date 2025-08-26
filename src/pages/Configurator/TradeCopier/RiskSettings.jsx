import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

import { useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';
import useUtils from '../../../hooks/useUtils';

// import utilsReducer from '../../store/reducers/utils';

function RiskSettings() {
  const { showToast } = useToast();

  const initialValues = {
    login: '',
    password: '',
    name: '',
    server: '',
    platform: '',
    copyFactoryRoles: [],
  };
  const [values, setValues] = React.useState(initialValues);
  const [isSubscriberChecked, setIsSubscriberChecked] = React.useState(false);
  const [isProviderChecked, setIsProviderChecked] = React.useState(false);
  const [createButtonClicked, setCreateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [brokers, setBrokers] = React.useState([]);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // React.useEffect(() => {
  //   if (isSubscriberChecked) {
  //     if (values.copyFactoryRoles.includes('SUBSCRIBER') == false) {
  //       values.copyFactoryRoles.push('SUBSCRIBER');
  //     }
  //   } else {
  //     values.copyFactoryRoles = values.copyFactoryRoles.filter(
  //       (role) => role !== 'SUBSCRIBER'
  //     );
  //   }
  //   if (isProviderChecked) {
  //     if (values.copyFactoryRoles.includes('PROVIDER') == false) {
  //       values.copyFactoryRoles.push('PROVIDER');
  //     }
  //   } else {
  //     values.copyFactoryRoles = values.copyFactoryRoles.filter(
  //       (role) => role !== 'PROVIDER'
  //     );
  //   }
  // }, [isSubscriberChecked, isProviderChecked]);

  // const handleCreateAccount = async () => {
  //   try {
  //     setCreateButtonClicked(true);
  //     if (
  //       values.login == '' ||
  //       values.password == '' ||
  //       values.name == '' ||
  //       values.server == '' ||
  //       values.platform == '' ||
  //       values.copyFactoryRoles.length == 0
  //     ) {
  //       showToast('Please fill in all the information!', 'error');
  //     } else {
  //       setIsLoading(true);
  //       const result = await api.post('/account/register-account', values);

  //       if (result.data.AccountRegister) {
  //         dispatch({
  //           type: 'ADD_ID',
  //           payload: result.data.AccountRegister.id,
  //         });
  //       } else {
  //         throw new Error('null account Register');
  //       }

  //       showToast('Account created successfully!', 'success');

  //       setIsLoading(false);
  //       navigate('/accounts');
  //     }
  //   } catch (err) {
  //     showToast('Account creation failed!', 'error');
  //     console.log(err);
  //     setIsLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   api
  //     .get('/settings/brokers')
  //     .then((res) => {
  //       if (res.data.status === 'OK') {
  //         setBrokers(res.data.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <header className="p-[18px] bg-[#0B1220] rounded-t-xl border-b border-[#11B3AE] border-opacity-20">
          <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Risk Settings</h2>
        </header>
        <div className="p-[15px] bg-[#0B1220] box-border">
          <div className="border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px] flex justify-start">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Reverse Trades
            </label>
            <div className="w-1/2 px-[15px]">
              <select
                name="server"
                value={values.server}
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              >
                <option value={false} className="bg-[#0B1220] text-[#E9D8C8]">No</option>
                <option value={true} className="bg-[#0B1220] text-[#E9D8C8]">Yes</option>
              </select>
              {/* {values.server == '' && createButtonClicked && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  Server required!
                </p>
              )} */}
            </div>
          </div>
          <div className="flex justify-start mb-[15px] pb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Risk Type
            </label>
            <div className="w-1/2 px-[15px]">
              <select
                name="server"
                value={values.server}
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              >
                <option value={''} className="bg-[#0B1220] text-[#E9D8C8]">Risk multiplier by balance</option>
                <option value={''} className="bg-[#0B1220] text-[#E9D8C8]">Risk multiplier by equity</option>
                <option value={''} className="bg-[#0B1220] text-[#E9D8C8]">Lot multiplier</option>
                <option value={''} className="bg-[#0B1220] text-[#E9D8C8]">Fixed lot</option>
              </select>
              {/* {values.server == '' && createButtonClicked && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  Server required!
                </p>
              )} */}
            </div>
          </div>
          <div className="flex justify-start pb-[15px] mb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Multiplier
            </label>
            <div className="w-1/2 px-[15px]">
              <input
                name="name"
                type="number"
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              />
              {/* {values.name == '' && createButtonClicked && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  Name required!
                </p>
              )} */}
            </div>
          </div>
          {/* <div className="flex justify-start pb-[15px] mb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Slippage
            </label>
            <div className="w-1/2 px-[15px]">
              <input
                name="name"
                type="number"
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              />
            </div>
          </div> */}
          {/* <div className="flex justify-start pb-[15px] mb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Max Lot
            </label>
            <div className="w-1/2 px-[15px]">
              <input
                name="name"
                type="number"
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              />
            </div>
          </div> */}
          {/* <div className="flex justify-start">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Force Min Lot
            </label>
            <div className="w-1/2 px-[15px]">
              <select
                name="platform"
                value={values.platform}
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              >
                <option value={false} className="bg-[#0B1220] text-[#E9D8C8]">No</option>
                <option value={true} className="bg-[#0B1220] text-[#E9D8C8]">Yes</option>
              </select>
              {values.platform == '' && createButtonClicked && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  Platform required!
                </p>
              )}
            </div>
          </div> */}
        </div>
        <footer className="px-[15px] py-[10px] bg-[#0B1220] rounded-b-xl border-t border-[#11B3AE] border-opacity-20">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-start-4 col-span-4 pl-3.5">
              <LoadingButton
                variant="contained"
                size="small"
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#11B3AE!important',
                  color: '#FFFFFF',
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
                // onClick={handleCreateAccount}
                loading={isLoading}
              >
                Update
              </LoadingButton>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default RiskSettings;
