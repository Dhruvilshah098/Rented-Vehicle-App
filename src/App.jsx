import React, { useEffect, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import {
  CssBaseline,
  Container,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { fetchVehicleTypes } from "./services/api";
import Name from "./components/Name";
import Wheels from "./components/Wheels";
import VehicleType from "./components/VehicleType";
import Model from "./components/Model";
import Dates from "./components/Dates";

const theme = createTheme();

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useLocalStorage("formData", {});

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const [wheels, setWheels] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  useEffect(() => {
    fetchVehicleTypes()
      .then((data) => {
        setVehicleData(data);
        const wheels = data.map((item) => item.wheels);
        const uniqueWheels = [...new Set(wheels)]; // Remove duplicates
        setWheels(uniqueWheels.sort((a, b) => a - b));
      })
      .catch(() => setError("Failed to load wheels"));
  }, []);

  console.log(formData, "formData");

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Name
            formData={formData}
            setFormData={setFormData}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <Wheels
            formData={formData}
            setFormData={setFormData}
            onNext={goToNextStep}
            wheels={wheels}
          />
        );
      case 3:
        return (
          <VehicleType
            formData={formData}
            setFormData={setFormData}
            onNext={goToNextStep}
            types={vehicleData}
          />
        );
      case 4:
        return (
          <Model
            formData={formData}
            setFormData={setFormData}
            onNext={goToNextStep}
            vehicleData={vehicleData}
          />
        );
      case 5:
        return (
          <Dates
            formData={formData}
            setFormData={setFormData}
            onSubmit={goToNextStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Paper sx={{ mt: 4, p: 2 }}>{renderStep()}</Paper>
      </Container>
    </ThemeProvider>
  );
}
