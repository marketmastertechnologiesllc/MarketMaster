import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

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
    content: '',
  });

  const [titles, setTitles] = React.useState([]);
  const [selectedTitle, setSelectedTitle] = React.useState('');
  const [isLoadingTitles, setIsLoadingTitles] = React.useState(false);
  const [isLoadingContent, setIsLoadingContent] = React.useState(false);

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
          setContent({ ...res.data.data, content: '' });
          // Refresh titles list after adding new content
          fetchTitles();
          // Clear the new content form
          setNewContent({ title: '' });
          setAddButtonClicked(false);
        })
        .catch((err) => {
          showToast('Failed to add content', 'error');
        })
        .finally(() => {
          setIsAddButtonLoading(false);
        });
    }
  };

  const handleUpdateButtonClicked = () => {
    setUpdateButtonClicked(true);
    
    // Check if a title is selected and content has an ID
    if (!selectedTitle || !content.id) {
      showToast('Please select a title to update!', 'error');
      return;
    }
    
    // Check if content is not empty
    if (!content.content || content.content.trim() === '') {
      showToast('Body content is required!', 'error');
      return;
    }
    
    setIsUpdateButtonLoading(true);
    
    // Try the primary update endpoint
    api
      .put(`/settings/homepage-content/${content.id}`, {
        title: content.title,
        content: content.content,
      })
      .then((res) => {
        if (res.data.status === 'OK') showToast('Updated successfully', 'success');
        else showToast('Update failed', 'error');
        setUpdateButtonClicked(false);
      })
      .catch((err) => {
        // Try alternative update endpoint
        return api.put(`/settings/homepage-content`, {
          id: content.id,
          title: content.title,
          content: content.content,
        });
      })
      .then((res) => {
        if (res) {
          showToast('Updated successfully', 'success');
          setUpdateButtonClicked(false);
        }
      })
      .catch((err) => {
        showToast('Update failed', 'error');
      })
      .finally(() => {
        setIsUpdateButtonLoading(false);
      });
  };

  const handleDeleteButtonClicked = () => {
    setIsDeleteButtonLoading(true);
    api
      .delete(`/settings/homepage-content/${content.id}`)
      .then((res) => {
        showToast('Deleted successfully', 'success');
        setContent({
          id: '',
          title: '',
          content: '',
        });
        setSelectedTitle('');
        // Refresh titles list after deleting content
        fetchTitles();
      })
      .catch((err) => {
        showToast('Delete failed', 'error');
      })
      .finally(() => {
        setIsDeleteButtonLoading(false);
      });
  };

  const fetchTitles = async () => {
    try {
      setIsLoadingTitles(true);
      const res = await api.get('/settings/homepage-content/titles');
      setTitles(res.data || []);
    } catch (err) {
      showToast('Failed to fetch titles', 'error');
    } finally {
      setIsLoadingTitles(false);
    }
  };

  const fetchContentByTitle = async (title) => {
    try {
      setIsLoadingContent(true);
      
      // Try the first endpoint
      let res;
      try {
        res = await api.get(`/settings/homepage-content/title/${encodeURIComponent(title)}`);
      } catch (err) {
        // If first endpoint fails, try alternative endpoint
        res = await api.get(`/settings/homepage-content?title=${encodeURIComponent(title)}`);
      }
      
      if (res.data) {
        setContent({
          id: res.data.id || '',
          title: res.data.title || title,
          content: res.data.content || ''
        });
      } else {
        setContent({ id: '', title: title, content: '' });
      }
    } catch (err) {
      showToast('Failed to fetch content', 'error');
      // Set empty content with the selected title
      setContent({ id: '', title: title, content: '' });
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleTitleChange = (event) => {
    const selectedTitleValue = event.target.value;
    setSelectedTitle(selectedTitleValue);
    
    if (selectedTitleValue) {
      fetchContentByTitle(selectedTitleValue);
    } else {
      setContent({ id: '', title: '', content: '' });
    }
  };

  React.useEffect(() => {
    fetchTitles();
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
              <h2 className="mt-1 text-[20px] font-normal text-[#FFFFFF]">
                {content.id ? `Content#${content.id}` : 'Select Content'}
              </h2>
            </header>
            <div className="box-border py-3 px-4 bg-[#0B1220]">
              <div className="flex justify-start">
                <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px]">
                  Select Title
                </label>
                <div className="w-3/4 px-[15px]">
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedTitle}
                      onChange={handleTitleChange}
                      displayEmpty
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#0B1220',
                            border: '1px solid rgba(17, 179, 174, 0.3)',
                            borderRadius: '8px',
                            maxHeight: '200px',
                            '& .MuiMenuItem-root': {
                              color: '#E9D8C8',
                              '&:hover': {
                                backgroundColor: 'rgba(17, 179, 174, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#11B3AE',
                                color: '#FFFFFF',
                                '&:hover': {
                                  backgroundColor: '#0F9A95',
                                },
                              },
                            },
                          },
                        },
                      }}
                      input={
                        <OutlinedInput
                          sx={{
                            color: '#E9D8C8',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(17, 179, 174, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(17, 179, 174, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#11B3AE',
                              boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
                            },
                            '& .MuiSelect-icon': {
                              color: '#E9D8C8',
                            },
                          }}
                        />
                      }
                    >
                      <MenuItem value="">
                        <em>Select a title to edit</em>
                      </MenuItem>
                      {titles.map((title, index) => (
                        <MenuItem key={index} value={title}>
                          {title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedTitle === '' && updateButtonClicked && (
                    <p className="mt-2 text-xs text-red-400">
                      Please select a title!
                    </p>
                  )}
                </div>
              </div>
              {selectedTitle && (
                <>
                  <div className="flex justify-start mt-4">
                    <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px]">
                      Title
                    </label>
                    <div className="w-3/4 px-[15px]">
                      <input
                        type="text"
                        value={content.title}
                        readOnly
                        className="block w-full h-[34px] text-sm bg-[#0B1220] text-[#E9D8C8] px-3 py-1.5 rounded-lg border border-[#11B3AE] border-opacity-30 opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex justify-start mt-4">
                    <label className="inline-block relative text-right w-1/4 pt-[7px] px-[15px] max-w-full text-[#E9D8C8] text-[13px]">
                      Body
                    </label>
                    <div className="w-3/4 px-[15px]">
                      {isLoadingContent ? (
                        <div className="flex items-center justify-center h-[150px] bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-30">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11B3AE]"></div>
                          <span className="ml-2 text-[#E9D8C8]">Loading content...</span>
                        </div>
                      ) : (
                        <ReactQuill
                          className="editor bg-[#0B1220] rounded-lg min-h-[150px] block w-full h-[34px] text-sm text-[#E9D8C8] border border-[#11B3AE] border-opacity-30 focus:border-[#11B3AE] focus:outline-none focus:ring-2 focus:ring-[#11B3AE] focus:ring-opacity-20 transition-all duration-200"
                          theme="snow"
                          value={content.content}
                          onChange={(value) => setContent({ ...content, content: value })}
                          modules={modules}
                          placeholder="Enter Body Text Here..."
                          required
                        />
                      )}
                      {(!content.content || content.content.trim() === '') && updateButtonClicked && (
                        <p className="mt-2 text-xs text-red-400">
                          Body content is required!
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            {selectedTitle && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhitelabelHomepage;
