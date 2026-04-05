package com.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private DashboardSummaryResponse summary;
    private List<CategoryTotalResponse> categoryTotals;
    private List<FinancialRecordResponse> recentTransactions;
    private List<MonthlySummaryResponse> monthlySummary;
}
