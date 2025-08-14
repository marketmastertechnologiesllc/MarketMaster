import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import Grid from '@mui/material/Grid';

import validator from 'validator';

import { useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';
import useUtils from '../../../hooks/useUtils';

// import utilsReducer from '../../store/reducers/utils';

function AddAccount() {
  const { showToast } = useToast();

  const initialValues = {
    fullName: '',
    password: '',
    email: ''
  };
  const [values, setValues] = React.useState(initialValues);
  const [isSubscriberChecked, setIsSubscriberChecked] = React.useState(false);
  const [isProviderChecked, setIsProviderChecked] = React.useState(false);
  const [createButtonClicked, setCreateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // const [utils, dispatch] = useReducer(utilsReducer);

  // const { ids, setIds } = useUtils();
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

  const handleCreateAccount = async () => {
    try {
      setCreateButtonClicked(true);
      if (
        values.fullName == '' ||
        values.password == '' ||
        values.email == ''
      ) {
        showToast('Please fill in all the information!', 'error');
      } else {
        setIsLoading(true);
        const result = await api.post('/users/register', values);
        
        if ( result.data.msg === "User created successfully" ) {
          showToast('User created successfully!', 'success');
        }

        setIsLoading(false);
        navigate('/whitelabel/users');
      }
    } catch (err) {
      showToast('User creation failed!', 'error');
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="pb-3">
        <Grid container sx={{ cursor: 'pointer' }} onClick={() => navigate("/whitelabel/users")}>
          <ReplyRoundedIcon
            fontSize="medium"
            sx={{ color: '#E9D8C8', fontWeight: 'bold' }}
          />
          <h1 className="text-[#E9D8C8] text-lg pl-2"> Whitelabel Users</h1>
        </Grid>
      </div>
      <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
          <h2 className="mt-[5px] text-[20px] font-normal text-[#FFFFFF]">Manually add user</h2>
        </header>
        <div className="p-[15px] bg-[#0B1220] box-border">
          <div className="border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px] flex justify-start">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full">
              User Name
            </label>
            <div className="w-1/2 px-[15px]">
              <input
                name="fullName"
                type="text"
                required
                className="bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg block w-full h-[34px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                onChange={handleInputChange}
              />
              {values.fullName == '' && createButtonClicked && (
                <p className="mt-2 text-xs text-red-400">
                  User Name required!
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-start mb-[15px] pb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full">
              User Email
            </label>
            <div className="w-1/2 px-[15px]">
              <input
                name="email"
                type="text"
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[34px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                onChange={handleInputChange}
              />
              {
                values.email == '' && createButtonClicked ?
                  <p className="mt-2 text-xs text-red-400">
                    User Email required!
                  </p> :
                !validator.isEmail( values.email ) && createButtonClicked && 
                  <p className="mt-2 text-xs text-red-400">
                    Invalid Email Format!
                  </p>
              }
            </div>
          </div>
          <div className="flex justify-start mb-[15px]">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full">
              User Password (min 6 chars)
            </label>
            <div className="w-1/2 px-[15px]">
              <input
                name="password"
                type="password"
                required
                minLength={2}
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[34px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                onChange={handleInputChange}
              />
              {
                values.password == '' && createButtonClicked ?
                  <p className="mt-2 text-xs text-red-400">
                    User Password required!
                  </p> :
                values.password.length < 6 && createButtonClicked &&  
                  <p className="mt-2 text-xs text-red-400">
                    User Password at least 6 characters!
                  </p>
              }
            </div>
          </div>
        </div>
        <footer className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
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
              </LoadingButton>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AddAccount;
