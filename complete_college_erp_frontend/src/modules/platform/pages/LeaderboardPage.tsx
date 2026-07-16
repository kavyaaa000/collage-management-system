// src/pages/LeaderboardPage.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import { EmojiEvents, LocalFireDepartment } from '@mui/icons-material';
import { coinsApi, LeaderboardEntry } from '../api/coins';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await coinsApi.getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return '#cd7f32';
    return 'grey';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <EmojiEvents sx={{ color: getRankColor(rank) }} />;
    return null;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocalFireDepartment sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
        <Typography variant="h4">Sara Coins Leaderboard</Typography>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>Rank</TableCell>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Department</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Total Coins</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((entry, index) => (
                <TableRow
                  key={entry.userId}
                  sx={{
                    backgroundColor: index < 3 ? `${getRankColor(index + 1)}11` : 'inherit',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRankIcon(index + 1)}
                      <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                        #{index + 1}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>{entry.userName.charAt(0)}</Avatar>
                      <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                        {entry.userName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={entry.department} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="h6"
                      color="primary"
                      fontWeight={index < 3 ? 'bold' : 'normal'}
                    >
                      {entry.totalCoins}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};