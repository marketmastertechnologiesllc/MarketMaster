import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';

import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';
import useUtils from '../../../hooks/useUtils';

// import utilsReducer from '../../store/reducers/utils';

function MapSymbols() {
  const { showToast } = useToast();

  const initialValues = {
    login: '',
    password: '',
    name: '',
    server: '',
    platform: '',
    copyFactoryRoles: [],
  };
  const [values, setValues] = React.useState(initialValues);
  const [isSubscriberChecked, setIsSubscriberChecked] = React.useState(false);
  const [isProviderChecked, setIsProviderChecked] = React.useState(false);
  const [createButtonClicked, setCreateButtonClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [brokers, setBrokers] = React.useState([]);

  // const [utils, dispatch] = useReducer(utilsReducer);

  // const { ids, setIds } = useUtils();
  const dispatch = useDispatch();
  const { ids } = useSelector((state) => state.utils);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // React.useEffect(() => {
  //   if (isSubscriberChecked) {
  //     if (values.copyFactoryRoles.includes('SUBSCRIBER') == false) {
  //       values.copyFactoryRoles.push('SUBSCRIBER');
  //     }
  //   } else {
  //     values.copyFactoryRoles = values.copyFactoryRoles.filter(
  //       (role) => role !== 'SUBSCRIBER'
  //     );
  //   }
  //   if (isProviderChecked) {
  //     if (values.copyFactoryRoles.includes('PROVIDER') == false) {
  //       values.copyFactoryRoles.push('PROVIDER');
  //     }
  //   } else {
  //     values.copyFactoryRoles = values.copyFactoryRoles.filter(
  //       (role) => role !== 'PROVIDER'
  //     );
  //   }
  // }, [isSubscriberChecked, isProviderChecked]);

  // const handleCreateAccount = async () => {
  //   try {
  //     setCreateButtonClicked(true);
  //     if (
  //       values.login == '' ||
  //       values.password == '' ||
  //       values.name == '' ||
  //       values.server == '' ||
  //       values.platform == '' ||
  //       values.copyFactoryRoles.length == 0
  //     ) {
  //       showToast('Please fill in all the information!', 'error');
  //     } else {
  //       setIsLoading(true);
  //       const result = await api.post('/account/register-account', values);

  //       if (result.data.AccountRegister) {
  //         dispatch({
  //           type: 'ADD_ID',
  //           payload: result.data.AccountRegister.id,
  //         });
  //       } else {
  //         throw new Error('null account Register');
  //       }

  //       showToast('Account created successfully!', 'success');

  //       setIsLoading(false);
  //       navigate('/accounts');
  //     }
  //   } catch (err) {
  //     showToast('Account creation failed!', 'error');
  //     console.log(err);
  //     setIsLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   api
  //     .get('/settings/brokers')
  //     .then((res) => {
  //       if (res.data.status === 'OK') {
  //         setBrokers(res.data.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
        <header className="p-[18px] text-[#E9D8C8] flex justify-between items-center bg-[#0B1220] rounded-t-xl border-b border-[#11B3AE] border-opacity-20">
          <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">Map Symbols</h2>
          <Button
            sx={{
              display: 'flex',
              backgroundColor: '#11B3AE!important',
              color: '#FFFFFF',
              height: '40px',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: '16px',
              paddingX: '12px',
              alignItems: 'center',
              fontWeight: 500,
              textTransform: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#0F9A95!important',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
              },
            }}
          >
            <Icon
              icon="typcn:plus"
              width="16"
              height="16"
              style={{ display: 'inline-block' }}
            />{' '}
            Add Symbol Map
          </Button>
        </header>
        <div className="p-[15px] bg-[#0B1220] box-border rounded-b-xl"></div>
      </div>
    </div>
  );
}

export default MapSymbols;
