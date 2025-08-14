import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import useToast from '../../hooks/useToast';

function MyDetails() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const navigate = useNavigate();

  const initialValues = {
    email: user.email,
    fullName: user.fullName,
  };
  const [values, setValues] = React.useState(initialValues);
  const [updateButtonClicked, setUpdateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleUpdateButtonClick = async () => {
    try {
      setUpdateButtonClicked(true);
      if (values.email == '' || values.fullName == '') {
        showToast('Please fill in all the information!', 'error');
      } else {
        if(!localStorage.getItem('updateEmail')) {
          localStorage.setItem('updateEmail', values.email);
        } else {
          localStorage.removeItem('updateEmail');
          localStorage.setItem('updateEmail', values.email);
        }
        setIsLoading(true);
        const result = await api.put('/users/me', values);
        setValues({ email: result.data.email, fullName: result.data.fullName });
        showToast('User profile updated successfully!', 'success');
        if (user.email !== values.email) {
          navigate('/email-verification-page-for-update');
        }
      }
    } catch (err) {
      console.log(err);
      showToast(err.response.data.msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
      <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
        <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">My Details</h2>
      </header>
      <div className="p-[15px] bg-[#0B1220] box-border">
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Email
          </label>
          <div className="w-1/2 px-[15px]">
            <input
              name="email"
              type="email"
              required
              className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
              onChange={handleInputChange}
              value={values.email}
              placeholder="Enter your email"
            />
            {values.email == '' && updateButtonClicked && (
              <p className="mt-2 text-sm text-[#fa5252] font-medium">
                Email required!
              </p>
            )}
            {!validator.isEmail(values.email) &&
              values.email.length !== 0 &&
              updateButtonClicked && (
                <p className="mt-2 text-sm text-[#fa5252] font-medium">
                  Invalid email format!
                </p>
              )}
          </div>
        </div>
        <div className="flex justify-start">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Full Name
          </label>
          <div className="w-1/2 px-[15px]">
            <input
              name="fullName"
              type="text"
              required
              className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
              onChange={handleInputChange}
              value={values.fullName}
              placeholder="Enter your full name"
            />
            {values.fullName == '' && updateButtonClicked && (
              <p className="mt-2 text-sm text-[#fa5252] font-medium">
                Full Name required!
              </p>
            )}
          </div>
        </div>
      </div>
      <footer className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-start-4 col-span-4 pl-3.5">
            <LoadingButton
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#11B3AE!important',
                color: '#FFFFFF!important',
                fontWeight: 500,
                borderRadius: '8px',
                padding: '8px 16px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#0F9A95!important',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
                '&:disabled': {
                  backgroundColor: '#666!important',
                  color: '#999!important',
                },
              }}
              onClick={handleUpdateButtonClick}
              loading={isLoading}
            >
              Update
            </LoadingButton>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MyDetails;
