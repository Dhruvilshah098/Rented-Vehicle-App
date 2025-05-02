import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";

export default function Wheels({ formData, setFormData, onNext, wheels }) {
  const [selected, setSelected] = useState(formData.wheels || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selected) {
      setError("Please select a wheel option");
      return;
    }
    setFormData({ ...formData, wheels: parseInt(selected, 10) });
    onNext();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Number of Wheels
      </Typography>

      <FormControl fullWidth error={!!error}>
        <FormLabel component="legend">Select number of wheels</FormLabel>
        <RadioGroup
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {wheels.map((wheel, index) => (
            <FormControlLabel
              key={index}
              value={wheel}
              control={<Radio />}
              label={wheel}
            />
          ))}
        </RadioGroup>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        sx={{ mt: 3 }}
        fullWidth
      >
        Next
      </Button>
    </Box>
  );
}
