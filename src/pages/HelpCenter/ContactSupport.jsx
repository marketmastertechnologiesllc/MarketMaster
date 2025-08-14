import HelpIcon from '@mui/icons-material/Help';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import React from 'react';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';

function ContactSupport() {

  const { showToast } = useToast();

  const [data, setData] = React.useState({
    subject: "",
    department: "General",
    message: ""
  });

  const handleSubmit = async () => {

    if ( data.message === "" || data.subject === "" || data.department === "" ) {
      return showToast("Fill all fields", "error");
    }

    try {
      const res = await api.post('/users/contact', data);
      if ( res.data.status === "OK" ) {
        showToast("Successfully transmitted", "success");
      } else {
        showToast("Failed", "error");
      }
    } catch (e) {
      showToast("Failed", "error");
      console.log(e);
    }
  }

  return (
    <div className="w-auto text-[#E9D8C8]">
      <div className="py-0 px-[200px]">
        <Paper
          elevation={0}
          sx={{
            color: '#E9D8C8',
            backgroundColor: 'rgba(17, 179, 174, 0.1)',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(17, 179, 174, 0.3)',
          }}
        >
          <HelpIcon sx={{ color: '#11B3AE', fontSize: '20px' }} />
          <strong className="pl-[8px] font-bold box-border text-[14px] text-[#E9D8C8]">
            {' '}
            Have you read our{' '}
            <Link to={'/knowledge-base'} className="text-[#11B3AE] hover:text-[#0F9A95] transition-colors">
              knowledge base?
            </Link>
          </strong>
          <p className="pl-[28px] text-[14px] text-[#E9D8C8] opacity-80 mt-2">
            With our{' '}
            <Link to={'/knowledge-base'} className="text-[#11B3AE] hover:text-[#0F9A95] transition-colors">
              knowledge base
            </Link>{' '}
            you can get an in-depth explanation on all the features and
            functionality of the platform including copier risk settings and
            more{' '}
            <Link to={'/knowledge-base'} className="text-[#11B3AE] hover:text-[#0F9A95] transition-colors">
              here
            </Link>
            .
          </p>
        </Paper>
        <div>
          <section className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Contact Support
              </h2>
            </header>
            <div className="box-border p-[15px] bg-[#0B1220]">
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
                  Subject
                </label>
                <div className="w-1/2 px-[15px]">
                  <input
                    name="subject"
                    type="text"
                    required
                    value={data.subject}
                    onChange={e => setData({...data, subject: e.target.value})}
                    className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
                    placeholder="Enter subject"
                  />
                </div>
              </div>
              <div className="flex justify-start border-b-[1px] border-[#11B3AE] border-opacity-20 pb-[15px] mb-[15px]">
                <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
                  Department
                </label>
                <div className="w-1/2 px-[15px]">
                  <select
                    name="department"
                    required
                    value={data.department}
                    onChange={e => setData({...data, department: e.target.value})}
                    className="block w-full h-[40px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200"
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
                    <option value={'General'}>General</option>
                    <option value={'Technical'}>Technical</option>
                    <option value={'Billing'}>Billing</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-start">
                <label className="inline-block relative max-w-full text-right w-1/4 pt-[7px] px-[15px] text-[#E9D8C8] text-[13px] font-medium">
                  Message
                </label>
                <div className="w-1/2 px-[15px]">
                  <textarea
                    name="message"
                    rows={8}
                    onChange={e => setData({...data, message: e.target.value})}
                    value={data.message}
                    required
                    minLength={6}
                    className="block w-full h-auto text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-2 rounded-lg border border-[#11B3AE] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:border-transparent transition-all duration-200 resize-vertical"
                    placeholder="Enter your message"
                  />
                </div>
              </div>
            </div>
            <footer className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
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
                    onClick={handleSubmit}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ContactSupport;
