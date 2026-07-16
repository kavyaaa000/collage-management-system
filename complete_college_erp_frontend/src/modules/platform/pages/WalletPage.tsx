// src/pages/WalletPage.tsx - ENHANCED VERSION
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
  Avatar,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  EmojiEvents,
  Code as CodeIcon,
  Quiz as QuizIcon,
  Stars,
} from '@mui/icons-material';
import { coinsApi, WalletResponse, CoinTransaction } from '../api/coins';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

export const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletData, transactionsData] = await Promise.all([
        coinsApi.getWallet(),
        coinsApi.getTransactions(),
      ]);
      setWallet(walletData);
      setTransactions(transactionsData);
      setError('');
    } catch (err: any) {
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionColor = (type: string) => {
    if (type.includes('REWARD') || type.includes('BONUS') || type.includes('GRANT')) {
      return 'success';
    }
    return 'error';
  };

  const getTransactionIcon = (type: string) => {
    if (type.includes('MCQ')) {
      return <QuizIcon fontSize="small" />;
    } else if (type.includes('CODE')) {
      return <CodeIcon fontSize="small" />;
    }
    return <EmojiEvents fontSize="small" />;
  };

  // Calculate statistics
  const mcqTransactions = transactions.filter(tx => tx.type.includes('MCQ'));
  const codeTransactions = transactions.filter(tx => tx.type.includes('CODE'));
  const mcqEarnings = mcqTransactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);
  const codeEarnings = codeTransactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);

  // Group transactions by type
  const filteredTransactions = tabValue === 0 
    ? transactions 
    : tabValue === 1 
    ? mcqTransactions 
    : codeTransactions;

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>
            Loading wallet...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalanceWallet sx={{ mr: 2, fontSize: 40 }} />
          Sara Coins Wallet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your earnings and spending across all contests
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Main Balance Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={6}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 56, height: 56 }}>
                  <AccountBalanceWallet sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Current Balance
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {wallet?.balance || 0}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Sara Coins available to spend
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%', borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.lighter', color: 'success.main', mr: 2, width: 56, height: 56 }}>
                  <TrendingUp sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Earned
                  </Typography>
                  <Typography variant="h3" color="success.main" fontWeight="bold">
                    {wallet?.totalEarned || 0}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                All-time earnings from contests
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%', borderLeft: 4, borderColor: 'error.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.lighter', color: 'error.main', mr: 2, width: 56, height: 56 }}>
                  <TrendingDown sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                  <Typography variant="h3" color="error.main" fontWeight="bold">
                    {wallet?.totalSpent || 0}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                All-time spending on rewards
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Earnings Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuizIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">MCQ Earnings</Typography>
              </Box>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {mcqEarnings}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {mcqTransactions.length} MCQ rewards earned
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(mcqEarnings / (wallet?.totalEarned || 1)) * 100}
                sx={{ mt: 2, height: 8, borderRadius: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Code Earnings</Typography>
              </Box>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {codeEarnings}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {codeTransactions.length} code challenges rewarded
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(codeEarnings / (wallet?.totalEarned || 1)) * 100}
                color="secondary"
                sx={{ mt: 2, height: 8, borderRadius: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction History */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Stars sx={{ mr: 1, color: 'warning.main' }} />
          Transaction History
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label={`All (${transactions.length})`} />
            <Tab 
              label={`MCQ (${mcqTransactions.length})`}
              icon={<QuizIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab 
              label={`Code (${codeTransactions.length})`}
              icon={<CodeIcon fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {filteredTransactions.length === 0 ? (
          <Alert severity="info" icon={<EmojiEvents />}>
            {tabValue === 0 
              ? "No transactions yet. Participate in contests to earn coins!"
              : tabValue === 1
              ? "No MCQ rewards yet. Start solving MCQ questions!"
              : "No code rewards yet. Start solving coding problems!"
            }
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Balance After</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((tx, index) => (
                  <TableRow 
                    key={tx.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      bgcolor: index % 2 === 0 ? 'background.paper' : 'action.hover'
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getTransactionIcon(tx.type)}
                        label={tx.type.replace(/_/g, ' ')}
                        color={getTransactionColor(tx.type) as any}
                        size="small"
                        variant={tx.amount > 0 ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {tx.description}
                      </Typography>
                      {tx.contestTitle && (
                        <Typography variant="caption" color="text.secondary">
                          Contest: {tx.contestTitle}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${tx.amount > 0 ? '+' : ''}${tx.amount}`}
                        color={tx.amount > 0 ? 'success' : 'error'}
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: 80
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {tx.balanceAfter}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredTransactions.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Total Transactions
                </Typography>
                <Typography variant="h6">
                  {filteredTransactions.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Total Credits
                </Typography>
                <Typography variant="h6" color="success.main">
                  +{filteredTransactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Total Debits
                </Typography>
                <Typography variant="h6" color="error.main">
                  {filteredTransactions.reduce((sum, tx) => sum + (tx.amount < 0 ? tx.amount : 0), 0)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};  