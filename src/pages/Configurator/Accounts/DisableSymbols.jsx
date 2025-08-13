import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

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

function DisableSymbols() {
  const { showToast } = useToast();

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirm: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleUpdateClicked = async () => {
    try {
      // setUpdateButtonClicked(true);
      // setIsLoading(true);
      // if (
      //   values.oldPassword == '' ||
      //   values.newPassword == '' ||
      //   values.confirm == ''
      // ) {
      //   showToast('Please fill in all the information!', 'error');
      // } else if (values.newPassword !== values.confirm) {
      //   showToast('Confirm is not match!', 'error');
      // } else if (values.newPassword.length < 6) {
      //   showToast('Your password must be at least 6 characters long!', 'error');
      // } else {
      //   const res = await api.put('/users/update-password', values);
      //   showToast(res.data.msg, 'success');
      // }
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
        <div className="flex justify-between">
          <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Disable Symbols</h2>
          <div className="inline-flex rounded-lg overflow-hidden">
            <button className="bg-[#11B3AE] hover:bg-[#0F9A95] inline-flex items-center justify-center py-1.5 px-3 text-center text-sm font-medium text-white transition-all duration-200">
              Enable all
            </button>
            <button className="bg-[#0B1220] hover:bg-[#11B3AE] hover:bg-opacity-20 inline-flex items-center justify-center py-1.5 px-3 text-center text-sm font-medium text-[#E9D8C8] transition-all duration-200 border-l border-[#11B3AE] border-opacity-30">
              Disable all
            </button>
          </div>
        </div>
        <strong className="text-[#E9D8C8] text-[13px] font-medium">
          <span className="text-[#11B3AE]">{  }</span> Enabled symbols
        </strong>{' '}
        |{' '}
        <strong className="text-[#E9D8C8] text-[13px] font-medium">
          <span className="text-[#fa5252]"> 0 </span> Disabled symbols
        </strong>
      </header>
      <div className="p-[18px] bg-[#0B1220] border-b border-[#11B3AE] border-opacity-20">
        <div className="flex justify-between">
          <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Forex symbols</h2>
          <div className="inline-flex rounded-lg overflow-hidden">
            <button className="bg-[#11B3AE] hover:bg-[#0F9A95] inline-flex items-center justify-center py-1.5 px-3 text-center text-sm font-medium text-white transition-all duration-200">
              Enable
            </button>
            <button className="bg-[#0B1220] hover:bg-[#11B3AE] hover:bg-opacity-20 inline-flex items-center justify-center py-1.5 px-3 text-center text-sm font-medium text-[#E9D8C8] transition-all duration-200 border-l border-[#11B3AE] border-opacity-30">
              Disable
            </button>
          </div>
        </div>
      </div>
      <div className="box-border px-[20px] bg-[#0B1220]">
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <h2 className="text-[20px] font-normal pr-3 text-[#E9D8C8]">No suffix</h2>
          <div className="flex items-center justify-center rounded-lg overflow-hidden">
            <button className="bg-[#11B3AE] hover:bg-[#0F9A95] items-center justify-center py-[1px] px-[5px] text-center text-xs font-medium text-white transition-all duration-200">
              Enable
            </button>
            <button className="bg-[#0B1220] hover:bg-[#11B3AE] hover:bg-opacity-20 items-center justify-center py-[1px] px-[5px] text-center text-xs font-medium text-[#E9D8C8] transition-all duration-200 border-l border-[#11B3AE] border-opacity-30">
              Disable
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 pb-[15px]">
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
              <input type="checkbox" />
              <span className="text-[13px]">AUDCAD</span>
            </label>
          </div>
        </div>
      </div>
      <footer className="px-[15px] py-[10px]">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-start-1 col-span-4 pl-3.5">
            <LoadingButton
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#0088CC!important',
                alignItems: 'center',
              }}
              onClick={handleUpdateClicked}
              loading={isLoading}
            >
              Update
            </LoadingButton>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DisableSymbols;
