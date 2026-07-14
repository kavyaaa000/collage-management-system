package com.college.erp.connect.service;

import com.college.erp.connect.dto.*;
import com.college.erp.connect.entity.*;
import com.college.erp.connect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoinService {

    private final CoinWalletRepository walletRepository;
    private final CoinTransactionRepository transactionRepository;
    private final CoUserRepository coUserRepository;

    @Transactional
    public CoinWallet getOrCreateWallet(User user) {
        return walletRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    CoinWallet wallet = CoinWallet.builder()
                            .user(user)
                            .balance(0)
                            .totalEarned(0)
                            .totalSpent(0)
                            .build();
                    return walletRepository.save(wallet);
                });
    }

    @Transactional
    public void addCoins(User user, Integer amount, TransactionType type, String description,
                         Contest contest, MCQSubmission mcqSubmission, CodeSubmission codeSubmission) {
        CoinWallet wallet = getOrCreateWallet(user);

        wallet.setBalance(wallet.getBalance() + amount);
        wallet.setTotalEarned(wallet.getTotalEarned() + amount);
        walletRepository.save(wallet);

        CoinTransaction transaction = CoinTransaction.builder()
                .wallet(wallet)
                .type(type)
                .amount(amount)
                .balanceAfter(wallet.getBalance())
                .description(description)
                .contest(contest)
                .mcqSubmission(mcqSubmission)
                .codeSubmission(codeSubmission)
                .build();
        transactionRepository.save(transaction);
    }

    // ⭐ NEW METHOD - CRITICAL FOR STORE
    @Transactional
    public void deductCoins(User user, Integer amount, TransactionType type, String description) {
        CoinWallet wallet = getOrCreateWallet(user);

        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient coins. Balance: " + wallet.getBalance() + ", Required: " + amount);
        }

        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setTotalSpent(wallet.getTotalSpent() + amount);
        walletRepository.save(wallet);

        CoinTransaction transaction = CoinTransaction.builder()
                .wallet(wallet)
                .type(type)
                .amount(-amount)  // Negative for deduction
                .balanceAfter(wallet.getBalance())
                .description(description)
                .build();
        transactionRepository.save(transaction);
    }

    public WalletResponse getWalletInfo(String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CoinWallet wallet = getOrCreateWallet(user);

        return WalletResponse.builder()
                .userId(user.getId())
                .userName(user.getName())
                .balance(wallet.getBalance())
                .totalEarned(wallet.getTotalEarned())
                .totalSpent(wallet.getTotalSpent())
                .build();
    }

    public List<CoinTransactionResponse> getTransactionHistory(String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CoinTransaction> transactions = transactionRepository
                .findByWalletUserIdOrderByCreatedAtDesc(user.getId());

        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<LeaderboardResponse> getLeaderboard() {
        List<CoinWallet> topWallets = walletRepository.findTopEarners();

        return topWallets.stream()
                .limit(100)
                .map(wallet -> LeaderboardResponse.builder()
                        .userId(wallet.getUser().getId())
                        .userName(wallet.getUser().getName())
                        .department(wallet.getUser().getDepartment().getName())
                        .totalCoins(wallet.getTotalEarned())
                        .build())
                .collect(Collectors.toList());
    }

    private CoinTransactionResponse mapToTransactionResponse(CoinTransaction transaction) {
        return CoinTransactionResponse.builder()
                .id(transaction.getId())
                .type(transaction.getType().name())
                .amount(transaction.getAmount())
                .balanceAfter(transaction.getBalanceAfter())
                .description(transaction.getDescription())
                .contestTitle(transaction.getContest() != null ?
                        transaction.getContest().getTitle() : null)
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}