import * as React from 'react';
import { useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';

// import utilsReducer from '../../store/reducers/utils';

function StopsAndLimits() {
  const { showToast } = useToast();
  const { subscriberId, strategyId } = useParams();

  const initialValues = {
    name: '',
    copyStopLoss: false,
    copyTakeProfit: false,
    skipPendingOrders: false,
  };
  const [values, setValues] = React.useState(initialValues);
  const [createButtonClicked, setCreateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      try {
        const subscriberDatas = await api.get(`/subscriber/${subscriberId}`);
        const subscriberData = subscriberDatas.data.subscriptions.find(
          (data) => data.strategyId === strategyId
        );
        setValues({
          name: subscriberDatas.data.name,
          copyStopLoss: subscriberData.copyStopLoss,
          copyTakeProfit: subscriberData.copyTakeProfit,
          skipPendingOrders: subscriberData.skipPendingOrders,
        });
      } catch (err) {
        console.log(err);
      }
    }
    init();
  }, []);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleUpdateButtonClicked = async () => {
    try {
      setIsLoading(true);
      const data = {
        name: values.name,
        strategyId: strategyId,
        copyStopLoss: values.copyStopLoss,
        copyTakeProfit: values.copyTakeProfit,
        skipPendingOrders: values.skipPendingOrders,
      };
      const response = await api.put(
        `/subscriber/update-stops-limits/${subscriberId}`,
        data
      );
      showToast('Successfully updated!', 'success');
    } catch (err) {
      showToast('Update failed!', 'error');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <header className="p-[18px] bg-[#0B1220] rounded-t-xl border-b border-[#11B3AE] border-opacity-20">
          <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Stops & Limits</h2>
        </header>
        <div className="p-[15px] bg-[#0B1220] box-border">
          {/* <div className="border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px] flex justify-start">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Skip Pending Orders
            </label>
            <div className="w-1/2 px-[15px]">
              <select
                name="skipPendingOrders"
                value={values.skipPendingOrders}
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              >
                <option value={false} className="bg-[#0B1220] text-[#E9D8C8]">No</option>
                <option value={true} className="bg-[#0B1220] text-[#E9D8C8]">Yes</option>
              </select>
            </div>
          </div> */}
          <div className="flex justify-start mb-[15px] pb-[15px] border-b-[1px] border-[#11B3AE] border-opacity-20">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Copy Stop Loss
            </label>
            <div className="w-1/2 px-[15px]">
              <select
                name="copyStopLoss"
                value={values.copyStopLoss}
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              >
                <option value={false} className="bg-[#0B1220] text-[#E9D8C8]">No</option>
                <option value={true} className="bg-[#0B1220] text-[#E9D8C8]">Yes</option>
              </select>
            </div>
          </div>
          <div className="flex justify-start">
            <label className="text-[#E9D8C8] text-[13px] text-right w-1/4 pt-[7px] px-[15px] inline-block relative max-w-full font-medium">
              Copy Take Profit
            </label>
            <div className="w-1/2 px-[15px]">
              <select
                name="copyTakeProfit"
                value={values.copyTakeProfit}
                required
                className="block bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg w-full h-[40px] text-sm border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200 hover:border-[#11B3AE] hover:border-opacity-50"
                onChange={handleInputChange}
              >
                <option value={false} className="bg-[#0B1220] text-[#E9D8C8]">No</option>
                <option value={true} className="bg-[#0B1220] text-[#E9D8C8]">Yes</option>
              </select>
            </div>
          </div>
        </div>
        <footer className="px-[15px] py-[10px] bg-[#0B1220] rounded-b-xl border-t border-[#11B3AE] border-opacity-20">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-start-4 col-span-4 pl-3.5">
              <LoadingButton
                variant="contained"
                size="small"
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
                onClick={handleUpdateButtonClicked}
                loading={isLoading}
              >
                Update
              </LoadingButton>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default StopsAndLimits;
