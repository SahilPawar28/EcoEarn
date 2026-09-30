import React, { useState, useEffect } from "react";
import { Container, List, ListItem, ListItemText, Button, Typography } from "@mui/material";
import api from "../../api";

const ViewReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api
      .get("/api/reports")
      .then((res) => setReports(res.data))
      .catch((err) => console.error(err));
  }, []);

  const download = async (report) => {
    try {
      const res = await api.get(report.url, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = report.filename;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to download report");
    }
  };

  return (
    <Container>
      <Typography variant="h4">📜 View Recycling Reports</Typography>
      <List>
        {reports.map((report) => (
          <ListItem key={report.id}>
            <ListItemText primary={report.filename} />
            <Button variant="contained" color="primary" onClick={() => download(report)}>Download</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ViewReports;
