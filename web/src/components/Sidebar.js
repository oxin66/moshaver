import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Counselor Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/ai-analysis">
          <ListItemText primary="AI Analysis" />
        </ListItem>
        <ListItem button component={Link} to="/students">
          <ListItemText primary="Manage Students" />
        </ListItem>
        <ListItem button component={Link} to="/schedule">
          <ListItemText primary="Weekly Schedule" />
        </ListItem>
        <ListItem button component={Link} to="/messages">
          <ListItemText primary="Messages" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
