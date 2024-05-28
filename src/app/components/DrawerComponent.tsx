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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchMangaModalComponent from './SearchMangaModalComponent';

type Anchor = 'right';

export default function DrawerComponent() {

  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);


  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent<Element, MouseEvent>) => {
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
    if (page === 'Home') {
      router.push('/Dashboard');
    } else if (page === 'Browse Clubs') {
      router.push('/BrowseClubs');
    } else if (page === 'Search Manga') {
      router.push('/MangaSearchMobile')
    } else if (page === 'Notifications') {
      router.push('/MobileNotifs')
    } else if (page === 'Profile') {
      router.push('/ProfilePage');
    } else if (page === 'Edit Settings') {
      router.push('/EditSettings')
    } else if (page === 'Sign Out') {
      localStorage.removeItem("Token");
      localStorage.removeItem("UserId");
      router.push('/');
    } else {
      console.log('Cannot find page:', Error);
    }
  };

  const list = (anchor: Anchor) => (
    <Box

      sx={{ backgroundColor: 'rgba(207, 198, 183, 1)', padding: 5, paddingTop: 30, height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className=''>
        {['Home', 'Browse Clubs', 'Search Manga', 'Notifications', 'Profile', 'Edit Settings', 'Sign Out'].map((text) => (
          <ListItem onClick={() => handlePageChange(text)} className='font-mainFont' key={text} sx={{ fontSize: '30px', backgroundColor: 'ivory' }} disablePadding>
            <ListItemButton>
              <ListItemText
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
    <div className='bg-offwhite rounded-xl w-14'>
      {(['right'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button className='' onClick={toggleDrawer(anchor, true)}><DehazeIcon style={{ fontSize: 35 }} className='text-darkbrown mr-2' /></Button>
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