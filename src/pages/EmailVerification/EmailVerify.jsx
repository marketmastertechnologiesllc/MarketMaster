import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../utils/api';

function EmailVerify() {
  const { token } = useParams();
  const [ isEmailVerified, setIsEmailVerified ] = React.useState(false);

  React.useEffect(() => {
    async function verifyEmail() {
      try {
        const result = await api.get(`/users/verify-email/${token}`);
        setIsEmailVerified(result.data.emailVerified);
      } catch (err) {
        console.log(err);
        setIsEmailVerified(false);
      }
    }

    verifyEmail();
  }, [token])

  return (
    <div className='flex flex-col justify-center bg-[#0B1220] text-[#E9D8C8] text-center h-full fixed top-0 right-0 left-0 bottom-0'>
      <div className="max-w-4xl mx-auto px-6 py-12 bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        {isEmailVerified ? (
          <>
            <h1 className='text-4xl md:text-5xl my-6 font-semibold text-[#E9D8C8]'>Email Verified Successfully</h1>
            <h1 className='text-3xl md:text-4xl my-6 text-[#E9D8C8] opacity-90'>Go to login page</h1>
            <Link 
              to={'/auth/login'} 
              className='bg-[#11B3AE] hover:bg-[#0F9A95] text-white py-4 px-8 rounded-lg text-xl md:text-2xl w-full max-w-[200px] mx-auto my-8 inline-block transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)] focus:outline-none focus:ring-4 focus:ring-[rgba(17,179,174,0.3)]'
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <h1 className='text-4xl md:text-5xl my-6 font-semibold text-[#E9D8C8]'>Email Verification Failed</h1>
            <h1 className='text-3xl md:text-4xl my-6 text-[#E9D8C8] opacity-90'>Go to login page and retry</h1>
            <Link 
              to={'/auth/login'} 
              className='bg-[#11B3AE] hover:bg-[#0F9A95] text-white py-4 px-8 rounded-lg text-xl md:text-2xl w-full max-w-[200px] mx-auto my-8 inline-block transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)] focus:outline-none focus:ring-4 focus:ring-[rgba(17,179,174,0.3)]'
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default EmailVerify;