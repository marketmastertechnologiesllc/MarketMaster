import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import api from '../../utils/api';
import useToast from '../../hooks/useToast';

function WhitelabelHomepage() {
  const { showToast } = useToast();

  const [addButtonClicked, setAddButtonClicked] = React.useState(false);
  const [updateButtonClicked, setUpdateButtonClicked] = React.useState(false);
  const [isAddButtonLoading, setIsAddButtonLoading] = React.useState(false);
  const [isUpdateButtonLoading, setIsUpdateButtonLoading] =
    React.useState(false);
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] =
    React.useState(false);

  const modules = {
    toolbar: [
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
      ['link', 'video'],
    ],
  };

  const [newContent, setNewContent] = React.useState({
    title: '',
  });

  const [content, setContent] = React.useState({
    id: '',
    title: '',
    body: '',
  });

  const handlAaddButtonClicked = () => {
    setAddButtonClicked(true);

    if (newContent.title === '') {
      showToast('Input title!', 'error');
    } else {
      setIsAddButtonLoading(true);
      api
        .post('/settings/homepage-content', newContent)
        .then((res) => {
          showToast('Successfully added!', 'success');
          setContent({ ...res.data.data, body: '' });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsAddButtonLoading(false);
        });
    }
  };

  const handleUpdateButtonClicked = () => {
    setUpdateButtonClicked(true);
    if (content.title === '' || content.body === '') {
      showToast('Input all fields!', 'error');
    } else {
      setIsUpdateButtonLoading(true);
      api
        .put(`/settings/homepage-content/${content.id}`, {
          title: content.title,
          body: content.body,
        })
        .then((res) => {
          showToast('Updated successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
          showToast('Update failed', 'error');
        })
        .finally(() => {
          setIsUpdateButtonLoading(false);
        });
    }
  };

  const handleDeleteButtonClicked = () => {
    setIsDeleteButtonLoading(true);
    api
      .delete(`/settings/homepage-content/${content.id}`)
      .then((res) => {
        showToast('Deleted successfully', 'success');
        setContent({
          title: '',
          body: '',
        });
      })
      .catch((err) => {
        console.log(err);
        showToast('Delete failed', 'error');
      })
      .finally(() => {
        setIsDeleteButtonLoading(false);
      });
  };

  React.useEffect(() => {
    api
      .get('/settings/homepage-content')
      .then((res) => {
        setContent(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="grid grid-cols-12 gap-6 mb-24">
        <div className="col-span-3">
          <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
            <header className="p-4 border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-1 text-[20px] font-normal text-[#FFFFFF]">Homepage</h2>
            </header>
            <div className="box-border py-3 px-4 text-[15px] text-[#E9D8C8] bg-[#0B1220]">
              Status
              <div>
                <button className="bg-[#477747] px-3 py-1 text-sm rounded-lg">Live</button>
              </div>
            </div>
          </div>
          <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
            <header className="p-4 border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-1 text-[20px] font-normal text-[#FFFFFF]">Homepage</h2>
            </header>
            <div className="box-border py-3 px-4 bg-[#0B1220]">
              <div className="flex justify-start">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px]">
                  Title
                </label>
                <div className="w-1/2 px-[15px]">
                  <input
                    type="text"
                    required
                    value={newContent.title}
                    className="block w-full h-[34px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                    onChange={(e) =>
                      setNewContent({ ...newContent, title: e.target.value })
                    }
                  />
                  {newContent.title == '' && addButtonClicked && (
                    <p className="mt-2 text-xs text-red-400">
                      Title is required!
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
                onClick={handlAaddButtonClicked}
                loading={isAddButtonLoading}
              >
                Add content
              </LoadingButton>
            </div>
          </div>
        </div>
        <div className="col-span-9">
          <div className="mb-[20px] rounded-xl bg-[#0B1220] text-[#E9D8C8] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)]">
            <header className="p-4 border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-1 text-[20px] font-normal text-[#FFFFFF]">Content#1142</h2>
            </header>
            <div className="box-border py-3 px-4 bg-[#0B1220]">
              <div className="flex justify-start">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px]">
                  Title
                </label>
                <div className="w-3/4 px-[15px]">
                  <input
                    type="text"
                    required
                    value={content.title}
                    className="block w-full h-[34px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                    onChange={(e) =>
                      setContent({ ...content, title: e.target.value })
                    }
                  />
                  {content.title === '' && updateButtonClicked && (
                    <p className="mt-2 text-xs text-red-400">
                      Title is required!
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-start mt-4">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px]">
                  Body
                </label>
                <div className="w-3/4 px-[15px]">
                  <ReactQuill
                    className="editor bg-[#0B1220] rounded-lg min-h-[150px] block w-full h-[34px] text-sm text-[#E9D8C8] border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                    theme="snow"
                    value={content.body}
                    onChange={(value) => setContent({ ...content, body: value })}
                    modules={modules}
                    placeholder="Enter Body Text Here..."
                    required
                  />
                  {content.body === '' && updateButtonClicked && (
                    <p className="mt-2 text-xs text-red-400">
                      Body is required!
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 py-2 flex justify-end gap-2 pr-8 border-t border-[#11B3AE] border-opacity-20">
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
                onClick={handleUpdateButtonClicked}
                loading={isUpdateButtonLoading}
              >
                Update
              </LoadingButton>
              <LoadingButton
                variant="contained"
                size="small"
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#fa5252!important',
                  color: '#FFFFFF',
                  fontWeight: 500,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#e03131!important',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(250, 82, 82, 0.3)',
                  },
                }}
                onClick={handleDeleteButtonClicked}
                loading={isDeleteButtonLoading}
              >
                Delete
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhitelabelHomepage;
