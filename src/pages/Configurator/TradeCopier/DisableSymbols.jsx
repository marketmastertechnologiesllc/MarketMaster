import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useParams } from 'react-router-dom';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';
import Symbols from '../../../constants/symbols.json';

function DisableSymbols() {
  const { showToast } = useToast();
  const { subscriberId, strategyId } = useParams();

  const [subscriberName, setSubscriberName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [allSymbols, setAllSymbols] = React.useState(Symbols.symbols);
  const [symbols, setSymbols] = React.useState([]);

  const handleCheckChange = (key, checked) => {
    setAllSymbols(
      allSymbols.map((item) =>
        item.key === key ? { ...item, checked: checked } : item
      )
    );
  };

  const enableAll = () => {
    setAllSymbols(
      allSymbols.map((item) => ({
        key: item.key,
        checked: true,
      }))
    );
  };
  const disableAll = () => {
    setAllSymbols(
      allSymbols.map((item) => ({
        key: item.key,
        checked: false,
      }))
    );
  };

  const renderSymbols = () =>
    allSymbols.map(({ key, checked }) => (
      <div className="col-span-2" key={key}>
        <label className="flex flex-col gap-2 justify-center items-center mb-[25px]">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => handleCheckChange(key, e.target.checked)}
            className="w-4 h-4 text-[#11B3AE] bg-[#0B1220] border-[#11B3AE] border-opacity-30 rounded focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
          />
          <span className="text-[13px] text-center text-[#E9D8C8] font-medium">{key}</span>
        </label>
      </div>
    ));

  React.useEffect(() => {
    async function init() {
      const accountData = await api.get(`/account/${subscriberId}`);
      const subscriberDatas = await api.get(`/subscriber/${subscriberId}`);
      const subscriberData = subscriberDatas.data.subscriptions.find(
        (data) => data.strategyId === strategyId
      );
      setSubscriberName(subscriberDatas.data.name);
      setSymbols(accountData.data.symbols);
      const included = subscriberData.symbolFilter.included;

      if (included.length === 0) {
        setAllSymbols(
          allSymbols.map((item) => ({ key: item, checked: false }))
        );
      } else if (included.length > 0) {
        setAllSymbols(
          allSymbols.map((item) =>
            included.includes(item)
              ? { key: item, checked: true }
              : { key: item, checked: false }
          )
        );
      }
    }
    init();
  }, []);

  const handleUpdateClicked = async () => {
    try {
      setIsLoading(true);
      let excluded = [],
        included = [];
      allSymbols.forEach(({ key, checked }) => {
        if (!checked) {
          excluded = [...excluded, key];
        } else if (checked) {
          included = [...included, key];
        }
      });
      let data;
      if (included.length === 0) {
        data = {
          name: subscriberName,
          strategyId: strategyId,
          symbolFilter: {
            included: [],
            excluded: allSymbols.map((symbol) => symbol.key),
          },
        };
      } else {
        data = {
          name: subscriberName,
          strategyId: strategyId,
          symbolFilter: { included: included, excluded: [] },
        };
      }
      const res = await api.put(
        `/subscriber/update-symbol-filter/${subscriberId}`,
        data
      );
      showToast(res.data.msg, 'success');
    } catch (err) {
      console.log(err);
      showToast(err.response.data.msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)] sticky">
      <header className="p-[18px] bg-[#0B1220] rounded-t-xl border-b border-[#11B3AE] border-opacity-20">
        <div className="flex justify-between">
          <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Disable Symbols</h2>
          <div className="inline-flex rounded-lg overflow-hidden">
            <button
              onClick={enableAll}
              className="bg-[#11B3AE] hover:bg-[#0F9A95] rounded-l-lg inline-flex items-center justify-center py-2 px-4 text-center text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)]"
            >
              Enable all
            </button>
            <button
              onClick={disableAll}
              className="bg-[#0B1220] hover:bg-[#11B3AE] hover:bg-opacity-10 rounded-r-lg inline-flex items-center justify-center py-2 px-4 text-center text-sm font-medium text-[#E9D8C8] transition-all duration-200 border border-[#11B3AE] border-opacity-30 hover:border-opacity-50"
            >
              Disable all
            </button>
          </div>
        </div>
        <strong className="text-[#E9D8C8] text-[13px] font-medium">
          <span className="text-[#11B3AE]">
            {allSymbols.reduce(
              (count, item) => count + (item.checked ? 1 : 0),
              0
            )}
          </span>{' '}
          Enabled symbols
        </strong>{' '}
        |{' '}
        <strong className="text-[#E9D8C8] text-[13px] font-medium">
          <span className="text-[#fa5252]">
            {allSymbols.reduce(
              (count, item) => count + (!item.checked ? 1 : 0),
              0
            )}
          </span>{' '}
          Disabled symbols
        </strong>
      </header>
      <div className="p-[18px] bg-[#0B1220] border-b border-[#11B3AE] border-opacity-20">
        <div className="flex justify-between">
          <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Forex symbols</h2>
          <div className="inline-flex rounded-lg overflow-hidden">
            <button
              onClick={enableAll}
              className="bg-[#11B3AE] hover:bg-[#0F9A95] rounded-l-lg inline-flex items-center justify-center py-2 px-4 text-center text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)]"
            >
              Enable
            </button>
            <button
              onClick={disableAll}
              className="bg-[#0B1220] hover:bg-[#11B3AE] hover:bg-opacity-10 rounded-r-lg inline-flex items-center justify-center py-2 px-4 text-center text-sm font-medium text-[#E9D8C8] transition-all duration-200 border border-[#11B3AE] border-opacity-30 hover:border-opacity-50"
            >
              Disable
            </button>
          </div>
        </div>
      </div>
      <div className="box-border px-[20px] bg-[#0B1220] h-[500px] overflow-y-scroll">
        <div className="flex justify-start p-[20px] mb-[10px]">
          <h2 className="text-[14px] font-normal pr-3 text-[#E9D8C8]">No suffix</h2>
          <div className="flex items-center justify-center rounded-lg overflow-hidden">
            <button
              onClick={enableAll}
              className="bg-[#11B3AE] hover:bg-[#0F9A95] rounded-l-lg items-center justify-center py-1 px-2 text-center text-xs font-medium text-white transition-all duration-200 hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)]"
            >
              Enable
            </button>
            <button
              onClick={disableAll}
              className="bg-[#0B1220] hover:bg-[#11B3AE] hover:bg-opacity-10 rounded-r-lg items-center justify-center py-1 px-2 text-center text-xs font-medium text-[#E9D8C8] transition-all duration-200 border border-[#11B3AE] border-opacity-30 hover:border-opacity-50"
            >
              Disable
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 pb-[15px]">{renderSymbols()}</div>
      </div>
      <footer className="px-[15px] py-[10px] bg-[#0B1220] rounded-b-xl border-t border-[#11B3AE] border-opacity-20">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-start-1 col-span-4 pl-3.5">
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
