'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/ui/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Wallet, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import type { NurslyShift } from '@/lib/types';

interface ShiftWithOrg extends NurslyShift {
  org?: { name: string };
}

export default function EarningsPage() {
  const [completedShifts, setCompletedShifts] = useState<ShiftWithOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawState, setWithdrawState] = useState<'idle' | 'confirming' | 'submitting' | 'success'>('idle');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('nursly_shifts')
          .select(`
            *,
            org:nursly_organisations(name)
          `)
          .eq('filled_by', user.id)
          .eq('status', 'completed')
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching earnings:', error);
        } else {
          setCompletedShifts((data as ShiftWithOrg[]) || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const earnings = completedShifts.map((shift) => {
    const hours = calculateHours(shift.start_time, shift.end_time);
    const grossAmount = shift.rate_per_hour * hours;
    const platformFee = grossAmount * 0.1;
    const netAmount = grossAmount - platformFee;
    return {
      shift,
      hours,
      grossAmount,
      platformFee,
      netAmount,
    };
  });

  const totalEarned = earnings.reduce((sum, e) => sum + e.netAmount, 0);
  const totalGross = earnings.reduce((sum, e) => sum + e.grossAmount, 0);
  const totalHours = earnings.reduce((sum, e) => sum + e.hours, 0);

  const withdrawableAmount = totalEarned;

  const handleWithdrawConfirm = async () => {
    setWithdrawState('submitting');
    setWithdrawError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setWithdrawError('You must be logged in to withdraw.');
        setWithdrawState('idle');
        return;
      }

      const { error } = await supabase.from('nursly_support_tickets').insert({
        ticket_ref: `WD-${Date.now()}`,
        raised_by: user.id,
        category: 'payment_issue',
        subject: 'Withdrawal request',
        description: `Withdrawal request for ${formatCurrency(withdrawableAmount)}. Requested by user on ${new Date().toISOString()}.`,
        priority: 'p3',
        status: 'open',
      });

      if (error) {
        console.error('Withdraw error:', error);
        setWithdrawError('Failed to submit withdrawal request. Please try again.');
        setWithdrawState('idle');
      } else {
        setWithdrawState('success');
      }
    } catch (err) {
      console.error('Error:', err);
      setWithdrawError('An unexpected error occurred.');
      setWithdrawState('idle');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
        <p className="mt-2 text-gray-600">Track your income and payments</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total earned"
          value={formatCurrency(totalEarned)}
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
        />
        <MetricCard
          label="Total hours worked"
          value={`${Math.round(totalHours)}h`}
          icon={<Clock className="h-8 w-8 text-blue-600" />}
        />
        <MetricCard
          label="Average hourly rate"
          value={totalHours > 0 ? formatCurrency(totalGross / totalHours) : '—'}
          icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
        />
        <MetricCard
          label="Available to withdraw"
          value={formatCurrency(withdrawableAmount)}
          icon={<Wallet className="h-8 w-8 text-orange-600" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings.length > 0 ? (
              earnings.map((earning) => (
                <div key={earning.shift.id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{earning.shift.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(earning.shift.updated_at).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(earning.netAmount)}</p>
                    <p className="text-xs text-green-600">Paid</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No completed shifts yet</p>
                <p className="mt-1 text-sm text-gray-400">Your earnings will appear here once you complete shifts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Gross earnings</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totalGross)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Platform fee (10%)</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totalGross * 0.1)}</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <span className="font-medium text-gray-900">Net earnings</span>
            <span className="text-lg font-semibold text-primary">{formatCurrency(totalEarned)}</span>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
            {withdrawState === 'idle' && (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setWithdrawState('confirming')}
              >
                Withdraw earnings
              </Button>
            )}

            {withdrawState === 'confirming' && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 space-y-3">
                <p className="text-sm text-yellow-800">
                  Are you sure you want to withdraw {formatCurrency(withdrawableAmount)}?
                </p>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleWithdrawConfirm}>
                    Confirm
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setWithdrawState('idle')}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {withdrawState === 'submitting' && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Submitting withdrawal request...</p>
              </div>
            )}

            {withdrawState === 'success' && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-2">
                <p className="text-sm font-medium text-green-800">
                  Withdrawal request submitted successfully!
                </p>
                <p className="text-xs text-green-700">
                  Your request for {formatCurrency(withdrawableAmount)} has been logged. You will be notified once it is processed.
                </p>
                <Button variant="outline" size="sm" onClick={() => setWithdrawState('idle')}>
                  Done
                </Button>
              </div>
            )}

            {withdrawError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-800">{withdrawError}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
