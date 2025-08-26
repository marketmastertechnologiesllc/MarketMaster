import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import { Icon } from '@iconify/react';
import copy from 'copy-to-clipboard';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';
import { BASE_URL } from '../../../config';

function EditStrategyProvider() {
  const { showToast } = useToast();
  const { strategyId } = useParams();

  const initialValues = {
    id: '',
    strategyId: '',
    name: '',
    description: '',
    accountId: '',
    live: false,
    proposers: [],
    terms: {
      emailAlerts: false,
      tradeCopy: false,
    },
    strategyLink: '',
    setting: {
      openTrades: true,
      tradeHistory: true,
      balanceInformation: true,
      broker: true,
      accountDetails: true,
      ticket: true,
    },
  };

  const [values, setValues] = React.useState(initialValues);
  const [createStrategyButtonClicked, setCreateStrategyButtonClicked] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [strategyProviderTermsModalShow, setStrategyProviderTermsModalShow] =
    React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setValues({
      ...values,
      setting: {
        ...values.setting,
        [name]: checked,
      },
    });
  };

  React.useEffect(() => {
    async function init() {
      const strategyProviderData = await api.get(
        `/strategy/strategies/${strategyId}`
      );
      setValues(strategyProviderData.data);
    }
    init();
  }, []);

  const handleCopyButtonClicked = () => {
    try {
      setIsCopied(true);
      copy(`${BASE_URL}analysis/analysis-account/${values.accountId}`);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.log('failed to copy', err);
    }
  };

  const handleLiveButtonClicked = async () => {
    try {
      setIsLoading(true);
      setValues({ ...values, live: !values.live });
      // showToast(
      //   `Successfully ${!values.live ? 'Lived' : 'Not Lived'}!`,
      //   'success'
      // );
    } catch (err) {
      console.log(err);
      showToast(`Failed to change Live state!`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStrategyProviderButtonClicked = async () => {
    try {
      setIsLoading(true);
      const result = await api.put(`/strategy/${values.id}`, values);
      showToast('Strategy updated successfully!', 'success');

      navigate('/strategy-provider');
    } catch (err) {
      showToast('Strategy updated failed!', 'error');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-auto text-[#E9D8C8]">
      <div className="py-0 px-[100px] pb-[50px]">
        <div className="pb-3">
          <Link
            to={'/strategy-provider'}
            className="flex flex-row items-center font-extrabold text-[#E9D8C8] hover:text-[#11B3AE] transition-colors"
          >
            <ReplyRoundedIcon
              fontSize="medium"
              sx={{ color: 'currentColor', fontWeight: 'bold' }}
            />
            <h1 className="text-lg pl-2"> Strategy Provider</h1>
          </Link>
        </div>
        <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
          <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
            <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Strategy Page</h2>
          </header>
          <div className="flex justify-between box-border p-[15px] bg-[#0B1220] rounded-b text-[#E9D8C8]">
            <div className="mb-3">
              <label className="font-bold text-[#E9D8C8]">URL</label>
              <div className="flex gap-3">
                <p className="text-[#E9D8C8]">{`${BASE_URL}analysis/analysis-account/${values.accountId}`}</p>
                <button
                  className={`${
                    isCopied ? 'bg-[#11B3AE] text-[#FFFFFF]' : 'bg-[#11B3AE] hover:bg-[#0F9A95]'
                  } text-sm px-[8px] py-[4px] rounded transition-all duration-200`}
                  onClick={handleCopyButtonClicked}
                >
                  {isCopied ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            </div>
            <div>
              <LoadingButton
                variant="contained"
                size="small"
                sx={{
                  textTransform: 'none',
                  backgroundColor: `${
                    values.live ? '#11B3AE!important' : '#fa5252!important'
                  }`,
                  color: '#FFFFFF!important',
                  fontWeight: 500,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: values.live ? '#0F9A95!important' : '#e03131!important',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                  },
                }}
                onClick={handleLiveButtonClicked}
                loading={isLoading}
              >
                {values.live ? 'Live' : 'Not Live'}
              </LoadingButton>
            </div>
          </div>
        </div>
        <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
          <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center bg-[#0B1220] rounded-t border-b border-[#11B3AE] border-opacity-20">
            <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Follower Terms</h2>
            <Link
              to={`/strategy-provider/follower-terms/${strategyId}`}
              className="bg-[#11B3AE] hover:bg-[#0F9A95] h-[33px] rounded text-sm px-2 items-center flex text-white transition-all duration-200"
            >
              <Icon
                icon="typcn:plus"
                width="16"
                height="16"
                style={{ display: 'inline-block' }}
              />{' '}
              Add Term
            </Link>
          </header>
          <div className="box-border p-[15px] bg-[#0B1220] rounded-b">
            <table className="w-full text-sm text-left text-[#E9D8C8]">
              <thead className="text-xs border border-[#11B3AE] border-opacity-20">
                <tr>
                  <th className="px-4 py-2 border-r border-[#11B3AE] border-opacity-20 text-[#E9D8C8] font-medium">
                    Email Alert
                  </th>
                  <th className="px-6 py-2 border-r border-[#11B3AE] border-opacity-20 text-[#E9D8C8] font-medium">
                    Trade Copier
                  </th>
                  <th className="px-6 py-2 border-r border-[#11B3AE] border-opacity-20 text-[#E9D8C8] font-medium">
                    Access Terms
                  </th>
                  <th className="px-6 py-2 text-[#E9D8C8] font-medium"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border border-[#11B3AE] border-opacity-20">
                  <td className="px-4 py-2 text-[#E9D8C8]">No terms created.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
          <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
            <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
              Hide information
            </h2>
          </header>
          <div className="box-border p-[15px] bg-[#0B1220]">
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Open trades
              </label>
              <div className="w-1/2 px-[15px]">
                <label className="flex flex-col cursor-pointer select-none items-start gap-2">
                  <div className="relative">
                    <input
                      name="openTrades"
                      type="checkbox"
                      checked={values?.setting?.openTrades}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div
                      className={`box block h-8 w-14 rounded-full ${
                        values?.setting?.openTrades ? 'bg-[#11B3AE]' : 'bg-[#666]'
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        values?.setting?.openTrades ? 'translate-x-full' : ''
                      }`}
                    ></div>
                  </div>
                  <p className="relative text-[#E9D8C8] opacity-80 text-sm">
                    All open trades on the account
                  </p>
                </label>
              </div>
            </div>
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Trade history
              </label>
              <div className="w-1/2 px-[15px]">
                <label className="flex flex-col cursor-pointer select-none items-start gap-2">
                  <div className="relative">
                    <input
                      name="tradeHistory"
                      type="checkbox"
                      checked={values?.setting?.tradeHistory}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div
                      className={`box block h-8 w-14 rounded-full ${
                        values?.setting?.tradeHistory
                          ? 'bg-[#11B3AE]'
                          : 'bg-[#666]'
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        values?.setting?.tradeHistory ? 'translate-x-full' : ''
                      }`}
                    ></div>
                  </div>
                  <p className="relative text-[#E9D8C8] opacity-80 text-sm">
                    All closed trades for the account
                  </p>
                </label>
              </div>
            </div>
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Balance information
              </label>
              <div className="w-1/2 px-[15px]">
                <label className="flex flex-col cursor-pointer select-none items-start gap-2">
                  <div className="relative">
                    <input
                      name="balanceInformation"
                      type="checkbox"
                      checked={values?.setting?.balanceInformation}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div
                      className={`box block h-8 w-14 rounded-full ${
                        values?.setting?.balanceInformation
                          ? 'bg-[#11B3AE]'
                          : 'bg-[#666]'
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        values?.setting?.balanceInformation
                          ? 'translate-x-full'
                          : ''
                      }`}
                    ></div>
                  </div>
                  <p className="relative text-[#E9D8C8] opacity-80 text-sm">
                    Monetary values including balance, equity and profit
                  </p>
                </label>
              </div>
            </div>
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Account details
              </label>
              <div className="w-1/2 px-[15px]">
                <label className="flex flex-col cursor-pointer select-none items-start gap-2">
                  <div className="relative">
                    <input
                      name="accountDetails"
                      type="checkbox"
                      checked={values?.setting?.accountDetails}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div
                      className={`box block h-8 w-14 rounded-full ${
                        values?.setting?.accountDetails
                          ? 'bg-[#11B3AE]'
                          : 'bg-[#666]'
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        values?.setting?.accountDetails ? 'translate-x-full' : ''
                      }`}
                    ></div>
                  </div>
                  <p className="relative text-[#E9D8C8] opacity-80 text-sm">
                    Account type and leverage
                  </p>
                </label>
              </div>
            </div>
          </div>
          <div className="px-[15px] py-[15px] border-t border-[#11B3AE] border-opacity-20">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-start-4 col-span-4 pl-3.5">
                <LoadingButton
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#11B3AE!important',
                    color: '#FFFFFF!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                    },
                    '&:disabled': {
                      backgroundColor: '#666!important',
                      color: '#999!important',
                    },
                  }}
                  onClick={handleCreateStrategyProviderButtonClicked}
                  loading={isLoading}
                >
                  Update
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditStrategyProvider;
