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

export default function VehicleType({ formData, setFormData, onNext, types }) {
  const [selected, setSelected] = useState(formData.vehicleType || "");
  const [error, setError] = useState("");

  // Filter vehicle types based on selected number of wheels
  const filtered = types.filter((type) => type.wheels === formData.wheels);

  const handleNext = () => {
    if (!selected) {
      setError("Please select a vehicle type");
      return;
    }
    setFormData({ ...formData, vehicleType: selected });
    onNext();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Type of Vehicle
      </Typography>

      <FormControl fullWidth error={!!error}>
        <FormLabel component="legend">Select vehicle type</FormLabel>
        <RadioGroup
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {filtered.map((type) => (
            <FormControlLabel
              key={type.id}
              value={type.id}
              control={<Radio />}
              label={type.name}
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
