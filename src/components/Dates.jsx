import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { fetchBookedDates } from "../services/api";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Dates({ formData, setFormData }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (formData.model) {
      fetchBookedDates(formData.model)
        .then((dates) => {
          setBookedDates(dates);
        })
        .catch(() => setError("Failed to load booked dates"));
    }
  }, [formData.model]);

  // Block dates that fall within any booked range
  const isDateBlocked = (date) => {
    const dayjsDate = dayjs(date); // Convert native Date → dayjs

    // Skip invalid date
    if (!dayjsDate.isValid()) return false;

    return bookedDates.some(
      (range) =>
        dayjsDate.isSameOrAfter(range.start, "day") &&
        dayjsDate.isSameOrBefore(range.end, "day")
    );
  };

  // Validate full range
  const isRangeBlocked = (start, end) => {
    if (!start || !end) return true;

    let currentDate = start.startOf("day");
    const endOfDay = end.endOf("day");

    while (currentDate.isSameOrBefore(endOfDay, "day")) {
      if (isDateBlocked(currentDate)) {
        return true;
      }
      currentDate = currentDate.add(1, "day");
    }

    return false;
  };

  const handleStartDateChange = (newDate) => {
    const safeDate = dayjs(newDate);
    setStartDate(safeDate);

    // Auto-adjust end date
    if (endDate && safeDate.isAfter(endDate)) {
      setEndDate(safeDate);
    }
  };

  const handleEndDateChange = (newDate) => {
    const safeDate = dayjs(newDate);
    setEndDate(safeDate);
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      setTimeout(() => {
        setError("");
      }, 5000);
      // return;
    } else if (endDate.isBefore(startDate)) {
      setError("End date must be after start date");
      setTimeout(() => {
        setError("");
      }, 5000);
      // return;
    } else if (isRangeBlocked(startDate, endDate)) {
      setError("Selected range includes booked dates");
      setTimeout(() => {
        setError("");
      }, 5000);
      // return;
    } else {
      setSuccess("Form submitted successfully");
    }

    // Save final booking data to localStorage
    const bookingData = {
      ...formData,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    };

    setFormData(bookingData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Select Rental Dates
        </Typography>

        <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
          {/* Start Date Picker */}
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            minDate={dayjs()}
            shouldDisableDate={isDateBlocked}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />

          {/* End Date Picker */}
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            minDate={startDate || dayjs()}
            shouldDisableDate={isDateBlocked}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
            sx={{ mt: 2 }}
          />

          {error && <FormHelperText error>{error}</FormHelperText>}
          {success && (
            <FormHelperText style={{ color: "green" }}>
              {success}
            </FormHelperText>
          )}
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
