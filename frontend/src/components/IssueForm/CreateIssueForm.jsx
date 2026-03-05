import { useState } from 'react';
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

function CreateIssueForm({ onIssueCreation }) {
  const [errorMessage, setErrorMessage] = useState(null);

  const [issueData, setIssueData] = useState({
    project: null,
    type: 'story',
    description: '',
    reporter: null,
    priority: 'low',
    title: '',
    storyPoints: 1,
    dueDate: null,
  });

  const handleChange = (field) => (value) => {
    setIssueData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateIssueSubmit = async (e) => {
    e.preventDefault();

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
    //console.log(payload);

    try {
      await createIssue(payload);
      onIssueCreation(false);
    } catch (err) {
      //console.error(err);
      setErrorMessage(err.message);
    }
  };

  const createIssue = async (payload) => {
    try {
      const res = await api.post('/issues', payload);
      return res.data;
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data?.error || 'Ticket creation failed');
        throw new Error(err.response.data?.error || 'Ticket creation failed');
      } else {
        setErrorMessage('Network error while creating ticket');
        throw new Error('Network error while creating ticket');
      }
    }
  };

  return (
    <div>
      <h4>Create New Issue</h4>
      <Box
        component="form"
        onSubmit={handleCreateIssueSubmit}
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
        Story Points
        <StoryPointButtonGroup
          points={issueData.storyPoints}
          onUpdatePoints={handleChange('storyPoints')}
        />
        <Button variant="outlined" component="label">
          Add Attachment
          <input type="file" hidden />
        </Button>
        <Snackbar
          open={Boolean(errorMessage)}
          onClose={() => setErrorMessage(null)}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
        <Button type="submit" variant="contained" disabled={!issueData.title}>
          Create Issue
        </Button>
        <Button type="button" onClick={() => onIssueCreation(false)}>
          Cancel
        </Button>
      </Box>
    </div>
  );
}

CreateIssueForm.propTypes = {
  onIssueCreation: PropTypes.func.isRequired,
};

export default CreateIssueForm;
