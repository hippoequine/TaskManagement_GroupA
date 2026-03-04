import { Box, Container, Typography, Button } from '@mui/material';
import { Lock } from '@mui/icons-material';
import keycloak from '../keycloak';

export default function Unauthorized({ role }) {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: 6,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Jiro
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F4F5F7',
              borderRadius: '50%',
              width: 80,
              height: 80,
              mb: 3,
            }}
          >
            <Lock sx={{ fontSize: 40, color: '#42526E' }} />
          </Box>
          {role ? (
            <>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 500, mb: 2 }}
              >
                Unauthorized
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                You do not have the roles required to access this content.
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 500, mb: 2 }}
              >
                Please log in to view this page
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                You need to be authenticated to access this content. Click below
                to log in.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => keycloak.login()}
                sx={{
                  backgroundColor: '#0052CC',
                  textTransform: 'none',
                  fontSize: '1rem',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#0747A6',
                  },
                }}
              >
                Log in
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
