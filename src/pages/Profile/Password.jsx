import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import api from '../../utils/api';
import useToast from '../../hooks/useToast';

function Password() {
  const { showToast } = useToast();

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirm: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [updateButtonClicked, setUpdateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleUpdateClicked = async () => {
    try {
      setUpdateButtonClicked(true);
      setIsLoading(true);
      if (
        values.oldPassword == '' ||
        values.newPassword == '' ||
        values.confirm == ''
      ) {
        showToast('Please fill in all the information!', 'error');
      } else if (values.newPassword !== values.confirm) {
        showToast('Confirm is not match!', 'error');
      } else if (values.newPassword.length < 6) {
        showToast('Your password must be at least 6 characters long!', 'error');
      } else {
        const res = await api.put('/users/update-password', values);
        showToast(res.data.msg, 'success');
      }
    } catch (err) {
      console.log(err);
      showToast(err.response.data.msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
      <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
        <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">My Password</h2>
      </header>
      <div className="box-border p-[15px] bg-[#0B1220]">
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Old Password
          </label>
          <div className="w-1/2 px-[15px]">
            <input
              name="oldPassword"
              type="password"
              required
              className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
              onChange={handleInputChange}
              placeholder="Enter old password"
            />
            {values.oldPassword == '' && updateButtonClicked && (
              <p className="mt-2 text-sm text-[#fa5252] font-medium">
                Old Password required!
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            New Password (Min 6 chars)
          </label>
          <div className="w-1/2 px-[15px]">
            <input
              name="newPassword"
              type="password"
              required
              className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
            {values.newPassword == '' && updateButtonClicked && (
              <p className="mt-2 text-sm text-[#fa5252] font-medium">
                New Password required!
              </p>
            )}
            {values.newPassword.length < 6 &&
              values.newPassword.length !== 0 &&
              updateButtonClicked && (
                <p className="mt-2 text-sm text-[#fa5252] font-medium">
                  Your password must be at least 6 characters long!
                </p>
              )}
          </div>
        </div>
        <div className="flex justify-start">
          <label className="inline-block relative max-w-full w-1/4 text-right pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
            Confirm New Password
          </label>
          <div className="w-1/2 px-[15px]">
            <input
              name="confirm"
              type="password"
              required
              className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
              onChange={handleInputChange}
              placeholder="Confirm new password"
            />
            {values.confirm == '' && updateButtonClicked && (
              <p className="mt-2 text-sm text-[#fa5252] font-medium">
                Confirm New Password required!
              </p>
            )}
            {values.confirm !== values.newPassword &&
              values.confirm.length !== 0 &&
              updateButtonClicked && (
                <p className="mt-2 text-sm text-[#fa5252] font-medium">
                  Confirm not match!
                </p>
              )}
          </div>
        </div>
      </div>
      <footer className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-start-4 col-span-4 pl-3.5">
            <LoadingButton
              variant="contained"
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

export default Password;
