import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

import api from '../../utils/api';
import useToast from '../../hooks/useToast';

function FollowerTerms() {
  const { showToast } = useToast();
  const { strategyId } = useParams();

  const initialValues = {
    emailAlert: false,
    tradeCopy: false,
    billingModel: 0,
  };
  const [values, setValues] = React.useState(initialValues);
  const [createButtonClicked, setCreateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleCreateButtonClicked = async () => {
    try {
      setCreateButtonClicked(true);
      if (
        values.emailAlert == '' ||
        values.tradeCopy == '' ||
        values.billingModel == ''
      ) {
        showToast('Please fill in all the information!', 'error');
      } else {
        setIsLoading(true);
        // const result = await api.post('/strategy/register-strategy', values);
        showToast('Terms added successfully!', 'success');
        setIsLoading(false);
        navigate(`/signal-provider/edit/${strategyId}`);
      }
    } catch (err) {
      showToast('Terms addition failed!', 'error');
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

  return (
    <div className="w-auto text-[#E9D8C8]">
      <div className="py-0 px-[200px]">
        <div className="pb-3">
          <Link
            to={`/signal-provider/edit/${strategyId}`}
            className="flex flex-row items-center font-extrabold text-[#E9D8C8] hover:text-[#11B3AE] transition-colors"
          >
            <ReplyRoundedIcon
              fontSize="medium"
              sx={{ color: 'currentColor', fontWeight: 'bold' }}
            />
            <h1 className="text-lg pl-2"> Manage Signals</h1>
          </Link>
        </div>
        <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
          <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
            <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Follower Terms</h2>
          </header>
          <div className="box-border p-[15px] bg-[#0B1220]">
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Email Alerts
              </label>
              <div className="w-1/2 px-[15px]">
                <select
                  name="emailAlert"
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
                    Select Option
                  </option>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
                {values.emailAlert == '' && createButtonClicked && (
                  <p className="mt-2 text-sm text-[#fa5252] font-medium">
                    Email Alerts required!
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Trade Copy
              </label>
              <div className="w-1/2 px-[15px]">
                <select
                  name="tradeCopy"
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
                    Select Option
                  </option>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
                {values.tradeCopy == '' && createButtonClicked && (
                  <p className="mt-2 text-sm text-[#fa5252] font-medium">
                    Trade Copy required!
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-start">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Billing Model
              </label>
              <div className="w-1/2 px-[15px]">
                <select
                  name="billingModel"
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
                    Select Billing Model
                  </option>
                  <option value={0}>Free Access</option>
                  <option value={1}>Recurring Fee</option>
                  <option value={2}>Performance Billing</option>
                </select>
                {values.billingModel == '' && createButtonClicked && (
                  <p className="mt-2 text-sm text-[#fa5252] font-medium">
                    Billing Model required!
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
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
                  onClick={handleCreateButtonClicked}
                  loading={isLoading}
                >
                  Create
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowerTerms;
