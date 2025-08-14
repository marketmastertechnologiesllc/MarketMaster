import * as React from 'react';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import api from '../../utils/api';

function WhitelabelDashboard() {
  const [userCount, setUserCount] = React.useState(0);
  const [accountCount, setAccountCount] = React.useState(0);
  const [copierCount, setCopierCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Make all API calls in parallel for better performance
        const [userData, accountData, copierData] = await Promise.all([
          api.get('/users/all'),
          api.get('/account/all-accounts'),
          api.get('/account/app-copiers')
        ]);
        
        setUserCount(userData.data.count);
        setAccountCount(accountData.data.length);
        setCopierCount(copierData.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11B3AE]"></div>
          <p className="text-[#E9D8C8] text-lg font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-red-400 text-6xl">⚠️</div>
          <p className="text-red-400 text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#11B3AE] hover:bg-[#0F9A95] text-white rounded-lg transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 w-full">
      <div className="flex w-1/3 relative overflow-hidden rounded-xl bg-[#0B1220] px-4 pb-5 pt-5 shadow-[0_0_16px_rgba(17,179,174,0.3)] border border-[#11B3AE] hover:shadow-[0_0_24px_rgba(17,179,174,0.4)] transition-all duration-200">
        <GroupsRoundedIcon
          sx={{
            color: 'white',
            borderRadius: '50%',
            backgroundColor: '#11B3AE',
            padding: '15px',
            width: '70px',
            height: '70px',
            display: 'flex',
            boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
          }}
        />
        <dd className="flex flex-col justify-center ml-6">
          <p className="text-base font-semibold text-[#E9D8C8]">Users</p>
          <p className="flex items-baseline text-2xl font-bold text-[#11B3AE]">
            {userCount}
          </p>
        </dd>
      </div>
      <div className="flex w-1/3 relative overflow-hidden rounded-xl bg-[#0B1220] px-4 pb-5 pt-5 shadow-[0_0_16px_rgba(17,179,174,0.3)] border border-[#11B3AE] hover:shadow-[0_0_24px_rgba(17,179,174,0.4)] transition-all duration-200">
        <ViewListRoundedIcon
          sx={{
            color: 'white',
            borderRadius: '50%',
            backgroundColor: '#11B3AE',
            padding: '15px',
            width: '70px',
            height: '70px',
            display: 'flex',
            boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
          }}
        />
        <dd className="flex flex-col justify-center ml-6">
          <p className="text-base font-semibold text-[#E9D8C8]">Accounts</p>
          <p className="flex items-baseline text-2xl font-bold text-[#11B3AE]">
            {accountCount}
          </p>
        </dd>
      </div>
      <div className="flex w-1/3 relative overflow-hidden rounded-xl bg-[#0B1220] px-4 pb-5 pt-5 shadow-[0_0_16px_rgba(17,179,174,0.3)] border border-[#11B3AE] hover:shadow-[0_0_24px_rgba(17,179,174,0.4)] transition-all duration-200">
        <ShareRoundedIcon
          sx={{
            color: 'white',
            borderRadius: '50%',
            backgroundColor: '#11B3AE',
            padding: '15px',
            width: '70px',
            height: '70px',
            display: 'flex',
            boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
          }}
        />
        <dd className="flex flex-col justify-center ml-6">
          <p className="text-base font-semibold text-[#E9D8C8]">Copiers</p>
          <p className="flex items-baseline text-2xl font-bold text-[#11B3AE]">
            {copierCount}
          </p>
        </dd>
      </div>
    </div>
  );
}

export default WhitelabelDashboard;
