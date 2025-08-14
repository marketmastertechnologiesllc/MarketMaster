import * as React from 'react';
import validator from 'validator';
import api from '../../utils/api';
import useToast from '../../hooks/useToast';

function ForgotPassword() {
  const { showToast } = useToast();
  const [ email, setEmail ] = React.useState('');
  const [ sendMailButtonClicked, setSendMailButtonClicked ] = React.useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPasswordClicked = async () => {
    try {
      setSendMailButtonClicked(true);
      if (email == '') {
        showToast('Please enter your email!', 'error');
      } else if (!validator.isEmail(email)) {
        showToast('Invalid email format!', 'error');
      } else {
        await api.get(`/users/reset-password/${email}`);
        showToast(`We sent reset password mail to ${email} and please check inbox`, 'success');
      }
    } catch (err) {
      console.log(err);
      showToast(`Sending reset password mail to ${email} failed`, 'error');
    }
  }

  return (
    <div className='flex flex-col justify-center bg-[#0B1220] text-[#E9D8C8] text-center h-full fixed top-0 right-0 left-0 bottom-0'>
      <div className="max-w-4xl mx-auto px-6 py-12 bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <h1 className='text-5xl md:text-6xl my-6 font-semibold text-[#E9D8C8]'>Forgot your Password?</h1>
        <h1 className='text-2xl md:text-3xl my-4 text-[#E9D8C8] opacity-90'>Enter your email address and we'll send you a link to reset your password</h1>
        <div className='flex flex-col justify-start items-center'>
          <label
            htmlFor="email"
            className="mb-2 mt-4 text-xl md:text-2xl font-medium text-[#E9D8C8]"
          >
            EMAIL ADDRESS
          </label>
          <input 
            className='max-w-[500px] text-2xl md:text-3xl rounded-lg px-4 py-3 text-[#E9D8C8] bg-[rgba(255,255,255,0.1)] border border-[rgba(17,179,174,0.3)] placeholder-[rgba(233,216,200,0.7)] transition-all duration-200 focus:bg-[rgba(255,255,255,0.15)] focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[rgba(17,179,174,0.2)] hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(17,179,174,0.5)]' 
            type='email' 
            name='email' 
            onChange={handleInputChange} 
          />
          {email === '' && sendMailButtonClicked && (
            <p className="mt-2 text-sm text-red-400">
              Email required!
            </p>
          )}
          {!validator.isEmail(email) &&
            email.length !== 0 &&
            sendMailButtonClicked && (
              <p className="mt-2 text-sm text-red-400">
                Invalid email format!
              </p>
            )}
        </div>
        <button 
          className='bg-[#11B3AE] hover:bg-[#0F9A95] text-white py-4 px-8 rounded-lg text-xl md:text-2xl w-full max-w-[200px] mx-auto my-8 transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)] focus:outline-none focus:ring-4 focus:ring-[rgba(17,179,174,0.3)]' 
          onClick={handleForgotPasswordClicked}
        >
          SEND EMAIL
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword;
