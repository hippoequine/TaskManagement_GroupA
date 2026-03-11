import { useState, useEffect } from 'react';
import IssueTypeToggle from './issueTypeToggle';
import UserAutocomplete from './userAutoComplete';
import ProjectAutocomplete from './ProjectAutocomplete';
import DescriptionField from './DescriptionField';
import DueDatePicker from './DueDatePicker';
import PriorityLabel from './PriorityLabel';
import StoryPointButtonGroup from './StoryPointButtonGroup';
import TitleField from './TitleField';
import { Button, Box, Snackbar, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import api from '../../api/axios';

function CreateIssueForm({
  mode = 'create', // 'create' or 'edit'
  issueId = null,
  initialData = null,
  onIssueCreation, // callback to close modal / refresh
}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // State keys match backend expectations (from main branch)
  const [issueData, setIssueData] = useState({
    project: null,
    type: 'story', // note: 'type', not 'issueType'
    description: '',
    reporter: null,
    priority: 'low', // lowercase
    title: '',
    storyPoints: 1,
    dueDate: null,
  });

  // Populate form when in edit mode and initialData changes
  useEffect(() => {
    if (initialData) {
      setIssueData({
        project: initialData.project || null,
        type: initialData.issueType || initialData.type || 'story',
        description: initialData.description || '',
        reporter: initialData.reporter || null,
        priority: (initialData.priority || 'low').toLowerCase(),
        title: initialData.title || '',
        storyPoints: initialData.storyPoints || 1,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
      });
    }
  }, [initialData]);

  const handleChange = (field) => (value) => {
    setIssueData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function uploadAttachments(issueId) {
    if (attachments.length === 0) return;

    const formData = new FormData();

    attachments.forEach((file) => {
      formData.append('file', file);
    });

    await api.post(`/issues/${issueId}/attachments`, formData);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Build payload using backend-expected field names
    const payload = {
      project: issueData.project?.id ?? null,
      type: issueData.type,
      description: issueData.description,
      dueDate: issueData.dueDate?.toISOString() ?? null,
      reporterId: issueData.reporter?.id ?? null,
      priority: issueData.priority.toLowerCase(),
      title: issueData.title,
      storyPoints: issueData.storyPoints,
    };

    try {
      if (mode === 'edit' && issueId) {
        await api.put(`/issues/${issueId}`, payload);
        await uploadAttachments(issueId);
        setSuccessMessage('Issue updated successfully!');
      } else {
        const response = await api.post('/issues', payload);
        const newIssueId = response.data.issue.id;

        await uploadAttachments(newIssueId);

        setSuccessMessage('Issue created successfully!');

        // Reset form after successful creation
        if (mode === 'create') {
          setIssueData({
            project: null,
            type: 'story',
            description: '',
            reporter: null,
            priority: 'low',
            title: '',
            storyPoints: 1,
            dueDate: null,
          });
          setAttachments([]);
        }
      }

      // Notify parent of success and close after a short delay
      if (onIssueCreation) {
        setTimeout(() => {
          onIssueCreation(false); // close modal
        }, 2000);
      }
    } catch (err) {
      console.error('Submit error:', err);
      console.error('Server response:', err.response?.data);
      const errorMsg =
        err.response?.data?.error || err.message || 'An error occurred';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div>
      <h4>{mode === 'edit' ? 'Edit Issue' : 'Create New Issue'}</h4>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TitleField
          title={issueData.title}
          onUpdateTitle={handleChange('title')}
        />

        <ProjectAutocomplete
          value={issueData.project}
          onChange={handleChange('project')}
        />

        <IssueTypeToggle
          selectedType={issueData.type}
          onTypeChange={handleChange('type')}
        />

        <DescriptionField
          description={issueData.description}
          onUpdateDescription={handleChange('description')}
        />

        <DueDatePicker
          dueDate={issueData.dueDate}
          onDueDateUpdate={handleChange('dueDate')}
        />

        <UserAutocomplete
          userValue={issueData.reporter}
          onUserValueChange={handleChange('reporter')}
        />

        <PriorityLabel
          priority={issueData.priority}
          onUpdatePriority={handleChange('priority')}
        />

        <Box>
          <span>Story Points</span>
          <StoryPointButtonGroup
            points={issueData.storyPoints}
            onUpdatePoints={handleChange('storyPoints')}
          />
        </Box>

        <Box>
          <Button variant="outlined" component="label">
            Add Attachment
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setAttachments((prev) => [...prev, ...files]);
                e.target.value = null;
              }}
            />
          </Button>
          {attachments.map((file, i) => (
            <Box key={i} sx={{ fontSize: 14 }}>
              {file.name}
            </Box>
          ))}
        </Box>

        <Snackbar
          open={Boolean(errorMessage) || Boolean(successMessage)}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            severity={errorMessage ? 'error' : 'success'}
            onClose={handleCloseSnackbar}
          >
            {errorMessage || successMessage}
          </Alert>
        </Snackbar>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onIssueCreation && (
            <Button
              type="button"
              variant="outlined"
              onClick={() => onIssueCreation(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={!issueData.title || isLoading}
          >
            {isLoading
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Issue'
                : 'Create Issue'}
          </Button>
        </Box>
      </Box>
    </div>
  );
}

CreateIssueForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  issueId: PropTypes.string,
  initialData: PropTypes.object,
  onIssueCreation: PropTypes.func.isRequired,
};

export default CreateIssueForm;
