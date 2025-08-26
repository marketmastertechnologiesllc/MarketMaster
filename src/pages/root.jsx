import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';

function Root() {
  const [data, setData] = React.useState({
    title: '',
    body: '',
  });
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isInitialized, navigate]);

  React.useEffect(() => {
    api
      .get('/settings/homepage-content')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Don't render anything if user is authenticated (will redirect)
  if (isInitialized && isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-28 flex flex-col justify-between text-white">
      <Header />
      <div className="px-[15px] w-full">
        <section className="mb-5 rounded">
          <header className="bg-[#282D36] border-b-[#1d2127] border-b-[1px] rounded-t-[5px] p-[18px]">
            <h2 className="text-xl font-normal mt-[5px]">{data.title}</h2>
          </header>
          <div
            className="text-[#CCC] bg-[#2e353e] rounded-b-[5px] p-[15px] text-[13px] leading-[22px]"
            dangerouslySetInnerHTML={{ __html: data.body }}
          />
        </section>
      </div>
    </div>
  );
}

export default Root;
