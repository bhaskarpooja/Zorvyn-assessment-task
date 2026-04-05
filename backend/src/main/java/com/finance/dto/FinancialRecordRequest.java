package com.finance.dto;

import com.finance.entity.RecordType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FinancialRecordRequest {

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal amount;

    @NotNull
    private RecordType type;

    @NotBlank
    @Size(max = 100)
    private String category;

    @NotNull
    private LocalDate date;

    @Size(max = 2000)
    private String description;
}
