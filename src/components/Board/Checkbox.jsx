// Checkbox.js
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const StyledCheckbox = ({ label, checked, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color="primary" 
        />
      }
      label={label}
      labelPlacement="end" 
    />
  );
};

export default StyledCheckbox;
