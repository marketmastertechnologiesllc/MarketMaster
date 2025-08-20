import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';
import { Icon } from '@iconify/react';
import { useLoading } from '../../contexts/loadingContext';

function WhitelabelHomepage() {
  const { loading } = useLoading();
  const { showToast } = useToast();

  const [isSiteSettingUpdateButtonLoading, setIsSiteSettingUpdateButtonLoading] = React.useState(false);
  const [isAddBrokerButtonLoading, setIsAddBrokerButtonLoading] = React.useState(false);
  const [siteSettingUpdatedButtonClicked, setSiteSettingUpdatedButtonClicked] = React.useState(false);
  const [addBrokerButtonClicked, setAddBrokerButtonClicked] = React.useState(false);

  const [userRegistration, setUserRegistration] = React.useState(true);
  const [maxAccount, setMaxAccount] = React.useState(10);

  const [brokers, setBrokers] = React.useState([]);

  const [broker, setBroker] = React.useState("");

  const handleUserRegistrationChange = (e) => {
    setUserRegistration(e.target.value);
  };

  const handleSiteSettingUpdatebuttonClicked = async () => {
    setIsSiteSettingUpdateButtonLoading(true);
    setSiteSettingUpdatedButtonClicked(true);

    try {
      await api.put("/settings/site-setting", { userRegistration, maxAccount });
      showToast("Updated Successfully", "success");
    } catch (err) {
      showToast("Update failed", "error");
      console.log(err);
    } finally {
      setIsSiteSettingUpdateButtonLoading(false);
    }
  }

  React.useEffect(() => {
    async function fetchData() {
      try {
        loading(true);
        const res = await api.get("/settings/site-setting");
        if (res.data.status === "OK") {
          const _userRegistration = res.data.data.find(({ key, value }) => key === "userRegistration");
          const _maxAccount = res.data.data.find(({ key, value }) => key === "maxAccount");
          if (_userRegistration) {
            setUserRegistration(_userRegistration.value);
          }
          if (_maxAccount) {
            setMaxAccount(_maxAccount.value);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        loading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddBrokerButtonClicked = async () => {
    try {
      setIsAddBrokerButtonLoading(true);
      if (broker === "") {
        showToast("Insert broker to add", "error");
      } else {
        const res = await api.post("/settings/brokers", { broker: broker });
        if (res.data.status === "OK") {
          showToast("Successfully added", "success");
          setBroker("");
          setBrokers(prev => [...prev, res.data.data])
        } else {
          throw "err";
        }
      }
    } catch (err) {
      console.log(err);
      showToast("Add failed", "error");
    } finally {
      setIsAddBrokerButtonLoading(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      api.delete(`/settings/brokers/${id}`);
      showToast("Successfully deleted", "success");
      const index = brokers.map(item => item._id).indexOf(id);
      const temp = [...brokers];
      temp.splice(index, 1);
      setBrokers(temp);
    } catch (err) {
      console.log(err);
      showToast("Delete failed", "error");
    }
  }

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="grid grid-cols-12 gap-6 mb-24">
        <div className="col-span-12">
          <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
            <header className="p-4 border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-1 text-[20px] font-normal text-[#FFFFFF]">Site Settings</h2>
            </header>
            <div className="box-border py-3 px-4 bg-[#0B1220]">
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px]">
                  User Registration
                </label>
                <div className="w-1/2 px-[15px]">
                  <select
                    name="emailAlert"
                    required
                    value={userRegistration}
                    className="block w-full h-[34px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                    onChange={handleUserRegistrationChange}
                  >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>

                </div>
              </div>
              <div className="flex justify-start">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px]">
                  Max accounts per user
                </label>
                <div className="w-1/2 px-[15px]">
                  <input
                    name="paypalEmail"
                    type="number"
                    value={maxAccount}
                    required
                    className="block w-full h-[34px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                    onChange={e => setMaxAccount(e.target.value)}
                  />
                  {maxAccount <= 0 && siteSettingUpdatedButtonClicked && (
                    <p className="mt-2 text-xs text-red-400">
                      Max account number is required!
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-[#11B3AE] border-opacity-20">
              <LoadingButton
                variant="contained"
                size="small"
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#11B3AE!important',
                  color: '#FFFFFF',
                  fontWeight: 500,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#0F9A95!important',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                  },
                }}
                onClick={handleSiteSettingUpdatebuttonClicked}
                loading={isSiteSettingUpdateButtonLoading}
              >
                Update
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhitelabelHomepage;
