"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DehazeIcon from '@mui/icons-material/Dehaze'; 
import { Typography } from '@mui/material';

type Anchor = 'right';

export default function DrawerComponent() {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
    
      sx={{ backgroundColor: 'ivory'}}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className='text-darkbrown pr-20 pl-8  mt-48 bg-ivory'>
        {['Home', 'Browse Clubs', 'Search Manga', 'Notifications', 'Profile'].map((text) => (
          <ListItem className='font-mainFont text-3xl bg-ivory' key={text} sx={{ fontSize: '30px', backgroundColor: 'ivory'}} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} primaryTypographyProps={{
                  variant: 'body1',
                  style: { fontSize: '1.5rem', fontFamily: 'mainFont', fontWeight: 'bold' }
                }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>      
    </Box>
  );

  return (
    <div className=''>
      {(['right'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}><DehazeIcon className='text-3xl text-darkbrown bg-offwhite rounded-xl w-10 h-10 p-1'/></Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}