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
import axios from 'axios';

function CreateTicketForm({ onIssueCreation }) {
  const [errorMessage, setErrorMessage] = useState(null);

  const [ticketData, setTicketData] = useState({
    project: null,
    issueType: 'Story',
    description: '',
    reporter: null,
    priority: 'Low',
    title: '',
    storyPoints: 1,
    dueDate: null,
  });

  const handleChange = (field) => (value) => {
    setTicketData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();

    onIssueCreation(false);

    const payload = {
      project: ticketData.project?.id ?? null,
      issueType: ticketData.issueType,
      description: ticketData.description,
      dueDate: ticketData.dueDate?.toISOString() ?? null,
      reporterId: ticketData.reporter?.id ?? null,
      priority: ticketData.priority,
      title: ticketData.title,
      storyPoints: ticketData.storyPoints,
    };
    //console.log(payload);

    try {
      await createTicket(payload);
    } catch (err) {
      //console.error(err);
      setErrorMessage(err.message);
    }
  };

  const createTicket = async (payload) => {
    try {
      const res = await axios.post('/api/issues', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      <h4>Create New Ticket</h4>
      <Box
        component="form"
        onSubmit={handleCreateTicketSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TitleField
          title={ticketData.title}
          onUpdateTitle={handleChange('title')}
        />
        <ProjectAutocomplete
          value={ticketData.project}
          onChange={handleChange('project')}
        />
        <IssueTypeToggle
          selectedType={ticketData.issueType}
          onTypeChange={handleChange('issueType')}
        />
        <DescriptionField
          description={ticketData.description}
          onUpdateDescription={handleChange('description')}
        />
        <DueDatePicker
          dueDate={ticketData.dueDate}
          onDueDateUpdate={handleChange('dueDate')}
        />
        <UserAutocomplete
          value={ticketData.reporter}
          onChange={handleChange('reporter')}
        />
        <PriorityLabel
          priority={ticketData.priority}
          onUpdatePriority={handleChange('priority')}
        />
        Story Points
        <StoryPointButtonGroup
          points={ticketData.storyPoints}
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
        <Button type="submit" variant="contained" disabled={!ticketData.title}>
          Create Ticket
        </Button>
      </Box>
    </div>
  );
}

CreateTicketForm.propTypes = {
  onIssueCreation: PropTypes.func.isRequired,
};

export default CreateTicketForm;
