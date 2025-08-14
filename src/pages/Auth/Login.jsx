import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validator from 'validator';

import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

import Logo from '../../assets/img/TradeMesh-MainLogo.png';

function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();

  const initialValues = {
    email: '',
    password: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [loginButtonClicked, setLoginButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoginButtonClicked(true);
      setIsLoading(true);
      if (values.email == '' || values.password == '') {
        showToast('Please fill in all the information!', 'error');
      } else if (!validator.isEmail(values.email)) {
        showToast('Invalid email format!', 'error');
      } else {
        // delete values.confirm;
        if (!localStorage.getItem('loginEmail')) {
          localStorage.setItem('loginEmail', values.email);
        } else {
          localStorage.removeItem('loginEmail');
          localStorage.setItem('loginEmail', values.email);
        }
        await login(values);
        showToast('Login success!', 'success');

        const expired = localStorage.getItem('expired');
        const prevPath = localStorage.getItem('prevPath');
        if (expired && prevPath) {
          localStorage.removeItem('expired');
          navigate(prevPath);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      let msg = 'Login failed';
      if (err.response) {
        msg = err.response.data.errors[0].msg;
      }
      showToast(msg, 'error');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-[#E9D8C8] bg-[#0B1220]">
      <div className="block max-w-md pt-2 w-full">
        <div className="flex flex-row justify-between h-10 relative">
          <img 
            className='absolute -top-1 left-0 z-10' 
            style={{ height: '40px', width: '150px' }} 
            src={Logo} 
            alt="TradeMesh Logo" 
          />
          <div className="absolute top-0 right-0 px-[17px] py-[13px] rounded-md rounded-b-none bg-[#11B3AE] text-[12px] flex flex-row items-center shadow-[0_4px_12px_rgba(17,179,174,0.3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <p className="pl-1 font-medium text-[16px]">LOGIN</p>
          </div>
        </div>
      </div>
      <div className="block max-w-m z-20 rounded-xl rounded-tr-none bg-[#0B1220] p-6 border-t-[5px] border-[#11B3AE] px-8 pt-8 pb-12 shadow-[0_0_16px_rgba(17,179,174,0.5)] border border-[#11B3AE]">
        <div className="w-96 mx-auto">
          <div className="mb-8">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#E9D8C8]">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="shadow-sm text-base rounded-lg block w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] placeholder-[#E9D8C8] placeholder-opacity-70 text-[#E9D8C8] transition-all duration-200 focus:outline-none focus:border-[#11B3AE] focus:bg-[rgba(255,255,255,0.15)] focus:shadow-[0_0_0_2px_rgba(17,179,174,0.2)] hover:border-[rgba(17,179,174,0.5)]"
              onChange={handleInputChange}
              required
            />
            {values.email === '' && loginButtonClicked && (
              <p className="mt-2 text-xs text-red-400">
                Email required!
              </p>
            )}
            {!validator.isEmail(values.email) &&
              values.email.length !== 0 &&
              loginButtonClicked && (
                <p className="mt-2 text-xs text-red-400">
                  Invalid email format!
                </p>
              )}
          </div>
          <div className="mb-8">
            <div className="flex flex-row items-center justify-between">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-[#E9D8C8]"
              >
                Password
              </label>
              <Link
                to={'/forgot-password'}
                className="text-[13px] text-right w-full inline-block mb-2 text-[#11B3AE] hover:text-[#0F9A95] transition-colors duration-200"
              >
                Forgot password
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow-sm text-base rounded-lg block w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] placeholder-[#E9D8C8] placeholder-opacity-70 text-[#E9D8C8] transition-all duration-200 focus:outline-none focus:border-[#11B3AE] focus:bg-[rgba(255,255,255,0.15)] focus:shadow-[0_0_0_2px_rgba(17,179,174,0.2)] hover:border-[rgba(17,179,174,0.5)]"
              onChange={handleInputChange}
              required
            />
            {values.password == '' && loginButtonClicked && (
              <p className="mt-2 text-xs text-red-400">
                Password required!
              </p>
            )}
            {values.password.length < 6 &&
              values.password.length !== 0 &&
              loginButtonClicked && (
                <p className="mt-2 text-xs text-red-400">
                  Your password must be at least 6 characters long!
                </p>
              )}
          </div>
          <div className="flex items-start mb-8 justify-between">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                value=""
                className="w-4 h-4 border rounded focus:ring-3 bg-[rgba(255,255,255,0.1)] border-[rgba(17,179,174,0.3)] focus:ring-[#11B3AE] ring-offset-[#0B1220] focus:ring-offset-[#0B1220] accent-[#11B3AE]"
                required
              />
              <label
                htmlFor="terms"
                className="ms-2 text-sm font-medium text-[#E9D8C8]"
              >
                Remember{' '}
              </label>
            </div>
            <label
              htmlFor="terms"
              className="ms-2 text-sm font-medium text-[#E9D8C8]"
            >
              Create new account?{' '}
              <Link
                to={'/auth/signup'}
                className="text-[#11B3AE] hover:text-[#0F9A95] transition-colors duration-200"
              >
                Go to signup
              </Link>
            </label>
          </div>
          <button
            className="w-full text-center bg-[#11B3AE] hover:bg-[#0F9A95] focus:ring-4 focus:outline-none focus:ring-[rgba(17,179,174,0.3)] font-medium rounded-lg text-sm px-3 py-3 flex justify-center items-center transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
