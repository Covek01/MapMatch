import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { Avatar, Button } from '@mui/material';


export default function VirtualizedList() {
    const data = ["Ime1", "Ime2", "Ime1", "Ime2", "Ime1", "Ime2", "Ime1", "Ime2", "Ime1", "Ime2", "Ime1", "Ime2"];
    function renderRow(props) {
      const { index, style } = props;
    
     //kako da prosledim ovde neku listu username-a
      return (
        <ListItem style={style} key={index} component="div" disablePadding>
          <Avatar></Avatar>
          {data[index]}
          <Button>Otvori profil</Button>
        </ListItem>
      );
    }
  return (
    <Box
    sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={data.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}