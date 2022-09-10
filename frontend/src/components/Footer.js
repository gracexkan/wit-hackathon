import React from 'react';

import { Box, Container, Divider, IconButton, Link, Stack, Typography } from '@mui/material';
import { GitHub } from '@mui/icons-material';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ marginTop: 'auto' }}>
      <Divider />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            © {year} UNSW WIT Hackathon - Grace Kan, Raiyan Ahmed, Sally Sun and Zami Lee
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link
              color="text.secondary"
              href="https://github.com/zaxutic/allocatepp"
              target="_blank"
              underline="none"
              variant="body2"
            >
              <IconButton aria-label="GitHub">
                <GitHub />
              </IconButton>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;