import React, { useState } from "react";
import { Container, Button, Typography, Paper, Box, CircularProgress } from "@mui/material";
import api from "../../api";
import { useNotify } from "../../context/NotificationContext";
import { MdOutlineUploadFile, MdOutlineDescription } from "react-icons/md";
import { colors } from "../../theme";

const UploadReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const handleFileChange = (e) => setReport(e.target.files[0]);

  const uploadReport = () => {
    if (!report) {
      notify("Please choose a file first.", "warning");
      return;
    }
    const formData = new FormData();
    formData.append("report", report);

    setLoading(true);
    api
      .post("/api/reports/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => {
        notify("Report uploaded successfully", "success");
        setReport(null);
      })
      .catch((err) => {
        console.error(err);
        notify("Failed to upload report", "error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: colors.tint, color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MdOutlineDescription size={22} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            Upload Recycling Report
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Share a completed recycling report (max 4MB).
        </Typography>

        <Box
          component="label"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            p: 4,
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "divider",
            cursor: "pointer",
            bgcolor: colors.bg,
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <MdOutlineUploadFile size={32} color={colors.primary} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {report ? report.name : "Click to choose a file"}
          </Typography>
          <input type="file" onChange={handleFileChange} hidden />
        </Box>

        <Button variant="contained" size="large" fullWidth sx={{ mt: 3 }} onClick={uploadReport} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Upload"}
        </Button>
      </Paper>
    </Container>
  );
};

export default UploadReport;
