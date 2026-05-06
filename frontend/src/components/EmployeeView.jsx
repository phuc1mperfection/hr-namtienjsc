import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { requestAPI } from "../api/endpoints";
const REQUEST_TYPES = [
  "LEAVE",
  "BUSINESS_TRIP",
  "REMOTE",
  "EARLY_CHECKOUT",
  "LATE_CHECKIN",
];

const TYPE_LABELS = {
  LEAVE: "Nghỉ phép",
  BUSINESS_TRIP: "Công tác",
  REMOTE: "Làm việc từ xa",
  EARLY_CHECKOUT: "Rời sớm",
  LATE_CHECKIN: "Đi muộn",
};

const formatType = (type) =>
  TYPE_LABELS[type] || (type || "").replace(/_/g, " ");

const STATUS_CHIP_COLOR = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

export function EmployeeView() {
  const [formData, setFormData] = useState({
    type: "",
    reason: "",
    fromDate: "",
    toDate: "",
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  async function fetchMyRequests() {
    setLoading(true);
    setError("");
    try {
      const response = await requestAPI.getMyRequests();
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Tải yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    const id = setTimeout(() => {
      if (mounted) fetchMyRequests();
    }, 0);
    return () => {
      mounted = false;
      clearTimeout(id);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.type ||
      !formData.reason ||
      !formData.fromDate ||
      !formData.toDate
    ) {
      setError("Vui lòng điền đầy đủ thông tin yêu cầu");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await requestAPI.create(formData);
      setSuccess("Tạo yêu cầu thành công!");
      setFormData({
        type: "",
        reason: "",
        fromDate: "",
        toDate: "",
      });
      fetchMyRequests();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Tạo yêu cầu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Create Request Form */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Tạo yêu cầu mới"
            subheader="Gửi yêu cầu chấm công"
            avatar={<AddIcon />}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" className="mb-4">
                  {success}
                </Alert>
              )}

              <FormControl fullWidth margin="normal">
                <InputLabel>Loại yêu cầu *</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Loại yêu cầu *"
                  disabled={submitting}
                >
                  {REQUEST_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {formatType(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Lý do *"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={3}
                placeholder="Mô tả lý do"
                disabled={submitting}
              />

              <TextField
                fullWidth
                label="Từ ngày *"
                name="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                disabled={submitting}
              />

              <TextField
                fullWidth
                label="Đến ngày *"
                name="toDate"
                type="date"
                value={formData.toDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                disabled={submitting}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                sx={{ mt: 2 }}
                disabled={submitting}
              >
                {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {/* My Requests List */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Yêu cầu của tôi"
            subheader="Lịch sử yêu cầu chấm công"
          />
          <CardContent>
            {loading ? (
              <Box className="flex justify-center py-8">
                <CircularProgress />
              </Box>
            ) : requests.length === 0 ? (
              <Typography sx={{ color: "#6b7280", textAlign: "center", py: 4 }}>
                Chưa có yêu cầu nào. Hãy tạo yêu cầu đầu tiên!
              </Typography>
            ) : (
              <Box className="space-y-3">
                {requests.map((request) => (
                  <Card
                    key={request.id}
                    className="border-l-4 border-gray-300 cursor-pointer hover:shadow-md transition"
                    onClick={() => {
                      setSelectedRequest(request);
                      setOpenDialog(true);
                    }}
                  >
                    <CardContent className="pb-3">
                      <Box className="flex justify-between items-start mb-2">
                        <Typography variant="subtitle2" className="font-bold">
                          {formatType(request.type)}
                        </Typography>
                        <Chip
                          label={request.status}
                          color={STATUS_CHIP_COLOR[request.status] || "default"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        className="text-gray-600 block"
                      >
                        {new Date(request.fromDate).toLocaleDateString()} -{" "}
                        {new Date(request.toDate).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-gray-500 block"
                      >
                        Ngày tạo: {new Date(request.createdAt).toLocaleString()}
                      </Typography>
                      {request.managerNote && (
                        <Typography
                          variant="caption"
                          className="text-gray-700 block mt-2"
                        >
                          <strong>Ghi chú quản lý:</strong>{" "}
                          {request.managerNote}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Request Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết yêu cầu</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box className="space-y-3 py-4">
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Loại
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatType(selectedRequest.type)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Trạng thái
                </Typography>
                <Typography variant="body2">
                  <Chip
                    label={selectedRequest.status}
                    color={STATUS_CHIP_COLOR[selectedRequest.status]}
                  />
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Thời gian
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedRequest.fromDate).toLocaleDateString()} -{" "}
                  {new Date(selectedRequest.toDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Lý do
                </Typography>
                <Typography variant="body2">
                  {selectedRequest.reason}
                </Typography>
              </Box>
              {selectedRequest.managerNote && (
                <Box>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>
                    Ghi chú quản lý
                  </Typography>
                  <Typography variant="body2">
                    {selectedRequest.managerNote}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
