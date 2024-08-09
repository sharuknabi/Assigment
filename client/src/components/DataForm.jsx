import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  SNo: yup.string().required("SNo is required"),
  Year: yup.string().required("Year is required"),
  DATASET: yup.string().required("DATASET is required"),
  Discription: yup.string().required("Description is required"),
  KindOfTraffic: yup.string().required("KindOfTraffic is required"),
  PublicallyAvailable: yup.string().required("PublicallyAvailable is required"),
  Count: yup.string().required("Count is required"),
  FeatureCount: yup.string().required("FeatureCount is required"),
  DOI: yup.string().required("DOI is required"),
  DownloadLinks: yup
    .string()
    .url("Enter a valid URL")
    .required("DownloadLinks is required"),
});

const DataForm = () => {
  const [formValues, setFormValues] = useState({
    SNo: "",
    Year: "",
    DATASET: "",
    Discription: "",
    KindOfTraffic: "",
    PublicallyAvailable: "",
    Count: "",
    FeatureCount: "",
    DOI: "",
    DownloadLinks: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false); // State to handle loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    try {
      await schema.validate(formValues, { abortEarly: false });

      // Check for duplicate SNo
      const response = await axios.get(
        `http://localhost:3000/data/check-duplicate-sno`,
        {
          params: { SNo: formValues.SNo },
        }
      );

      if (response.data.exists) {
        setFormErrors({ SNo: "SNo already exists" });
        setSnackbarMessage(
          "SNo already exists. Please choose a different SNo."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      const submitResponse = await axios.post(
        "http://localhost:3000/data/create",
        formValues,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Form submitted:", submitResponse.data);
      setSnackbarMessage("Form submitted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      // Clear form values after submission
      setFormValues({
        SNo: "",
        Year: "",
        DATASET: "",
        Discription: "",
        KindOfTraffic: "",
        PublicallyAvailable: "",
        Count: "",
        FeatureCount: "",
        DOI: "",
        DownloadLinks: "",
      });
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setFormErrors(validationErrors);
      } else {
        console.error("There was an error submitting the form!", error);
        setSnackbarMessage("Error submitting the form. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <div className={loading ? "blurred" : ""}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {Object.keys(formValues).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key.split(/(?=[A-Z])/).join(" ")} // Capitalize the label
                  name={key}
                  value={formValues[key]}
                  onChange={handleChange}
                  fullWidth
                  multiline // Make all fields a textarea
                  rows={1} // Set the initial number of rows for the textarea
                  error={!!formErrors[key]}
                  helperText={formErrors[key]}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      {loading && (
        <div className="loader-overlay">
          <CircularProgress />
        </div>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <style>
        {`
          .blurred {
            filter: blur(4px);
            transition: filter 0.3s ease;
          }
          .loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.7); 
            z-index: 999;
          }
        `}
      </style>
    </Container>
  );
};

export default DataForm;
