// src/pages/StorePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ShoppingCart,
  Store as StoreIcon,
  Star,
  Inventory,
  EmojiEvents,
  Add,
  Remove,
  Search,
  FilterList,
} from '@mui/icons-material';
import { storeApi, StoreItem } from '../api/store';
import { coinsApi } from '../api/coins';

export const StorePage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>([]);
  const [category, setCategory] = useState('ALL');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Purchase dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [category, searchQuery, items]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsData, walletData] = await Promise.all([
        storeApi.getItems(),
        coinsApi.getWallet(),
      ]);
      setItems(itemsData);
      setBalance(walletData.balance);
    } catch (err: any) {
      setError('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (category !== 'ALL') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleBuyClick = (item: StoreItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setDialogOpen(true);
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;

    try {
      setPurchasing(true);
      setError('');

      await storeApi.purchaseItem({
        itemId: selectedItem.id,
        quantity,
      });

      setDialogOpen(false);
      
      // Show success message
      alert(`🎉 Purchase successful! ${selectedItem.requiresApproval ? 'Awaiting admin approval.' : 'Check your purchases page for redemption code!'}`);
      
      // Refresh data
      await fetchData();
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchasing(false);
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

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, JSX.Element> = {
      PHYSICAL: <Inventory />,
      PRIVILEGE: <Star />,
      POWER_UP: <EmojiEvents />,
      DIGITAL: <StoreIcon />,
    };
    return icons[cat] || <StoreIcon />;
  };

  const categories = [
    { value: 'ALL', label: 'All Items', icon: <StoreIcon /> },
    { value: 'PHYSICAL', label: 'Physical', icon: <Inventory /> },
    { value: 'PRIVILEGE', label: 'Privileges', icon: <Star /> },
    { value: 'POWER_UP', label: 'Power-Ups', icon: <EmojiEvents /> },
    { value: 'DIGITAL', label: 'Digital', icon: <StoreIcon /> },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading store...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            🏪 Sara Store
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Spend your coins on awesome rewards!
          </Typography>
        </Box>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minWidth: 150,
          }}
        >
          <Typography variant="h5" color="white" align="center">
            💰 {balance} Coins
          </Typography>
        </Paper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search & Filter */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<ShoppingCart />}
          onClick={() => navigate('/store/purchases')}
        >
          My Purchases
        </Button>
      </Box>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={category} 
          onChange={(e, v) => setCategory(v)} 
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map(cat => (
            <Tab
              key={cat.value}
              value={cat.value}
              icon={cat.icon}
              label={cat.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <StoreIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No items found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search query
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {item.name}
                    </Typography>
                    <Chip 
                      icon={getCategoryIcon(item.category)}
                      label={item.category}
                      size="small"
                      color={getCategoryColor(item.category)}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {item.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={`${item.price} 🪙`} 
                      color="primary" 
                      sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                    />
                    <Typography 
                      variant="caption" 
                      color={item.stock < 5 ? 'error' : 'text.secondary'}
                      sx={{ fontWeight: item.stock < 5 ? 'bold' : 'normal' }}
                    >
                      {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                    </Typography>
                  </Box>

                  {item.requiresApproval && (
                    <Alert severity="info" sx={{ mt: 1 }} icon={<Star fontSize="small" />}>
                      Requires approval
                    </Alert>
                  )}
                </CardContent>

                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<ShoppingCart />}
                    onClick={() => handleBuyClick(item)}
                    disabled={item.stock === 0 || balance < item.price}
                  >
                    {balance < item.price ? 'Not Enough Coins' : 'Buy Now'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Purchase Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Purchase {selectedItem?.name}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ my: 2 }}>
            <Typography variant="body1" gutterBottom>
              Price per item: <strong>{selectedItem?.price} 🪙</strong>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
              <Typography>Quantity:</Typography>
              <IconButton 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                size="small"
                disabled={quantity <= 1}
              >
                <Remove />
              </IconButton>
              <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton 
                onClick={() => setQuantity(Math.min(selectedItem?.stock || 1, quantity + 1))}
                size="small"
                disabled={quantity >= (selectedItem?.stock || 1)}
              >
                <Add />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                (Max: {selectedItem?.stock})
              </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 2, bgcolor: 'primary.lighter' }}>
              <Typography variant="h6" color="primary">
                Total: {(selectedItem?.price || 0) * quantity} 🪙
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Balance after purchase: {balance - (selectedItem?.price || 0) * quantity} 🪙
              </Typography>
            </Paper>

            {selectedItem?.requiresApproval && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                ⏳ This purchase requires admin approval. You'll be notified once approved!
              </Alert>
            )}

            {selectedItem?.category === 'POWER_UP' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                🚀 Power-up will be activated immediately after purchase!
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={purchasing}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePurchase}
            disabled={
              purchasing || 
              balance < (selectedItem?.price || 0) * quantity ||
              quantity < 1
            }
          >
            {purchasing ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StorePage;