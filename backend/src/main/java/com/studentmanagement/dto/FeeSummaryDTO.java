package com.studentmanagement.dto;

import java.time.LocalDate;
import java.util.List;

public class FeeSummaryDTO {
    private Double totalFees;
    private Double paidAmount;
    private Double pendingAmount;
    private LocalDate dueDate;
    private String status; // FULLY_PAID, PARTIAL, DUE
    private List<FeePaymentDTO> paymentHistory;

    public FeeSummaryDTO() {}

    public Double getTotalFees() { return totalFees; }
    public void setTotalFees(Double totalFees) { this.totalFees = totalFees; }

    public Double getPaidAmount() { return paidAmount; }
    public void setPaidAmount(Double paidAmount) { this.paidAmount = paidAmount; }

    public Double getPendingAmount() { return pendingAmount; }
    public void setPendingAmount(Double pendingAmount) { this.pendingAmount = pendingAmount; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<FeePaymentDTO> getPaymentHistory() { return paymentHistory; }
    public void setPaymentHistory(List<FeePaymentDTO> paymentHistory) { this.paymentHistory = paymentHistory; }
}
