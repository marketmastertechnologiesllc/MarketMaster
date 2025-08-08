import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';

function CreateNewTradeCopier() {
  const { showToast } = useToast();

  const initialValues = {
    copyFrom: '',
    sendTo: '',
    // name: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    React.useState(false);
  const [createCopierButtonClicked, setCreateCopierButtonClicked] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [accountData, setAccountData] = React.useState([]);
  const [strategyData, setStrategyData] = React.useState([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchData() {
      // let tempStrategy = [];
      const response = await api.get('/account/my-accounts');
      const responseStrategyList = await api.get('/strategy/strategy-list');
      setAccountData(response.data.data);
      setStrategyData(responseStrategyList.data);
    }

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleCreateCopierButtonClick = async () => {
    try {
      setCreateCopierButtonClicked(true);
      if (
        values.copyFrom == '' ||
        values.sendTo == '' ||
        isTermsAndConditionsChecked == false
      ) {
        showToast('Please fill in all the information!', 'error');
      } else {
        const selectedStrategy = strategyData.find(strategy => strategy.strategyId === values.copyFrom);
        const selectedAccount = accountData.find(account => account.accountId === values.sendTo);
        setIsLoading(true);
        setCreateCopierButtonClicked(true);
        const data = {
          subject: 'Request to create a new trade copier',
          department: 'Create Copier',
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #0088CC; padding-bottom: 10px;">
                  Trade Copier Creation Request
                </h2>
                
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #0088CC; margin-bottom: 10px;">Copy From (Strategy)</h3>
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #0088CC;">
                    <strong>Name:</strong> ${selectedStrategy.name}<br>
                    <strong>Login:</strong> ${selectedStrategy.accounts.login}<br>
                    <strong>Strategy ID:</strong> ${values.copyFrom}
                  </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #0088CC; margin-bottom: 10px;">Send To (Account)</h3>
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">
                    <strong>Name:</strong> ${selectedAccount.name}<br>
                    <strong>Login:</strong> ${selectedAccount.login}<br>
                    <strong>Subscriber ID:</strong> ${values.sendTo}
                  </div>
                </div>
              </div>
            </div>
          `
        }
        const addCopier = await api.post('/strategy/add-copier', {
          strategyId: values.copyFrom,
          copierId: values.sendTo,
        });
        if (addCopier.data.status === "OK") {
          showToast('New copier created successfully!', 'success');
        } else {
          const res = await api.post('/users/contact', data);
          if (res.data.status === "OK") {
            showToast("Request sent successfully", "success");
          } else {
            showToast("Request failed", "error");
          }
        }
        setIsLoading(false);
        navigate('/trade-copier');
      }
    } catch (err) {
    showToast(err.response.data.msg, 'error');
    console.log(err);
    setIsLoading(false);
  }
};
return (
  <div>
    <div className="py-0 px-[200px]">
      <div className="pb-3">
        <Link
          to={'/trade-copier'}
          className="flex flex-row items-center font-extrabold"
        >
          <ReplyRoundedIcon
            fontSize="medium"
            sx={{ color: 'white', fontWeight: 'bold' }}
          />
          <h1 className="text-white text-lg pl-2"> My Copiers</h1>
        </Link>
      </div>
      <div className="mb-[20px] rounded bg-[#282D36] text-white">
        <header className="p-[18px]">
          <h2 className="mt-[5px] text-[20px] font-normal">
            Create New Trade Copier
          </h2>
        </header>
        <div className="box-border p-[15px] bg-[#2E353E]">
          <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
            <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#ccc] text-[13px]">
              Copy from
            </label>
            <div className="w-1/2 px-[15px]">
              <select
                name="copyFrom"
                required
                className="block w-full h-[34px] text-sm bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                onChange={handleInputChange}
              >
                <optgroup label="Signals" className="text-gray-500">
                  <option value="" disabled selected className="hidden">
                    Select Account
                  </option>
                  {strategyData.length > 0 &&
                    strategyData
                      // .filter(
                      //   (account) =>
                      //     account.copyFactoryRoles.indexOf('PROVIDER') !== -1
                      // )
                      .map((account, idx) => (
                        <option
                          key={idx}
                          value={account.strategyId}
                          className="text-white"
                        >{`${account.name}(${account.accounts.login})`}</option>
                      ))}
                </optgroup>
                {/* <optgroup label="My Accounts" className="text-gray-500">
                    {accountData.length > 0 &&
                      accountData
                        .filter(
                          (account) =>
                            account.copyFactoryRoles.indexOf('SUBSCRIBER') !==
                            -1
                        )
                        .map((account) => (
                          <option
                            key={account.accountId}
                            value={account.accountId}
                            className="text-white"
                          >{`${account.name}(${account.login})`}</option>
                        ))}
                  </optgroup> */}
              </select>
              {values.copyFrom == '' && createCopierButtonClicked && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  Copy from required!
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
            <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#ccc] text-[13px]">
              Send to
            </label>
            <div className="w-1/2 px-[15px]">
              <select
                name="sendTo"
                required
                className="block w-full h-[34px] text-sm bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                onChange={handleInputChange}
              >
                <option value="" disabled selected className="hidden">
                  Select Account
                </option>
                {accountData.length > 0 &&
                  accountData
                    .filter(
                      (account) =>
                        account.copyFactoryRoles.indexOf('SUBSCRIBER') !== -1
                    )
                    .map((account) => (
                      <option
                        key={account.accountId}
                        value={account.accountId}
                        className="text-white"
                      >{`${account.name}(${account.login})`}</option>
                    ))}
              </select>
              {values.sendTo == '' && createCopierButtonClicked && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  Send to required!
                </p>
              )}
            </div>
          </div>
          {/* <div className="flex justify-start border-b-[1px] border-[#242830] pb-[15px] mb-[15px]">
            <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#ccc] text-[13px]">
              Name
            </label>
            <div className="w-1/2 px-[15px]">
              <input
                name="name"
                type="text"
                required
                minLength={2}
                className="block w-full h-[34px] text-sm bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                onChange={handleInputChange}
              />
              {values.name == '' && createCopierButtonClicked && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  Name required!
                </p>
              )}
            </div>
          </div> */}
          <div className="flex justify-start">
            <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#ccc] text-[13px]"></label>
            <div className="w-1/2 px-[15px]">
              <div className="flex items-center gap-1 pt-[7px]">
                <input
                  name="subscriber"
                  type="checkbox"
                  required
                  className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded w-4"
                  onChange={() =>
                    setIsTermsAndConditionsChecked(
                      !isTermsAndConditionsChecked
                    )
                  }
                />
                <label className="inline-block relative max-w-full w-full pl-[5px] text-[#ccc] text-[13px]">
                  I have read the T&C&apos;s
                </label>
              </div>
              {createCopierButtonClicked &&
                isTermsAndConditionsChecked == false && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                    Please check T&C!
                  </p>
                )}
            </div>
          </div>
        </div>
        <footer className="px-[15px] py-[10px]">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-start-4 col-span-4 pl-3.5">
              <LoadingButton
                variant="contained"
                size="small"
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#0088CC!important',
                }}
                onClick={handleCreateCopierButtonClick}
                loading={isLoading}
              >
                Create Copier
              </LoadingButton>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
);
}

export default CreateNewTradeCopier;
