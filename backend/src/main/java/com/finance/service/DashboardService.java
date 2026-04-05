package com.finance.service;

import com.finance.dto.*;
import com.finance.entity.FinancialRecord;
import com.finance.entity.RecordType;
import com.finance.repository.FinancialRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FinancialRecordRepository repository;

    public DashboardSummaryResponse getSummary() {
        BigDecimal income = repository.sumAmountByType(RecordType.INCOME);
        BigDecimal expenses = repository.sumAmountByType(RecordType.EXPENSE);
        return DashboardSummaryResponse.builder()
                .totalIncome(income)
                .totalExpenses(expenses)
                .netBalance(income.subtract(expenses))
                .build();
    }

    public List<CategoryTotalResponse> getCategoryTotals() {
        List<Object[]> rows = repository.sumByCategoryAndType();
        List<CategoryTotalResponse> list = new ArrayList<>();
        for (Object[] row : rows) {
            list.add(CategoryTotalResponse.builder()
                    .category((String) row[0])
                    .type((RecordType) row[1])
                    .total((BigDecimal) row[2])
                    .build());
        }
        list.sort(Comparator.comparing(CategoryTotalResponse::getCategory).thenComparing(CategoryTotalResponse::getType));
        return list;
    }

    public List<FinancialRecordResponse> getRecentTransactions() {
        return repository.findTop5ByOrderByDateDescIdDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MonthlySummaryResponse> getMonthlySummary() {
        LocalDate start = LocalDate.now().withDayOfMonth(1).minusMonths(11);
        List<FinancialRecord> records = repository.findByDateGreaterThanEqualOrderByDateAsc(start);
        Map<YearMonth, BigDecimal> income = new TreeMap<>();
        Map<YearMonth, BigDecimal> expense = new TreeMap<>();
        for (FinancialRecord r : records) {
            YearMonth ym = YearMonth.from(r.getDate());
            if (r.getType() == RecordType.INCOME) {
                income.merge(ym, r.getAmount(), BigDecimal::add);
            } else {
                expense.merge(ym, r.getAmount(), BigDecimal::add);
            }
        }
        Set<YearMonth> months = new TreeSet<>();
        months.addAll(income.keySet());
        months.addAll(expense.keySet());
        YearMonth cursor = YearMonth.from(start);
        YearMonth end = YearMonth.from(LocalDate.now());
        while (!cursor.isAfter(end)) {
            months.add(cursor);
            cursor = cursor.plusMonths(1);
        }
        List<MonthlySummaryResponse> out = new ArrayList<>();
        for (YearMonth ym : months) {
            BigDecimal inc = income.getOrDefault(ym, BigDecimal.ZERO);
            BigDecimal exp = expense.getOrDefault(ym, BigDecimal.ZERO);
            out.add(MonthlySummaryResponse.builder()
                    .yearMonth(ym.toString())
                    .income(inc)
                    .expenses(exp)
                    .net(inc.subtract(exp))
                    .build());
        }
        return out;
    }

    public DashboardResponse getFullDashboard() {
        return DashboardResponse.builder()
                .summary(getSummary())
                .categoryTotals(getCategoryTotals())
                .recentTransactions(getRecentTransactions())
                .monthlySummary(getMonthlySummary())
                .build();
    }

    private FinancialRecordResponse toResponse(FinancialRecord e) {
        return FinancialRecordResponse.builder()
                .id(e.getId())
                .amount(e.getAmount())
                .type(e.getType())
                .category(e.getCategory())
                .date(e.getDate())
                .description(e.getDescription())
                .build();
    }
}
