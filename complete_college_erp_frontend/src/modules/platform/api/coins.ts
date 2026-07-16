// src/api/coins.ts
import { http } from './http';

export interface WalletResponse {
  userId: number;
  userName: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface CoinTransaction {
  id: number;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  contestTitle?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: number;
  userName: string;
  department: string;
  totalCoins: number;
}

export const coinsApi = {
  getWallet: async (): Promise<WalletResponse> => {
    const response = await http.get('/api/coins/wallet');
    return response.data;
  },

  getTransactions: async (): Promise<CoinTransaction[]> => {
    const response = await http.get('/api/coins/transactions');
    return response.data;
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await http.get('/api/coins/leaderboard');
    return response.data;
  },
};