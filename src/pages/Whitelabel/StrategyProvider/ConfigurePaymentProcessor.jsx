import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';

function ConfigurePaymentProcessor() {
  const { showToast } = useToast();
  const { strategyId } = useParams();

  const initialValues = {
    paypalEmail: false,
  };
  const [values, setValues] = React.useState(initialValues);
  const [configureButtonClicked, setConfigureButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleConfigureButtonClicked = async () => {
    try {
      setConfigureButtonClicked(true);
      if (
        values.paypalEmail == ''
      ) {
        showToast('Please fill in all the information!', 'error');
        console.log('something error');
      } else {
        setIsLoading(true);
        // const result = await api.post('/strategy/register-strategy', values);
        showToast('Payment processor configured successfully!', 'success');
        setIsLoading(false);
        navigate(`/strategy-provider/`);
      }
    } catch (err) {
      showToast('Payment configuration failed!', 'error');
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
            to='/strategy-provider'
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
            <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Follower Terms</h2>
          </header>
          <div className="box-border p-[15px] bg-[#0B1220]">
            <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Select Processor
              </label>
              <div className="flex flex-col w-1/2 px-[15px] gap-2">
                <div className="flex items-center">
                  <input
                    id="inline-radio"
                    type="radio"
                    value="on"
                    name="inline-radio-group"
                    className="w-4 h-4 text-[#11B3AE] bg-[#0B1220] border-[#11B3AE] rounded-full accent-[#11B3AE]"
                    checked
                  />
                  <label
                    htmlFor="inline-radio"
                    className="ms-2 text-sm font-medium text-[#E9D8C8]"
                  >
                    Paypal
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="inline-radio"
                    type="radio"
                    value="off"
                    name="inline-radio-group"
                    className="w-4 h-4 text-[#11B3AE] bg-[#0B1220] border-[#11B3AE] rounded-full accent-[#11B3AE]"
                  />
                  <label
                    htmlFor="inline-radio"
                    className="ms-2 text-sm font-medium text-[#E9D8C8]"
                  >
                    Stripe
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-start">
              <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px] font-medium">
                Paypal Email
              </label>
              <div className="w-1/2 px-[15px]">
                <input
                  name="paypalEmail"
                  type="email"
                  required
                  className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                  onChange={handleInputChange}
                  placeholder="Enter PayPal email"
                />
                {values.paypalEmail == '' &&
                  configureButtonClicked && (
                    <p className="mt-2 text-sm text-[#fa5252] font-medium">
                      PayPal Email required!
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
                  onClick={handleConfigureButtonClicked}
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

export default ConfigurePaymentProcessor;
