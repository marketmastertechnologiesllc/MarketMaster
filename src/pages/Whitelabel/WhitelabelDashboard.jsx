import * as React from 'react';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import api from '../../utils/api';

function WhitelabelDashboard() {
  const [userCount, setUserCount] = React.useState(0);
  const [accountCount, setAccountCount] = React.useState(0);
  const [copierCount, setCopierCount] = React.useState(0);

  React.useEffect(() => {
    async function init() {
      const userData = await api.get('/users/all');
      const accountData = await api.get('/account/all-accounts');
      const copierData = await api.get('/account/app-copiers');
      setUserCount(userData.data.count);
      setAccountCount(accountData.data.length);
      setCopierCount(copierData.data);
    }
    init();
  },[])

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
