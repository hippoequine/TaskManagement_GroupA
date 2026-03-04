import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Displays the content for a tab in the main panel
 * @param {object} props - component props
 * @param {React.ReactNode} children - The content to display inside the tab panel, needs value === index.
 * @param {number} value - The index of the current selected tab
 * @param {number} index - The tab index the panel is linked to. The panel is shown when the selected tab index matches this value, value === index.
 * @param {object} other - Additional props passed to the root element.
 * @returns {JSX.Element|null} the tab panel if active and null if not active.
 */
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  //return whatever content is passed inside the CustomTabPanel
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node, //anything React can safely render
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default CustomTabPanel;
