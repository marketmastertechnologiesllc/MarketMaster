import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import useAuth from '../../../hooks/useAuth';
import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';

const StyledButton = styled(LoadingButton)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#0F9A95',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
    transform: 'translateY(-1px)',
  },
}));

function AccountProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = {
    accountName: '',
    mySuffix: '',
    accountLogin: '',
    broker: '',
    type: '',
    server: ''
  };
  const [values, setValues] = React.useState(initialValues);
  const [updateButtonClicked, setUpdateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      const response = await api.get(`/account/${id}`);
      const { name, login, broker, type, server } = response.data;
      setValues({ accountName: name, accountLogin: login, broker: broker, type: type, server: server });
    }
    init();
  }, []);

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
      if (values.accountName == '') {
        showToast('Please fill in the Descriptive Name field!', 'error');
      } else {
        setIsLoading(true);
        const response = await api.put(`/account/update-account-name/${id}`, { accountName: values.accountName, server: values.server });
        showToast('User profile updated successfully!', 'success');
      }
    } catch (err) {
      console.log(err);
      showToast(err.response.data.msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
      <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
        <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">General</h2>
      </header>
      <div className="p-[15px] bg-[#0B1220] box-border">
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Descriptive Name
          </label>
          <div className="w-1/2 px-[15px]">
            <input
              name="accountName"
              type="text"
              required
              className="block w-full h-[34px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
              onChange={handleInputChange}
              value={values.accountName}
            />
          </div>
        </div>
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            My Suffix
          </label>
          <div className="w-1/2 px-[15px]">
            <label className="block w-full h-[34px] text-sm text-[#E9D8C8] px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#11B3AE] border-opacity-20">
              {values.email}
            </label>
          </div>
        </div>
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Account
          </label>
          <div className="w-1/2 px-[15px]">
            <label className="block w-full h-[34px] text-sm text-[#E9D8C8] px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#11B3AE] border-opacity-20">
              {values.accountLogin}
            </label>
          </div>
        </div>
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Broker
          </label>
          <div className="w-1/2 px-[15px]">
            <label className="block w-full h-[34px] text-sm text-[#E9D8C8] px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#11B3AE] border-opacity-20">
              {values.broker}
            </label>
          </div>
        </div>
        <div className="flex justify-start">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Type
          </label>
          <div className="w-1/2 px-[15px]">
            <label className="block w-full h-[34px] text-sm text-[#E9D8C8] px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#11B3AE] border-opacity-20">
              {values.type === 'ACCOUNT_TRADE_MODE_DEMO' ? 'Demo' : 'Real'}
            </label>
          </div>
        </div>
      </div>
      <footer className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-start-4 col-span-4 pl-3.5">
            <StyledButton
              variant="contained"
              sx={{
                backgroundColor: '#11B3AE!important',
                color: '#FFFFFF',
                fontWeight: 500,
                alignItems: 'center',
                padding: '8px 16px',
                fontSize: '0.875rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#0F9A95!important',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
              }}
              onClick={handleUpdateButtonClick}
              loading={isLoading}
            >
              Update
            </StyledButton>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AccountProfile;
