import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import { requestAPI } from "../api/endpoints";

const STATUS_CHIP_COLOR = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

const TYPE_LABELS = {
  LEAVE: "Nghỉ phép",
  BUSINESS_TRIP: "Công tác",
  REMOTE: "Làm việc từ xa",
  EARLY_CHECKOUT: "Rời sớm",
  LATE_CHECKIN: "Đi muộn",
};

const formatType = (type) =>
  TYPE_LABELS[type] || (type || "").replace(/_/g, " ");

export function ManagerView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [managerNote, setManagerNote] = useState("");
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await requestAPI.getPendingRequests();
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Tải danh sách yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setManagerNote("");
    setOpenDialog(true);
  };

  const handleAction = async () => {
    if (!managerNote.trim()) {
      setError("Vui lòng nhập ghi chú quản lý");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      if (actionType === "approve") {
        await requestAPI.approve(selectedRequest.id, managerNote);
        setSuccess("Duyệt yêu cầu thành công!");
      } else if (actionType === "reject") {
        await requestAPI.reject(selectedRequest.id, managerNote);
        setSuccess("Từ chối yêu cầu thành công!");
      }

      setOpenDialog(false);
      setManagerNote("");
      setSelectedRequest(null);
      setActionType(null);
      fetchPendingRequests();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Xử lý yêu cầu thất bại");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Alerts */}
      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      {success && (
        <Grid item xs={12}>
          <Alert severity="success">{success}</Alert>
        </Grid>
      )}

      {/* Pending Requests Table */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Yêu cầu chờ duyệt"
            subheader={`${requests.length} yêu cầu đang chờ`}
          />
          <CardContent>
            {loading ? (
              <Box className="flex justify-center py-8">
                <CircularProgress />
              </Box>
            ) : requests.length === 0 ? (
              <Typography sx={{ color: "#6b7280", textAlign: "center", py: 4 }}>
                Không có yêu cầu nào đang chờ
              </Typography>
            ) : (
              <TableContainer component={Paper} className="rounded-lg">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableCell className="font-bold">Người tạo</TableCell>
                      <TableCell className="font-bold">Loại</TableCell>
                      <TableCell className="font-bold">Thời gian</TableCell>
                      <TableCell className="font-bold">Lý do</TableCell>
                      <TableCell className="font-bold">Ngày tạo</TableCell>
                      <TableCell className="font-bold text-center">
                        Hành động
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        <TableCell>{request.employeeEmail}</TableCell>
                        <TableCell>
                          <Chip
                            label={formatType(request.type)}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(request.fromDate).toLocaleDateString()} -{" "}
                          {new Date(request.toDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm">
                          {request.reason}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(request.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Box className="flex gap-2 justify-center">
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<ApproveIcon />}
                              onClick={() =>
                                handleOpenDialog(request, "approve")
                              }
                              disabled={processing}
                            >
                              Duyệt
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<RejectIcon />}
                              onClick={() =>
                                handleOpenDialog(request, "reject")
                              }
                              disabled={processing}
                            >
                              Từ chối
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Action Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !processing && setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === "approve" ? "Duyệt yêu cầu" : "Từ chối yêu cầu"}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box className="space-y-3 py-4">
              <Box>
                <Typography variant="caption" className="text-gray-600">
                  Employee
                </Typography>
                <Typography variant="body2" className="font-semibold">
                  {selectedRequest.employeeEmail}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Loại
                </Typography>
                <Typography variant="body2">
                  {formatType(selectedRequest.type)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" className="text-gray-600">
                  Period
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
              <TextField
                fullWidth
                label="Ghi chú quản lý *"
                value={managerNote}
                onChange={(e) => setManagerNote(e.target.value)}
                multiline
                rows={4}
                placeholder="Vui lòng nhập ghi chú hoặc nhận xét"
                disabled={processing}
                className="mt-4"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={processing}>
            Hủy
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            disabled={processing}
          >
            {processing
              ? "Đang xử lý..."
              : actionType === "approve"
                ? "Duyệt"
                : "Từ chối"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
