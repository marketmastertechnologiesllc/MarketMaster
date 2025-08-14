import * as React from 'react'
import api from '../../utils/api';
import useToast from '../../hooks/useToast';

function EmailVerificationPageForLogin() {
  const { showToast } = useToast();
  const [ loginEmail, setLoginEmail ] = React.useState('');

  React.useEffect(() => {
    setLoginEmail(localStorage.getItem('loginEmail'));
  }, []);

  const handleResendVerificationEmail = async () => {
    try {
      await api.post('/users/re-send/email-verification', { email: loginEmail });
      showToast('New verification email is successfully sent.', 'success');
    } catch (err) {
      showToast('Resending verification code failed!', 'error');
      console.log(err);
    }
  }

  return (
    <div className='flex flex-col justify-center bg-[#0B1220] text-[#E9D8C8] text-center h-full fixed top-0 right-0 left-0 bottom-0'>
      <div className="max-w-4xl mx-auto px-6 py-12 bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <h1 className='text-4xl md:text-5xl my-6 font-semibold text-[#E9D8C8]'>Your email address is not verified, verify your email to continue</h1>
        <h1 className='text-2xl md:text-3xl my-4 text-[#E9D8C8]'>We just sent an email to the address: <span className="text-[#11B3AE] font-semibold">{ loginEmail }</span></h1>
        <h1 className='text-xl md:text-2xl my-4 text-[#E9D8C8] opacity-90'>Please check your email and select the link provided to verify your address.</h1>
        <button 
          className='bg-[#11B3AE] hover:bg-[#0F9A95] text-white py-4 px-8 rounded-lg text-xl md:text-2xl w-full max-w-[400px] mx-auto my-8 transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)] focus:outline-none focus:ring-4 focus:ring-[rgba(17,179,174,0.3)]' 
          onClick={handleResendVerificationEmail}
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  )
}

export default EmailVerificationPageForLogin;
