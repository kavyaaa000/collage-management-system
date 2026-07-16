// src/pages/MyPurchasesPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Receipt,
  CheckCircle,
  Cancel,
  Pending,
  Download,
  QrCode2,
  ContentCopy,
  ArrowBack,
  Redeem,
} from '@mui/icons-material';
import { storeApi, Purchase } from '../api/store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const MyPurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await storeApi.getMyPurchases();
      setPurchases(data);
    } catch (err: any) {
      setError('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setReceiptDialogOpen(true);
  };

  const handleRedeem = async (purchase: Purchase) => {
    if (purchase.status !== 'APPROVED') {
      alert('This purchase is not approved yet');
      return;
    }

    if (purchase.usedAt) {
      alert('This item has already been redeemed');
      return;
    }

    if (confirm('Redeem this item now? This cannot be undone.')) {
      try {
        await storeApi.redeemItem(purchase.id);
        alert('🎉 Item redeemed successfully!');
        await fetchPurchases();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to redeem item');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
      COMPLETED: 'info',
      USED: 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      PENDING: <Pending />,
      APPROVED: <CheckCircle />,
      REJECTED: <Cancel />,
      COMPLETED: <Receipt />,
      USED: <CheckCircle />,
    };
    return icons[status] || <Receipt />;
  };

  const filteredPurchases = tabValue === 0 
    ? purchases 
    : tabValue === 1 
    ? purchases.filter(p => p.status === 'PENDING')
    : tabValue === 2
    ? purchases.filter(p => p.status === 'APPROVED' && !p.usedAt)
    : purchases.filter(p => p.status === 'USED' || p.status === 'COMPLETED');

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading purchases...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/store')}
        sx={{ mb: 2 }}
      >
        Back to Store
      </Button>

      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Receipt sx={{ mr: 2, fontSize: 40 }} />
        My Purchases
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Purchases
              </Typography>
              <Typography variant="h4">
                {purchases.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {purchases.filter(p => p.status === 'PENDING').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Ready to Redeem
              </Typography>
              <Typography variant="h4" color="success.main">
                {purchases.filter(p => p.status === 'APPROVED' && !p.usedAt).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Spent
              </Typography>
              <Typography variant="h4" color="primary.main">
                {purchases.reduce((sum, p) => sum + p.totalPrice, 0)} 🪙
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label={`All (${purchases.length})`} />
          <Tab label={`Pending (${purchases.filter(p => p.status === 'PENDING').length})`} />
          <Tab label={`Ready (${purchases.filter(p => p.status === 'APPROVED' && !p.usedAt).length})`} />
          <Tab label={`Used (${purchases.filter(p => p.status === 'USED' || p.status === 'COMPLETED').length})`} />
        </Tabs>
      </Paper>

      {/* Purchases Table */}
      {filteredPurchases.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Receipt sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No purchases found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/store')}
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow 
                  key={purchase.id}
                  sx={{ 
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {purchase.itemName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={purchase.itemCategory} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {purchase.quantity}
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">
                      {purchase.totalPrice} 🪙
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(purchase.status)}
                      label={purchase.status}
                      color={getStatusColor(purchase.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewReceipt(purchase)}
                      >
                        Receipt
                      </Button>
                      {purchase.status === 'APPROVED' && !purchase.usedAt && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleRedeem(purchase)}
                          startIcon={<Redeem />}
                        >
                          Redeem
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Receipt Dialog */}
      <Dialog 
        open={receiptDialogOpen} 
        onClose={() => setReceiptDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt />
            Purchase Receipt
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPurchase && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f5f5f5',
                border: '2px dashed #ccc',
              }}
            >
              <Typography variant="h6" gutterBottom align="center">
                Sara Store Receipt
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Receipt #
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedPurchase.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedPurchase.purchasedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 1 }} />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Item
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedPurchase.itemName}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Quantity
                    </Typography>
                    <Typography variant="body2">
                      {selectedPurchase.quantity}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Total Price
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedPurchase.totalPrice} 🪙
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        icon={getStatusIcon(selectedPurchase.status)}
                        label={selectedPurchase.status}
                        color={getStatusColor(selectedPurchase.status)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {selectedPurchase.redemptionCode && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Redemption Code:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="h6" 
                        color="primary"
                        sx={{ 
                          fontFamily: 'monospace',
                          letterSpacing: 2,
                        }}
                      >
                        {selectedPurchase.redemptionCode}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={() => copyToClipboard(selectedPurchase.redemptionCode!)}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                    {selectedPurchase.expiresAt && (
                      <Typography variant="caption" color="text.secondary">
                        Expires: {new Date(selectedPurchase.expiresAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                )}

                {selectedPurchase.status === 'REJECTED' && selectedPurchase.rejectionReason && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Rejection Reason:</Typography>
                    <Typography variant="body2">
                      {selectedPurchase.rejectionReason}
                    </Typography>
                  </Alert>
                )}

                {selectedPurchase.approvedByName && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Approved by: {selectedPurchase.approvedByName}
                    {selectedPurchase.approvedAt && (
                      <> on {new Date(selectedPurchase.approvedAt).toLocaleDateString()}</>
                    )}
                  </Typography>
                )}

                {selectedPurchase.usedAt && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    ✅ Redeemed on {new Date(selectedPurchase.usedAt).toLocaleString()}
                  </Alert>
                )}
              </Box>

              <Typography 
                variant="caption" 
                color="text.secondary" 
                align="center"
                sx={{ display: 'block', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}
              >
                Thank you for shopping at Sara Store! 🎉
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptDialogOpen(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Download />}
            onClick={() => alert('Download feature coming soon!')}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyPurchasesPage;