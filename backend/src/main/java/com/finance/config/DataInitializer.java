package com.finance.config;

import com.finance.entity.*;
import com.finance.repository.FinancialRecordRepository;
import com.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final FinancialRecordRepository financialRecordRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedUsersAndSampleData() {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }
            userRepository.save(User.builder()
                    .name("System Admin")
                    .email("admin@finance.local")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build());
            userRepository.save(User.builder()
                    .name("Analyst User")
                    .email("analyst@finance.local")
                    .password(passwordEncoder.encode("analyst123"))
                    .role(Role.ANALYST)
                    .status(UserStatus.ACTIVE)
                    .build());
            userRepository.save(User.builder()
                    .name("Viewer User")
                    .email("viewer@finance.local")
                    .password(passwordEncoder.encode("viewer123"))
                    .role(Role.VIEWER)
                    .status(UserStatus.ACTIVE)
                    .build());

            financialRecordRepository.save(FinancialRecord.builder()
                    .amount(new BigDecimal("5000.00"))
                    .type(RecordType.INCOME)
                    .category("Salary")
                    .date(LocalDate.now().withDayOfMonth(1))
                    .description("Monthly salary")
                    .build());
            financialRecordRepository.save(FinancialRecord.builder()
                    .amount(new BigDecimal("120.50"))
                    .type(RecordType.EXPENSE)
                    .category("Utilities")
                    .date(LocalDate.now().minusDays(3))
                    .description("Electric bill")
                    .build());
            financialRecordRepository.save(FinancialRecord.builder()
                    .amount(new BigDecimal("45.00"))
                    .type(RecordType.EXPENSE)
                    .category("Food")
                    .date(LocalDate.now().minusDays(1))
                    .description("Groceries")
                    .build());
            financialRecordRepository.save(FinancialRecord.builder()
                    .amount(new BigDecimal("200.00"))
                    .type(RecordType.INCOME)
                    .category("Freelance")
                    .date(LocalDate.now().minusDays(5))
                    .description("Side project")
                    .build());
        };
    }
}
