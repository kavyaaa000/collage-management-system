// src/pages/AdminStorePage.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Inventory,
  ShoppingCart,
  CheckCircle,
  Cancel,
  Pending,
  AdminPanelSettings,
} from '@mui/icons-material';
import { storeApi, StoreItem, StoreItemRequest, Purchase, PurchaseApprovalRequest } from '../api/store';

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

export const AdminStorePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState<StoreItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Item Dialog
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [itemForm, setItemForm] = useState<StoreItemRequest>({
    name: '',
    description: '',
    category: 'PHYSICAL',
    price: 0,
    stock: 0,
    imageUrl: '',
    isActive: true,
    requiresApproval: false,
  });

  // Approval Dialog
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsData, purchasesData, pendingData] = await Promise.all([
        storeApi.getItems(),
        storeApi.getAllPurchases(),
        storeApi.getPendingPurchases(),
      ]);
      setItems(itemsData);
      setPurchases(purchasesData);
      setPendingPurchases(pendingData);
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Item Management
  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      description: '',
      category: 'PHYSICAL',
      price: 0,
      stock: 0,
      imageUrl: '',
      isActive: true,
      requiresApproval: false,
    });
    setItemDialogOpen(true);
  };

  const handleEditItem = (item: StoreItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      stock: item.stock,
      imageUrl: item.imageUrl || '',
      isActive: item.isActive,
      requiresApproval: item.requiresApproval,
      cooldownHours: item.cooldownHours,
      metadata: item.metadata,
    });
    setItemDialogOpen(true);
  };

  const handleSaveItem = async () => {
    try {
      setError('');
      if (editingItem) {
        await storeApi.updateItem(editingItem.id, itemForm);
      } else {
        await storeApi.createItem(itemForm);
      }
      setItemDialogOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save item');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await storeApi.deleteItem(id);
        await fetchData();
      } catch (err: any) {
        alert('Failed to delete item');
      }
    }
  };

  const handleUpdateStock = async (id: number, currentStock: number) => {
    const newStock = prompt('Enter new stock quantity:', currentStock.toString());
    if (newStock !== null) {
      try {
        await storeApi.updateStock(id, parseInt(newStock));
        await fetchData();
      } catch (err: any) {
        alert('Failed to update stock');
      }
    }
  };

  // Purchase Approval
  const handleApprovalClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setRejectionReason('');
    setApprovalDialogOpen(true);
  };

  const handleApprovePurchase = async (approved: boolean) => {
    if (!selectedPurchase) return;

    try {
      const request: PurchaseApprovalRequest = {
        approved,
        rejectionReason: approved ? undefined : rejectionReason,
      };
      await storeApi.approvePurchase(selectedPurchase.id, request);
      setApprovalDialogOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to process approval');
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, any> = {
      PHYSICAL: 'primary',
      PRIVILEGE: 'secondary',
      POWER_UP: 'warning',
      DIGITAL: 'info',
    };
    return colors[cat] || 'default';
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

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle' }} />
          Store Management
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4">
                {items.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Items
              </Typography>
              <Typography variant="h4" color="success.main">
                {items.filter(i => i.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Purchases
              </Typography>
              <Typography variant="h4" color="primary.main">
                {purchases.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Approvals
              </Typography>
              <Typography variant="h4" color="warning.main">
                {pendingPurchases.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Items Management" icon={<Inventory />} iconPosition="start" />
          <Tab 
            label={
              <Badge badgeContent={pendingPurchases.length} color="warning">
                Pending Approvals
              </Badge>
            }
            icon={<Pending />} 
            iconPosition="start"
          />
          <Tab label="All Purchases" icon={<ShoppingCart />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Items Management Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddItem}>
            Add New Item
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approval Required</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.category} 
                      size="small"
                      color={getCategoryColor(item.category)}
                    />
                  </TableCell>
                  <TableCell align="right">{item.price} 🪙</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => handleUpdateStock(item.id, item.stock)}
                      color={item.stock < 5 ? 'error' : 'primary'}
                    >
                      {item.stock}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.isActive ? 'Active' : 'Inactive'} 
                      color={item.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {item.requiresApproval ? (
                      <Chip label="Yes" size="small" color="warning" />
                    ) : (
                      <Chip label="No" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEditItem(item)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pending Approvals Tab */}
      <TabPanel value={tabValue} index={1}>
        {pendingPurchases.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h6">All caught up!</Typography>
            <Typography color="text.secondary">No pending approvals</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>#{purchase.id}</TableCell>
                    <TableCell>User #{purchase.id}</TableCell>
                    <TableCell>{purchase.itemName}</TableCell>
                    <TableCell align="right">{purchase.quantity}</TableCell>
                    <TableCell align="right">{purchase.totalPrice} 🪙</TableCell>
                    <TableCell>
                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleApprovalClick(purchase)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* All Purchases Tab */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>#{purchase.id}</TableCell>
                  <TableCell>{purchase.itemName}</TableCell>
                  <TableCell>
                    <Chip label={purchase.itemCategory} size="small" />
                  </TableCell>
                  <TableCell align="right">{purchase.quantity}</TableCell>
                  <TableCell align="right">{purchase.totalPrice} 🪙</TableCell>
                  <TableCell>
                    <Chip
                      label={purchase.status}
                      color={getStatusColor(purchase.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(purchase.purchasedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={itemForm.category}
                onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as any })}
              >
                <MenuItem value="PHYSICAL">Physical</MenuItem>
                <MenuItem value="PRIVILEGE">Privilege</MenuItem>
                <MenuItem value="POWER_UP">Power-Up</MenuItem>
                <MenuItem value="DIGITAL">Digital</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price (Coins)"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Stock"
                value={itemForm.stock}
                onChange={(e) => setItemForm({ ...itemForm, stock: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={itemForm.imageUrl}
                onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={itemForm.isActive ? 'active' : 'inactive'}
                onChange={(e) => setItemForm({ ...itemForm, isActive: e.target.value === 'active' })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Requires Approval"
                value={itemForm.requiresApproval ? 'yes' : 'no'}
                onChange={(e) => setItemForm({ ...itemForm, requiresApproval: e.target.value === 'yes' })}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveItem}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Purchase</DialogTitle>
        <DialogContent>
          {selectedPurchase && (
            <Box sx={{ my: 2 }}>
              <Typography><strong>Item:</strong> {selectedPurchase.itemName}</Typography>
              <Typography><strong>Quantity:</strong> {selectedPurchase.quantity}</Typography>
              <Typography><strong>Total:</strong> {selectedPurchase.totalPrice} 🪙</Typography>
              <Typography><strong>Date:</strong> {new Date(selectedPurchase.purchasedAt).toLocaleString()}</Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Rejection Reason (if rejecting)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                sx={{ mt: 3 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<Cancel />}
            onClick={() => handleApprovePurchase(false)}
          >
            Reject
          </Button>
          <Button 
            variant="contained" 
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => handleApprovePurchase(true)}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminStorePage;