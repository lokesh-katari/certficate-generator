'use client'
import * as React from 'react';
import {useState} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
    externalResolver: true, // Allow custom handling of the response
  },
};
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface YourComponentProps {
  open:boolean
  }
const Download = () => {
   
    const handleOpen = () => setOpen(true);
    const [Open, setOpen] = useState<boolean>(true);
    const handleClose = () => setOpen(false);
    const handleDownload = () => {
        fetch('/api/Download')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log(response.blob());
            
            return response.blob();
          })
          .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'downloaded-folder.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          })
          .catch(error => {
            console.error('Error downloading folder:', error);
          });
      };
    return (
      <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
          open={true}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              please click below ! to download
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <button onClick={handleDownload}>Download Folder</button>
            </Typography>
            <button onClick={handleClose}>close</button>
          </Box>
        </Modal>
      </div>
    );
}

export default Download