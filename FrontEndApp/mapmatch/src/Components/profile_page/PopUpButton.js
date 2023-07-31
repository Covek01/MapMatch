import { Button } from "@mui/material";
import React from "react";


export default function PopUpButton ({textForTitle}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    return (
        <div>
            <Button variant="outlined" style={{color : 'black', borderColor : 'black'}}onClick={handleClickOpen}>
                {textForTitle}
            </Button>
        </div>
    );
}