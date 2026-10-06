import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Download,
  DollarSign,
  ShieldCheck,
  X,
  Sparkles
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function StudentFeesPage() {
  const [feeSummary, setFeeSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI (Demo)');
  const [submitting, setSubmitting] = useState(false);
  const [recentReceipt, setRecentReceipt] = useState(null);
  const { addToast } = useToast();

  const loadFees = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getFees();
      setFeeSummary(data);
      if (data && data.dueAmount > 0) {
        setPayAmount(String(data.dueAmount));
      }
    } catch (err) {
      console.error('Failed to load fees', err);
      addToast('Could not load fee statements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    const amountVal = parseFloat(payAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      addToast('Please enter a valid payment amount', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payment = await smartCampusService.payFee(amountVal, payMethod);
      addToast(`Payment of ₹${amountVal.toLocaleString()} recorded successfully!`, 'success');
      setRecentReceipt(payment);
      setShowPayModal(false);
      // Reload updated summary
      loadFees();
    } catch (err) {
      console.error('Payment error', err);
      addToast('Payment transaction failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Fee Statement & Payment Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Academic tuition breakdown, fee clearance statuses, and simulated demo payments
          </p>
        </div>

        {feeSummary && feeSummary.dueAmount > 0 && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setPayAmount(String(feeSummary.dueAmount));
              setShowPayModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <CreditCard size={16} />
            <span>Pay Due Fees</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {[1, 2, 3, 4].map(k => (
            <div key={k} className="analytics-card" style={{ height: '110px', opacity: 0.6 }} />
          ))}
        </div>
      ) : feeSummary ? (
        <>
          {/* Recent Receipt Banner if just paid */}
          {recentReceipt && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={24} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, color: '#065f46', fontSize: '0.92rem' }}>
                    Transaction Successful! Ref: {recentReceipt.transactionRef}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                    ₹{recentReceipt.amount?.toLocaleString()} processed via {recentReceipt.paymentMethod} on {recentReceipt.paymentDate}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setRecentReceipt(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div className="analytics-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Total Billed Fees</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                ₹{feeSummary.totalFees?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Semester {feeSummary.semester || 5} Academic Assessment
              </div>
            </div>

            <div className="analytics-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Amount Paid</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10b981', marginTop: '0.4rem' }}>
                ₹{feeSummary.paidAmount?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '0.35rem' }}>
                <CheckCircle2 size={13} /> Cleared payments
              </div>
            </div>

            <div className="analytics-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Pending Dues</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: feeSummary.dueAmount > 0 ? '#ef4444' : '#10b981', marginTop: '0.4rem' }}>
                ₹{feeSummary.dueAmount?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: feeSummary.dueAmount > 0 ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '0.35rem' }}>
                {feeSummary.dueAmount > 0 ? (
                  <>
                    <AlertTriangle size={13} /> Due by: {feeSummary.dueDate || '2026-10-30'}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} /> Zero balance outstanding
                  </>
                )}
              </div>
            </div>

            <div className="analytics-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Status</div>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{
                  backgroundColor: feeSummary.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: feeSummary.status === 'PAID' ? '#10b981' : '#ef4444',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}>
                  {feeSummary.status}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
                Student ID: {feeSummary.studentId}
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="analytics-card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Transaction & Payment History
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {feeSummary.history?.length || 0} Records
              </span>
            </div>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction Ref</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(!feeSummary.history || feeSummary.history.length === 0) ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No transactions recorded yet
                      </td>
                    </tr>
                  ) : (
                    feeSummary.history.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.paymentDate}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                          {tx.transactionRef}
                        </td>
                        <td>{tx.paymentMethod}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{tx.amount?.toLocaleString()}
                        </td>
                        <td>
                          <span style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: '#10b981',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {/* Pay Modal */}
      {showPayModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '440px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="#6366f1" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Demo Fee Payment
                </h3>
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => setShowPayModal(false)}
                style={{ padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePay}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Amount to Pay (INR)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={feeSummary?.dueAmount || 100000}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="form-control"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Outstanding balance: ₹{feeSummary?.dueAmount?.toLocaleString()}
                </span>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="form-control"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="UPI (Demo - GPay/PhonePe)">UPI (Demo - GPay / PhonePe / Paytm)</option>
                  <option value="Net Banking (Demo)">Net Banking (HDFC, SBI, ICICI)</option>
                  <option value="Credit/Debit Card (Demo)">Credit / Debit Card</option>
                  <option value="Campus Smart Wallet (Demo)">Campus Smart Wallet</option>
                </select>
              </div>

              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)'
              }}>
                <ShieldCheck size={18} color="#6366f1" />
                <span>Simulated demo payment gateway. No real money will be charged.</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPayModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {submitting ? 'Processing...' : `Confirm Pay ₹${parseFloat(payAmount || 0).toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
