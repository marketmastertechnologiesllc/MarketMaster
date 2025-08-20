import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validator from 'validator';

import api from '../../utils/api';
import useToast from '../../hooks/useToast';

import Logo from '../../assets/img/TradeMesh-MainLogo.png';

function SignUp() {
  const { showToast } = useToast();
  const initialValues = {
    email: '',
    fullName: '',
    password: '',
    confirm: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [signupButtonClicked, setSignupButtonClicked] = React.useState(false);
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
      setSignupButtonClicked(true);
      setIsLoading(true);
      if (
        values.email == '' ||
        values.password == '' ||
        values.fullName == '' ||
        values.confirm == ''
      ) {
        showToast('Please fill in all the information!', 'error');
      } else if (!validator.isEmail(values.email)) {
        showToast('Invalid email format!', 'error');
      } else if (values.password !== values.confirm) {
        showToast('Confirm is not match!', 'error');
      } else if (values.password.length < 6) {
        showToast('Your password must be at least 6 characters long!', 'error');
      } else {
        // delete values.confirm;
        const result = await api.post('/users/register', values);
        if (!localStorage.getItem('signupEmail')) {
          localStorage.setItem('signupEmail', values.email);
        } else {
          localStorage.removeItem('signupEmail');
          localStorage.setItem('signupEmail', values.email);
        }
        showToast('Registration success!', 'success');
        navigate('/email-verification-page-for-signup');
      }
    } catch (err) {
      let msg = 'Registration failed';
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
    <div className="w-screen h-screen flex flex-col px-3 items-center justify-center text-[#E9D8C8] bg-[#0B1220]">
      <div className="block max-w-md pt-2 w-full">
        <div className="flex flex-row justify-between h-10 gap-5 relative">
          <img 
            className='absolute -top-1 left-0 z-10' 
            style={{ height: '40px', width: '150px' }} 
            src={Logo} 
            alt="TradeMesh Logo" 
          />
          <label className="absolute top-0 right-0 px-5 py-2 rounded-md rounded-b-none bg-[#11B3AE] text-white font-medium shadow-[0_4px_12px_rgba(17,179,174,0.3)]">
            SIGN UP
          </label>
        </div>
      </div>
      <div className="block w-full max-w-md z-20 rounded-xl rounded-tr-none bg-[#0B1220] px-8 pt-8 pb-12 border border-t-[5px] border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <div className="w-full px-2 mx-auto">
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#E9D8C8]">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="shadow-sm text-base rounded-lg block w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] text-[#E9D8C8] placeholder-[rgba(233,216,200,0.7)] transition-all duration-200 focus:bg-[rgba(255,255,255,0.15)] focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[rgba(17,179,174,0.2)] hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(17,179,174,0.5)]"
              required
              onChange={handleInputChange}
            />
            {values.email === '' && signupButtonClicked && (
              <p className="mt-2 text-xs text-red-400">
                Email required!
              </p>
            )}
            {!validator.isEmail(values.email) &&
              values.email.length !== 0 &&
              signupButtonClicked && (
                <p className="mt-2 text-xs text-red-400">
                  Invalid email format!
                </p>
              )}
          </div>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#E9D8C8]">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="name"
              className="shadow-sm text-base rounded-lg block w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] text-[#E9D8C8] placeholder-[rgba(233,216,200,0.7)] transition-all duration-200 focus:bg-[rgba(255,255,255,0.15)] focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[rgba(17,179,174,0.2)] hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(17,179,174,0.5)]"
              onChange={handleInputChange}
            />
            {values.fullName == '' && signupButtonClicked && (
              <p className="mt-2 text-xs text-red-400">
                Full Name required!
              </p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-[#E9D8C8]"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              className="shadow-sm text-base rounded-lg block w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] text-[#E9D8C8] placeholder-[rgba(233,216,200,0.7)] transition-all duration-200 focus:bg-[rgba(255,255,255,0.15)] focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[rgba(17,179,174,0.2)] hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(17,179,174,0.5)]"
              onChange={handleInputChange}
            />
            {values.password == '' && signupButtonClicked && (
              <p className="mt-2 text-xs text-red-400">
                Password required!
              </p>
            )}
            {values.password.length < 6 &&
              values.password.length !== 0 &&
              signupButtonClicked && (
                <p className="mt-2 text-xs text-red-400">
                  Your password must be at least 6 characters long!
                </p>
              )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="confirm"
              className="block mb-2 text-sm font-medium text-[#E9D8C8]"
            >
              Confirm
            </label>
            <input
              type="password"
              id="confirm"
              name="confirm"
              className="shadow-sm text-base rounded-lg block w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] text-[#E9D8C8] placeholder-[rgba(233,216,200,0.7)] transition-all duration-200 focus:bg-[rgba(255,255,255,0.15)] focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[rgba(17,179,174,0.2)] hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(17,179,174,0.5)]"
              onChange={handleInputChange}
            />
            {values.confirm == '' && signupButtonClicked && (
              <p className="mt-2 text-xs text-red-400">
                Confirm required!
              </p>
            )}
            {values.confirm !== values.password &&
              values.confirm.length !== 0 &&
              signupButtonClicked && (
                <p className="mt-2 text-xs text-red-400">
                  Confirm not match!
                </p>
              )}
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-end justify-end mb-5">
            <label className="ms-2 text-sm font-medium text-[#E9D8C8]">
              Already have account?{' '}
              <Link
                to={'/auth/login'}
                className="text-[#11B3AE] hover:text-[#0F9A95] hover:underline transition-colors duration-200"
              >
                Go to login
              </Link>
            </label>
          </div>
          <button
            className="w-full bg-[#11B3AE] hover:bg-[#0F9A95] focus:ring-4 focus:outline-none focus:ring-[rgba(17,179,174,0.3)] font-medium rounded-lg text-base px-5 py-3 text-center flex justify-center text-white transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating account...
              </div>
            ) : (
              'Create new account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
