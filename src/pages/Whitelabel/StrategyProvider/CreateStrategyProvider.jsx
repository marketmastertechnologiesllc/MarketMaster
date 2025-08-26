import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';
import StrategyProviderTermsModal from '../../../components/modals/StrategyProviderTermsModal';
import { useLoading } from '../../../contexts/loadingContext';

function CreateStrategyProvider() {
  const { showToast } = useToast();
  const { loading } = useLoading();
  const initialValues = {
    providerID: '',
    StrategyName: '',
    strategyDescription: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [accountData, setAccountData] = React.useState([]);
  const [createStrategyButtonClicked, setCreateStrategyButtonClicked] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [strategyProviderTermsModalShow, setStrategyProviderTermsModalShow] =
    React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchData() {
      try {
        loading(true);
        const response = await api.get('/account/all-accounts');
        setAccountData(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        loading(false);
      }
    }

    fetchData();
  }, []);

  const handleCreateStrategyProviderButtonClicked = () => {
    try {
      setCreateStrategyButtonClicked(true);
      if (
        values.providerID == '' ||
        values.StrategyName == '' ||
        values.strategyDescription == ''
      ) {
        showToast('Please fill in all the information!', 'error');
        console.log('something error');
      } else {
        setStrategyProviderTermsModalShow(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleCreateStrategyProviderModalButtonClicked = async () => {
    try {
      setIsLoading(true);
      const result = await api.post('/strategy/register-strategy', values);
      showToast('Strategy registered successfully!', 'success');
      setIsLoading(false);
      navigate('/strategy-provider');
    } catch (err) {
      showToast('Strategy registration failed!', 'error');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-auto text-[#E9D8C8]">
      {strategyProviderTermsModalShow && (
        <StrategyProviderTermsModal
          strategyProviderTermsModalShow={setStrategyProviderTermsModalShow}
          handleCreateStrategyProviderModalButtonClicked={
            handleCreateStrategyProviderModalButtonClicked
          }
          isLoading={isLoading}
        />
      )}
      <div className="py-0 px-[200px]">
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
            <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Create Strategy</h2>
          </header>
          <div className="box-border p-[15px] bg-[#0B1220]">
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Strategy Account
              </label>
              <div className="w-1/2 px-[15px]">
                <select
                  name="providerID"
                  required
                  className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                  onChange={handleInputChange}
                  style={{
                    '& option': {
                      backgroundColor: '#0B1220',
                      color: '#E9D8C8',
                    },
                    '& option:hover': {
                      backgroundColor: 'rgba(17, 179, 174, 0.2)',
                    },
                    '& option:selected': {
                      backgroundColor: '#11B3AE',
                      color: '#FFFFFF',
                    }
                  }}
                >
                  <option value="" disabled selected className="hidden">
                    Select Account
                  </option>
                  {accountData.length > 0 &&
                    accountData
                      .filter(
                        (account) =>
                          account.copyFactoryRoles.indexOf('PROVIDER') !== -1
                      )
                      .map((account) => (
                        <option
                          key={account.accountId}
                          value={account.accountId}
                        >{`${account.name}(${account.login})`}</option>
                      ))}
                </select>
                {values.providerID == '' && createStrategyButtonClicked && (
                  <p className="mt-2 text-sm text-[#fa5252] font-medium">
                    Strategy Account required!
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
                Strategy Name
              </label>
              <div className="w-1/2 px-[15px]">
                <input
                  name="StrategyName"
                  type="text"
                  required
                  className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                  onChange={handleInputChange}
                  placeholder="Enter strategy name"
                />
                {values.StrategyName == '' && createStrategyButtonClicked && (
                  <p className="mt-2 text-sm text-[#fa5252] font-medium">
                    Strategy Name required!
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-start">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Strategy Description
              </label>
              <div className="w-1/2 px-[15px]">
                <input
                  name="strategyDescription"
                  type="text"
                  required
                  className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                  onChange={handleInputChange}
                  placeholder="Enter strategy description"
                />
                {values.strategyDescription == '' &&
                  createStrategyButtonClicked && (
                    <p className="mt-2 text-sm text-[#fa5252] font-medium">
                      Strategy Description required!
                    </p>
                  )}
              </div>
            </div>
          </div>
          <div className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-start-4 col-span-4 pl-3.5">
                <Button
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
                  }}
                  onClick={handleCreateStrategyProviderButtonClicked}
                >
                  Create strategy page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStrategyProvider;
