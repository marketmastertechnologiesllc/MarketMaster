import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import api from '../../utils/api';
import useToast from '../../hooks/useToast';

function ResetPassword() {
  const { token } = useParams();
  const { showToast } = useToast();

  const navigate = useNavigate();

  const initialValues = {
    password: '',
    confirm: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [resetPasswordButtonClicked, setResetPasswordButtonClicked] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleResetPasswordClicked = async () => {
    try {
      setResetPasswordButtonClicked(true);
      if (
        values.password == '' ||
        values.confirm == ''
      ) {
        showToast('Please fill in all the information!', 'error');
        return;
      } else if (values.password !== values.confirm) {
        showToast('Confirm is not match!', 'error');
        return;
      } else if (values.password.length < 6) {
        showToast('Your password must be at least 6 characters long!', 'error');
        return;
      } else {
        // Try multiple API endpoint formats
        let success = false;
        let error = null;
        
        // Method 1: POST with token in body
        try {
          const result = await api.post('/users/reset-password/', { 
            password: values.password, 
            token: token 
          });
          showToast(result.data.msg || 'Password reset successfully!', 'success');
          navigate('/auth/login');
          success = true;
        } catch (err1) {
          error = err1;
        }
        
        // Method 2: POST without trailing slash
        if (!success) {
          try {
            const result = await api.post('/users/reset-password', { 
              password: values.password, 
              token: token 
            });
            showToast(result.data.msg || 'Password reset successfully!', 'success');
            navigate('/auth/login');
            success = true;
          } catch (err2) {
            error = err2;
          }
        }
        
        // Method 3: PUT request
        if (!success) {
          try {
            const result = await api.put('/users/reset-password', { 
              password: values.password, 
              token: token 
            });
            showToast(result.data.msg || 'Password reset successfully!', 'success');
            navigate('/auth/login');
            success = true;
          } catch (err3) {
            error = err3;
          }
        }
        
        // Method 4: POST with token in URL
        if (!success) {
          try {
            const result = await api.post(`/users/reset-password/${token}`, { 
              password: values.password
            });
            showToast(result.data.msg || 'Password reset successfully!', 'success');
            navigate('/auth/login');
            success = true;
          } catch (err4) {
            error = err4;
          }
        }
        
        // If all methods failed
        if (!success) {
          let errorMsg = 'Reset password failed';
          if (error && error.response && error.response.data) {
            if (error.response.data.msg) {
              errorMsg = error.response.data.msg;
            } else if (error.response.data.errors && error.response.data.errors[0]) {
              errorMsg = error.response.data.errors[0].msg;
            } else if (error.response.data.message) {
              errorMsg = error.response.data.message;
            }
          }
          showToast(errorMsg, 'error');
        }
      }
    } catch (err) {
      let errorMsg = 'Reset password failed';
      if (err.response && err.response.data && err.response.data.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.response && err.response.data && err.response.data.errors && err.response.data.errors[0]) {
        errorMsg = err.response.data.errors[0].msg;
      }
      showToast(errorMsg, 'error');
    }
  }

  return (
    <div className='flex flex-col justify-center bg-[#0B1220] text-[#E9D8C8] text-center h-full fixed top-0 right-0 left-0 bottom-0'>
      <div className="max-w-4xl mx-auto px-6 py-12 bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <h1 className='text-4xl md:text-5xl my-6 font-semibold text-[#E9D8C8]'>Reset Password</h1>
        <h1 className='text-xl md:text-2xl my-4 text-[#E9D8C8] opacity-90'>Please make sure your new password must be different from previous used passwords.</h1>
        
        <div className='flex flex-col justify-center items-center'>
          <div className='flex flex-col justify-start items-start w-full max-w-[500px]'>
            <label
              htmlFor="password"
              className="pl-2 mb-2 mt-4 text-lg font-medium text-[#E9D8C8]"
            >
              Password
            </label>
            <input 
              className='w-full text-xl md:text-2xl rounded-lg px-4 py-3 text-[#E9D8C8] bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] placeholder-[rgba(233,216,200,0.7)] transition-all duration-200 focus:bg-[rgba(255,255,255,0.15)] focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[rgba(17,179,174,0.2)] hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(17,179,174,0.5)]' 
              type='password' 
              name='password' 
              onChange={handleInputChange} 
            />
            {values.password === '' && resetPasswordButtonClicked && (
              <p className="mt-2 text-sm text-red-400">
                Password required!
              </p>
            )}
          </div>
          <div className='flex flex-col justify-start items-start w-full max-w-[500px]'>
            <label
              htmlFor="confirm"
              className="pl-2 mb-2 mt-4 text-lg font-medium text-[#E9D8C8]"
            >
              Confirm
            </label>
            <input 
              className='w-full text-xl md:text-2xl rounded-lg px-4 py-3 text-[#E9D8C8] bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] placeholder-[rgba(233,216,200,0.7)] transition-all duration-200 focus:bg-[rgba(255,255,255,0.15)] focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[rgba(17,179,174,0.2)] hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(17,179,174,0.5)]' 
              type='password' 
              name='confirm' 
              onChange={handleInputChange} 
            />
            {values.confirm === '' && resetPasswordButtonClicked && (
              <p className="mt-2 text-sm text-red-400">
                Confirm required!
              </p>
            )}
          </div>
        </div>
        <button 
          className='bg-[#11B3AE] hover:bg-[#0F9A95] text-white py-4 px-8 rounded-lg text-xl md:text-2xl w-full max-w-[250px] mx-auto my-8 transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)] focus:outline-none focus:ring-4 focus:ring-[rgba(17,179,174,0.3)]' 
          onClick={handleResetPasswordClicked}
        >
          RESET PASSWORD
        </button>
      </div>
    </div>
  )
}

export default ResetPassword;