package com.finance.repository;

import com.finance.entity.FinancialRecord;
import com.finance.entity.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long>,
        JpaSpecificationExecutor<FinancialRecord> {

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FinancialRecord f WHERE f.type = :type")
    BigDecimal sumAmountByType(@Param("type") RecordType type);

    List<FinancialRecord> findTop5ByOrderByDateDescIdDesc();

    List<FinancialRecord> findByDateGreaterThanEqualOrderByDateAsc(LocalDate from);

    @Query("SELECT f.category, f.type, COALESCE(SUM(f.amount), 0) FROM FinancialRecord f GROUP BY f.category, f.type")
    List<Object[]> sumByCategoryAndType();
}
