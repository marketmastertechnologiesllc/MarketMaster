import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';
import Symbols from '../../../constants/symbols.json'

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

function ForexSuffix() {
  const { showToast } = useToast();
  const { id } = useParams();

  const [symbols, setSymbols] = React.useState(Symbols.symbols);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdateClicked = async () => {
    try {
      setIsLoading(true);
      // const response = await api.put(`/account/${id}`);
      // setSymbols(response.data.symbols);
      // showToast('User profile updated successfully!', 'success');
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
      <div className="p-[15px] bg-[#0B1220] box-border text-[#E9D8C8]">
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Forex suffix
          </label>
          <div className="flex w-1/2 px-[15px] justify-start items-center">
            <input
              id="inline-radio"
              type="radio"
              value=""
              name="inline-radio-group"
              className="w-4 h-4 text-[#11B3AE] bg-[#0B1220] border-[#11B3AE] border-opacity-30 rounded-full focus:ring-[#11B3AE] focus:ring-opacity-20"
              checked
            />
            <label
              htmlFor="inline-radio"
              className="ms-2 text-sm font-medium text-[#E9D8C8] italic"
            >
              No suffix
            </label>
          </div>
        </div>
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Available Forex Symbols
          </label>
          <div className="w-1/2 px-[15px]">
            <label className="block w-full h-[350px] text-sm text-[#E9D8C8] px-3 py-1.5 rounded-lg overflow-y-auto bg-[#0B1220] border border-[#11B3AE] border-opacity-20">
              {symbols.length > 0 &&
                symbols.map((symbol, id) => <p key={id} className="py-1">{symbol}</p>)}
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
              onClick={handleUpdateClicked}
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

export default ForexSuffix;
