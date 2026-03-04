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

function CreateTicketForm() {
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
    const payload = {
      project: ticketData.project?.id ?? null,
      issueType: ticketData.issueType,
      description: ticketData.description,
      dueDate: ticketData.dueDate?.toISOString() ?? null,
      reporterID: ticketData.reporter?.id ?? null,
      priority: ticketData.priority,
      title: ticketData.labels.split(',').map((l) => l.trim()),
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
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage('Ticket creation failed');
        throw new Error(data.error || 'Ticket creation failed');
      }

      return res.json();
    } catch (err) {
      setErrorMessage('Network error while creating ticket');
      throw new Error(err.message || 'Network error while creating ticket');
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
          title={ticketData.labels}
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

export default CreateTicketForm;
