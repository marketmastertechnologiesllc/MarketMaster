import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useParams } from 'react-router-dom';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';

function General() {
  const { showToast } = useToast();
  const { subscriberId, strategyId } = useParams();

  const initialValues = {
    copyFrom: '',
    sendTo: '',
    closeOnly: '',
    comment: '', // TODO: implement trade comment
    subscriberName: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      const accountData = await api.get(`/account/${subscriberId}`);
      const subscriberData = await api.get(`/subscriber/${subscriberId}`);
      const strategyData = await api.get(`/strategy/${strategyId}`);
      setValues({
        copyFrom: `${accountData.data.name}(${accountData.data.login})`,
        sendTo: `${strategyData.data.name}(${strategyData.data.strategyId})`,
        subscriberName: subscriberData.data.name,
        closeOnly: subscriberData.data.subscriptions.map((data) => {
          data.strategyId === strategyId;
        }).closeOnly,
        comment: accountData.data.comment,
      });
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
      setIsLoading(true);
      const result = await api.put(`/subscriber/update-general-setting/${subscriberId}`, {
        name: values.subscriberName,
        subscriptions: [
          { strategyId: strategyId, closeOnly: values.closeOnly },
        ],
        commentData: values.comment,
      });
      showToast('User profile updated successfully!', 'success');
    } catch (err) {
      console.log(err);
      showToast(err.response.data.msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
      <header className="p-[18px] bg-[#0B1220] rounded-t-xl border-b border-[#11B3AE] border-opacity-20">
        <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">General</h2>
      </header>
      <div className="p-[15px] bg-[#0B1220] box-border">
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Copy From
          </label>
          <div className="w-1/2 px-[15px]">
            <label className="block w-full h-[40px] text-sm text-[#E9D8C8] px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#11B3AE] border-opacity-30">
              {values.copyFrom}
            </label>
          </div>
        </div>
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Send To
          </label>
          <div className="w-1/2 px-[15px]">
            <label className="block w-full h-[40px] text-sm text-[#E9D8C8] px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#11B3AE] border-opacity-30">
              {values.sendTo}
            </label>
          </div>
        </div>
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Copier Mode
          </label>
          <div className="flex flex-col w-1/2 px-[15px] gap-2">
            <div className="flex items-center">
              <input
                id="on"
                type="radio"
                value=""
                name="closeOnly"
                className="w-4 h-4 text-[#11B3AE] bg-[#0B1220] border-[#11B3AE] border-opacity-30 rounded-full cursor-pointer focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                onChange={handleInputChange}
              />
              <label
                htmlFor="on"
                className="ms-2 text-sm font-medium text-[#E9D8C8] dark:text-gray-300 cursor-pointer"
              >
                ON
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="monitor"
                type="radio"
                value="by-position"
                name="closeOnly"
                className="w-4 h-4 text-[#11B3AE] bg-[#0B1220] border-[#11B3AE] border-opacity-30 rounded-full cursor-pointer focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                onChange={handleInputChange}
              />
              <label
                htmlFor="monitor"
                className="ms-2 text-sm font-medium text-[#E9D8C8] dark:text-gray-300 cursor-pointer"
              >
                Monitor existing trades only
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="off"
                type="radio"
                value="immediately"
                name="closeOnly"
                className="w-4 h-4 text-[#11B3AE] bg-[#0B1220] border-[#11B3AE] border-opacity-30 rounded-full cursor-pointer focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                onChange={handleInputChange}
              />
              <label
                htmlFor="off"
                className="ms-2 text-sm font-medium text-[#E9D8C8] dark:text-gray-300 cursor-pointer"
              >
                OFF
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Trade Comment (16 chars max)
          </label>
          <div className="w-1/2 px-[15px]">
            <input
              id="comment"
              className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
              type="text"
              name="comment"
              // value={values.comment}
              maxLength={16}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <footer className="px-[15px] py-[10px] bg-[#0B1220] rounded-b-xl border-t border-[#11B3AE] border-opacity-20">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-start-4 col-span-4 pl-3.5">
            <LoadingButton
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#11B3AE!important',
                color: '#FFFFFF',
                fontWeight: 500,
                borderRadius: '8px',
                padding: '8px 16px',
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
            </LoadingButton>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default General;
