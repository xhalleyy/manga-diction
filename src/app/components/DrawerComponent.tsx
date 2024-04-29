"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

type Anchor = 'right';

export default function DrawerComponent() {

  const router = useRouter();

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer =
  (anchor: Anchor, open: boolean) =>
  (event: React.KeyboardEvent | React.MouseEvent<Element, MouseEvent>) => {
    console.log('Toggling drawer:', open);
  
    if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
              (event as React.KeyboardEvent).key === 'Shift')
              
      ) {
          return;
      }

      setState({ ...state, [anchor]: open });
  };

  const handlePageChange = (page: string) => {
    console.log('Page clicked:', page); // Debug statement
    if (page === 'Home') {
      console.log('Navigating to /Dashboard'); // Debug statement
      router.push('/Dashboard');
    } else if (page === 'Browse Clubs') {
      console.log('Navigating to /BrowseClubs'); // Debug statement
      router.push('/BrowseClubs');
    } else if (page === 'Search Manga') {
      console.log('Navigating to /SearchManga'); // Debug statement
      router.push('/SearchManga');
    } else {
      console.log('Navigating to:', page); // Debug statement
      router.push(`${page}`);
    }
  };

  const list = (anchor: Anchor) => (
    <Box

      sx={{ backgroundColor: 'rgba(207, 198, 183, 1)' }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className='text-darkbrown pr-20 pl-10 pb-96 pt-52 mb-48 mt-4 bg-ivory'>
        {['Home', 'Browse Clubs', 'Search Manga', 'Notifications', 'Profile'].map((text) => (
          <ListItem className='font-mainFont text-3xl bg-ivory' key={text} sx={{ fontSize: '30px', backgroundColor: 'ivory' }} disablePadding>
            <ListItemButton>
              <ListItemText
              onClick={() => handlePageChange(text)}
                primary={text}
                primaryTypographyProps={{
                  variant: 'body1',
                  style: { fontSize: '1.5rem', fontFamily: 'mainFont', fontWeight: 'bold', marginBottom: 5 }
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
          <Button onClick={toggleDrawer(anchor, true)}><DehazeIcon className='text-3xl text-darkbrown bg-offwhite rounded-xl w-10 h-10 p-1' /></Button>
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