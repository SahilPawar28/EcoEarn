import React, { useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import api from "../../api";

const UploadReport = () => {
  const [report, setReport] = useState(null);

  const handleFileChange = (e) => setReport(e.target.files[0]);

  const uploadReport = () => {
    if (!report) {
      alert("Please choose a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("report", report);

    api
      .post("/api/reports/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => alert("Report uploaded successfully"))
      .catch((err) => {
        console.error(err);
        alert("Failed to upload report");
      });
  };

  return (
    <Container>
      <Typography variant="h4">📄 Upload Recycling Report</Typography>
      <input type="file" onChange={handleFileChange} style={{ margin: "16px 0" }} />
      <br />
      <Button variant="contained" color="primary" onClick={uploadReport}>Upload</Button>
    </Container>
  );
};

export default UploadReport;
