import React, { useState, useEffect } from "react";
import { Container, List, ListItem, ListItemText, ListItemIcon, Button, Typography, Paper } from "@mui/material";
import api from "../../api";
import { useNotify } from "../../context/NotificationContext";
import PageLoader from "../../components/PageLoader";
import EmptyState from "../../components/EmptyState";
import { MdOutlineDescription, MdOutlineDownload } from "react-icons/md";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const notify = useNotify();

  useEffect(() => {
    api
      .get("/api/reports")
      .then((res) => setReports(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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
      notify("Failed to download report", "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Recycling Reports
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        All reports submitted by recyclers.
      </Typography>

      {loading ? (
        <PageLoader />
      ) : reports.length === 0 ? (
        <EmptyState icon={<MdOutlineDescription size={40} />} title="No reports yet" description="Uploaded reports will appear here." />
      ) : (
        <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <List disablePadding>
            {reports.map((report, i) => (
              <ListItem
                key={report.id}
                divider={i !== reports.length - 1}
                secondaryAction={
                  <Button size="small" variant="outlined" startIcon={<MdOutlineDownload />} onClick={() => download(report)}>
                    Download
                  </Button>
                }
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                  <MdOutlineDescription size={20} />
                </ListItemIcon>
                <ListItemText primary={report.filename} secondary={new Date(report.createdAt).toLocaleDateString()} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default ViewReports;
