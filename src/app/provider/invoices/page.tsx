'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Clock, Download, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const PAYMENT_STORAGE_KEY = 'rotawell_payment_method';

interface PaymentMethod {
  bankName: string;
  accountNumber: string;
  sortCode: string;
}

const defaultPayment: PaymentMethod = {
  bankName: '',
  accountNumber: '',
  sortCode: '',
};

interface Invoice {
  id: string;
  invoice_ref: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  shift_count: number;
  worker_count: number;
  status: 'pending' | 'paid' | 'overdue';
  paid_at: string | null;
  due_date: string | null;
  created_at: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(defaultPayment);
  const [editingPayment, setEditingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentMethod>(defaultPayment);
  const [paymentSaved, setPaymentSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PaymentMethod;
        setPaymentMethod(parsed);
        setPaymentForm(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Get org_id from nursly_org_members
        const { data: orgMember } = await supabase
          .from('nursly_org_members')
          .select('org_id')
          .eq('user_id', user.id)
          .single();

        if (!orgMember?.org_id) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('nursly_invoices')
          .select('*')
          .eq('org_id', orgMember.org_id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setInvoices(data as Invoice[]);
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const totalSpent = invoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.total_amount, 0);
  const averageMonthly = invoices.length > 0 ? Math.round(totalSpent / invoices.length) : 0;

  const handleSavePayment = () => {
    const masked: PaymentMethod = {
      bankName: paymentForm.bankName,
      accountNumber: paymentForm.accountNumber.length > 4
        ? '****' + paymentForm.accountNumber.slice(-4)
        : paymentForm.accountNumber,
      sortCode: paymentForm.sortCode,
    };
    setPaymentMethod(masked);
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(masked));
    setEditingPayment(false);
    setPaymentSaved(true);
    setTimeout(() => setPaymentSaved(false), 2000);
  };

  const handleDownload = (invoice: Invoice) => {
    const period = `${new Date(invoice.period_start).toLocaleDateString('en-GB')} – ${new Date(invoice.period_end).toLocaleDateString('en-GB')}`;
    const invoiceContent = `
INVOICE
========================================

Invoice Ref: ${invoice.invoice_ref}
Period: ${period}
Date issued: ${new Date(invoice.created_at).toLocaleDateString('en-GB')}

Details:
--------
Total Shifts: ${invoice.shift_count}
Workers Used: ${invoice.worker_count}
Amount: ${formatCurrency(invoice.total_amount)}

Payment Status: ${invoice.status === 'paid' && invoice.paid_at
      ? 'Paid on ' + new Date(invoice.paid_at).toLocaleDateString('en-GB')
      : invoice.status === 'overdue'
        ? 'Overdue'
        : 'Pending'}

========================================
Thank you for using Rotawell!
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoice_ref}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusBadgeVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'success';
      case 'overdue': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoices & Billing</h1>
        <p className="mt-2 text-gray-600">View and manage your billing and payments</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total paid</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average monthly</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {invoices.length > 0 ? formatCurrency(averageMonthly) : '—'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total invoices</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No invoices yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Invoices are generated at the end of each billing period once shifts are completed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Period</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Shifts</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{invoice.invoice_ref}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(invoice.period_start)} – {formatDate(invoice.period_end)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{invoice.shift_count}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusBadgeVariant(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(invoice)}
                          className="flex items-center gap-1 ml-auto"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {editingPayment ? (
            <div className="rounded-lg border border-gray-200 p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={paymentForm.bankName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  placeholder="e.g., Barclays"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Account Number</label>
                <input
                  type="password"
                  value={paymentForm.accountNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Sort Code</label>
                <input
                  type="text"
                  value={paymentForm.sortCode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, sortCode: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  placeholder="e.g., 20-30-40"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleSavePayment}>
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingPayment(false);
                  setPaymentForm(paymentMethod);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{paymentMethod.bankName || 'No payment method set'}</p>
                  {paymentMethod.accountNumber && (
                    <p className="mt-1 text-sm text-gray-600">Account ending in {paymentMethod.accountNumber}</p>
                  )}
                  {paymentMethod.sortCode && (
                    <p className="text-xs text-gray-500 mt-1">Sort code: {paymentMethod.sortCode}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Payments are made on the 5th of each month</p>
                </div>
                <div className="flex items-center gap-2">
                  {paymentSaved && (
                    <span className="text-sm font-medium text-green-600">Saved</span>
                  )}
                  <Button variant="outline" size="sm" onClick={() => {
                    setPaymentForm({
                      bankName: paymentMethod.bankName,
                      accountNumber: '',
                      sortCode: paymentMethod.sortCode,
                    });
                    setEditingPayment(true);
                  }}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">
              Your next payment will be processed on <span className="font-semibold">{(() => {
                const now = new Date();
                const next = new Date(now.getFullYear(), now.getMonth() + (now.getDate() >= 5 ? 1 : 0), 5);
                return next.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
              })()}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
