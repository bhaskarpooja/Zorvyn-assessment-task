package com.finance.controller;

import com.finance.dto.*;
import com.finance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse full() {
        return dashboardService.getFullDashboard();
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse summary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/category-totals")
    public List<CategoryTotalResponse> categoryTotals() {
        return dashboardService.getCategoryTotals();
    }

    @GetMapping("/recent")
    public List<FinancialRecordResponse> recent() {
        return dashboardService.getRecentTransactions();
    }

    @GetMapping("/monthly")
    public List<MonthlySummaryResponse> monthly() {
        return dashboardService.getMonthlySummary();
    }
}
