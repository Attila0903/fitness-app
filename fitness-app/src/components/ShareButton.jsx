import React from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { useState } from 'react';

const ShareButton = ({ title, text }) => {
  const [open, setOpen] = useState(false);

  const handleShare = async () => {
    // JS API HASZNÁLATA: Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (error) {
        console.log('Megosztás megszakítva vagy hiba:', error);
      }
    } else {
      // Ha nem támogatott (pl. asztali Chrome), másoljuk vágólapra (Clipboard API)
      navigator.clipboard.writeText(`${title}\n${text}`);
      setOpen(true); // Visszajelzés megjelenítése
    }
  };

  return (
    <>
      <Button 
        variant="outlined" 
        startIcon={<ShareIcon />} 
        onClick={handleShare}
        sx={{ mt: 2 }}
      >
        Eredmény megosztása
      </Button>

      {/* Visszajelzés, ha vágólapra másoltunk */}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Szöveg a vágólapra másolva!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareButton;