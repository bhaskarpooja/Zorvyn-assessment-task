package com.finance.service;

import com.finance.dto.FinancialRecordRequest;
import com.finance.dto.FinancialRecordResponse;
import com.finance.entity.FinancialRecord;
import com.finance.entity.RecordType;
import com.finance.exception.ApiException;
import com.finance.repository.FinancialRecordRepository;
import com.finance.spec.FinancialRecordSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancialRecordService {

    private final FinancialRecordRepository repository;

    public List<FinancialRecordResponse> findAll(
            LocalDate from,
            LocalDate to,
            String category,
            RecordType type) {
        Specification<FinancialRecord> spec = FinancialRecordSpecification.filter(from, to, category, type);
        return repository.findAll(spec).stream().map(this::toResponse).toList();
    }

    public FinancialRecordResponse findById(Long id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Record not found"));
    }

    @Transactional
    public FinancialRecordResponse create(FinancialRecordRequest request) {
        FinancialRecord entity = toEntity(request);
        return toResponse(repository.save(entity));
    }

    @Transactional
    public FinancialRecordResponse update(Long id, FinancialRecordRequest request) {
        FinancialRecord entity = repository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Record not found"));
        entity.setAmount(request.getAmount());
        entity.setType(request.getType());
        entity.setCategory(request.getCategory());
        entity.setDate(request.getDate());
        entity.setDescription(request.getDescription());
        return toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Record not found");
        }
        repository.deleteById(id);
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

    private FinancialRecord toEntity(FinancialRecordRequest r) {
        return FinancialRecord.builder()
                .amount(r.getAmount())
                .type(r.getType())
                .category(r.getCategory())
                .date(r.getDate())
                .description(r.getDescription())
                .build();
    }
}
