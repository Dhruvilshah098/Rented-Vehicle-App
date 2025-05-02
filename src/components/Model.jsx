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
  Avatar,
  FormHelperText,
} from "@mui/material";
import { fetchModels } from "../services/api";

export default function Model({ formData, setFormData, onNext, vehicleData }) {
  const [models, setModels] = useState([]);
  const [modelImages, setModelImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(formData.model || "");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModelsAndImages = async () => {
      try {
        // Step 1: Get the selected vehicle type
        const vehicleType = vehicleData.find(
          (v) => v.id === formData.vehicleType
        );
        if (!vehicleType) throw new Error("Vehicle type not found");

        const modelsList = vehicleType.vehicles;
        setModels(modelsList);

        // Step 2: Fetch images for each model
        setLoading(true);

        const imagePromises = modelsList.map(async (model) => {
          try {
            const modelDetails = await fetchModels(model.id); // API call per model
            return {
              id: model.id,
              name: modelDetails.name,
              url: modelDetails.image.publicURL,
            };
          } catch (err) {
            console.warn(`Failed to load image for model ${model.id}`);
            return { id: model.id, url: null };
          }
        });

        const images = await Promise.all(imagePromises);

        setModelImages(images);
      } catch (err) {
        setError("Failed to load models or images.");
      } finally {
        setLoading(false);
      }
    };

    if (formData.vehicleType) {
      fetchModelsAndImages();
    }
  }, [formData.vehicleType, vehicleData]);

  const handleNext = () => {
    if (!selected) {
      setError("Please select a model");
      return;
    }
    setFormData({ ...formData, model: selected });
    onNext();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Specific Model
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <FormControl fullWidth error={!!error}>
          <FormLabel component="legend">Select vehicle model</FormLabel>
          <RadioGroup
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {modelImages.map((model) => (
              <FormControlLabel
                key={model.id}
                value={model.id}
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={model.url}
                      alt={model.name}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <span>{model.name}</span>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />
            ))}
          </RadioGroup>
          <FormHelperText>{error}</FormHelperText>
        </FormControl>
      )}

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
