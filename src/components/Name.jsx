import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Name({ formData, setFormData, onNext }) {
  const [firstName, setFirstName] = useState(formData.firstName || "");
  const [lastName, setLastName] = useState(formData.lastName || "");
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";

    if (Object.keys(newErrors).length === 0) {
      setFormData({ ...formData, firstName, lastName });
      onNext();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        What is your name?
      </Typography>

      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.firstName}
        helperText={errors.firstName}
      />

      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.lastName}
        helperText={errors.lastName}
      />

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
