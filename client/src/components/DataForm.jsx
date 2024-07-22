import React from "react";
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

const DataForm = () => {
  const [formValues, setFormValues] = React.useState({
    name: "",
    username: "",
    timeOrderPreserved: "",
    groundTruthSource: "",
    negativeAssessed: "",
    label: "",
    manuallyCurated: "",
    sourceDataNature: "",
    entityGranularity: "",
    action: "",
  });

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [loading, setLoading] = React.useState(false); // State to handle loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    axios
      .post("http://localhost:3000/data/create", formValues, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Form submitted:", response.data);
        setSnackbarMessage("Form submitted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        // Clear form values after submission
        setFormValues({
          name: "",
          username: "",
          timeOrderPreserved: "",
          groundTruthSource: "",
          negativeAssessed: "",
          label: "",
          manuallyCurated: "",
          sourceDataNature: "",
          entityGranularity: "",
          action: "",
        });
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
        setSnackbarMessage("Error submitting the form. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after submission
      });
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
