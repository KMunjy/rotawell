'use client';

import { useEffect, useState, useCallback } from 'react';
import { MetricCard } from '@/components/ui/metric-card';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Wallet, Clock, Banknote, Settings, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { NurslyInstantPayRequest, NurslyInstantPaySettings, NurslyShift, InstantPayStatus } from '@/lib/types';

const FEE_PERCENTAGE = 0.025; // 2.5% fee for instant access
const DEFAULT_MAX_PERCENTAGE = 70;

interface ShiftEarning {
  shift: NurslyShift & { org?: { name: string } };
  grossAmount: number;
  netAmount: number;
}

function statusBadgeVariant(status: InstantPayStatus): 'default' | 'success' | 'danger' | 'warning' {
  switch (status) {
    case 'completed': return 'success';
    case 'failed': return 'danger';
    case 'processing': return 'warning';
    default: return 'default';
  }
}

function statusLabel(status: InstantPayStatus): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'processing': return 'Processing';
    case 'completed': return 'Completed';
    case 'failed': return 'Failed';
  }
}

export default function InstantPayPage() {
  const [loading, setLoading] = useState(true);
  const [availableEarnings, setAvailableEarnings] = useState<ShiftEarning[]>([]);
  const [requests, setRequests] = useState<(NurslyInstantPayRequest & { shift?: { title: string } })[]>([]);
  const [settings, setSettings] = useState<NurslyInstantPaySettings | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Cash out state
  const [cashOutAmount, setCashOutAmount] = useState(0);
  const [cashOutStep, setCashOutStep] = useState<'idle' | 'selecting' | 'confirming' | 'submitting' | 'success' | 'error'>('idle');
  const [cashOutError, setCashOutError] = useState<string | null>(null);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    enabled: false,
    preferred_method: 'bank_transfer' as 'bank_transfer' | 'mobile_money',
    account_details: {} as Record<string, string>,
  });

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      // Fetch completed shifts (earned but not yet paid out in regular cycle)
      const { data: shifts } = await supabase
        .from('nursly_shifts')
        .select('*, org:nursly_organisations(name)')
        .eq('filled_by', user.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });

      if (shifts) {
        const earnings: ShiftEarning[] = (shifts as (NurslyShift & { org?: { name: string } })[]).map((shift) => {
          const hours = (new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime()) / (1000 * 60 * 60);
          const grossAmount = shift.rate_per_hour * hours;
          const netAmount = grossAmount * 0.9; // after 10% platform fee
          return { shift, grossAmount, netAmount };
        });
        setAvailableEarnings(earnings);
      }

      // Fetch instant pay requests
      const { data: payRequests } = await supabase
        .from('nursly_instant_pay_requests')
        .select('*, shift:nursly_shifts(title)')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      if (payRequests) {
        setRequests(payRequests as (NurslyInstantPayRequest & { shift?: { title: string } })[]);
      }

      // Fetch or create settings
      const { data: userSettings } = await supabase
        .from('nursly_instant_pay_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userSettings) {
        setSettings(userSettings as NurslyInstantPaySettings);
        setSettingsForm({
          enabled: userSettings.enabled,
          preferred_method: userSettings.preferred_method as 'bank_transfer' | 'mobile_money',
          account_details: (userSettings.account_details || {}) as Record<string, string>,
        });
      }
    } catch {
      // Silently handle — loading state is cleared in finally
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Calculate totals
  const totalAvailable = availableEarnings.reduce((sum, e) => sum + e.netAmount, 0);
  const alreadyAdvanced = requests
    .filter((r) => r.status === 'completed' || r.status === 'processing' || r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const maxPercentage = settings?.max_percentage || DEFAULT_MAX_PERCENTAGE;
  const maxCashOut = Math.max(0, (totalAvailable * maxPercentage / 100) - alreadyAdvanced);
  const fee = cashOutAmount * FEE_PERCENTAGE;

  const displayAvailable = totalAvailable;
  const displayAdvanced = alreadyAdvanced;
  const displayMaxCashOut = maxCashOut;
  const displayRequests = requests;

  const handleCashOut = async () => {
    if (cashOutAmount <= 0 || cashOutAmount > displayMaxCashOut) return;
    setCashOutStep('submitting');
    setCashOutError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCashOutError('You must be logged in.');
        setCashOutStep('error');
        return;
      }

      // Pick the first available shift to link the request to
      const targetShift = availableEarnings[0]?.shift;
      if (!targetShift) {
        setCashOutError('No eligible shifts found for instant pay.');
        setCashOutStep('error');
        return;
      }

      const { error } = await supabase
        .from('nursly_instant_pay_requests')
        .insert({
          user_id: user.id,
          shift_id: targetShift.id,
          amount: cashOutAmount,
          fee: parseFloat(fee.toFixed(2)),
          status: 'pending',
          requested_at: new Date().toISOString(),
        });

      if (error) {
        setCashOutError('Failed to submit request. Please try again.');
        setCashOutStep('error');
      } else {
        setCashOutStep('success');
        fetchData();
      }
    } catch {
      setCashOutError('An unexpected error occurred.');
      setCashOutStep('error');
    }
  };

  const handleSaveSettings = async () => {
    if (!userId) return;
    const supabase = createClient();

    // SECURITY: Never store full account numbers.
    // Only persist the last 4 digits for display purposes.
    // In production, bank details must be handled by a payment processor
    // (e.g. Stripe Connect or GoCardless) — never stored in the application DB.
    const safeAccountDetails = { ...settingsForm.account_details };
    if (safeAccountDetails.account_number) {
      safeAccountDetails.account_number_last4 = safeAccountDetails.account_number.slice(-4);
      delete safeAccountDetails.account_number;
    }

    const payload = {
      user_id: userId,
      enabled: settingsForm.enabled,
      preferred_method: settingsForm.preferred_method,
      account_details: safeAccountDetails,
    };

    if (settings) {
      await supabase
        .from('nursly_instant_pay_settings')
        .update(payload)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('nursly_instant_pay_settings')
        .insert(payload);
    }

    setShowSettings(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Instant Pay</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Access your earned wages immediately after completing a shift
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Available balance"
          value={formatCurrency(displayAvailable)}
          icon={<Wallet className="h-8 w-8 text-green-600" />}
        />
        <MetricCard
          label="Max instant cash out"
          value={formatCurrency(displayMaxCashOut)}
          icon={<Zap className="h-8 w-8 text-yellow-500" />}
        />
        <MetricCard
          label="Already advanced"
          value={formatCurrency(displayAdvanced)}
          icon={<Banknote className="h-8 w-8 text-blue-600" />}
        />
        <MetricCard
          label="Instant pay fee"
          value={`${(FEE_PERCENTAGE * 100).toFixed(1)}%`}
          icon={<Clock className="h-8 w-8 text-purple-600" />}
        />
      </div>

      {/* Cash Out Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Cash Out Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {cashOutStep === 'idle' || cashOutStep === 'selecting' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to cash out (max {formatCurrency(displayMaxCashOut)})
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-gray-900">£</span>
                  <input
                    type="number"
                    min={0}
                    max={displayMaxCashOut}
                    step={0.01}
                    value={cashOutAmount || ''}
                    onChange={(e) => setCashOutAmount(Math.min(parseFloat(e.target.value) || 0, displayMaxCashOut))}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="0.00"
                  />
                </div>
                {/* Slider */}
                <input
                  type="range"
                  min={0}
                  max={displayMaxCashOut}
                  step={1}
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>£0</span>
                  <span>{formatCurrency(displayMaxCashOut)}</span>
                </div>
              </div>

              {/* Fee Calculator */}
              {cashOutAmount > 0 && (
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cash out amount</span>
                    <span className="font-medium text-gray-900">{formatCurrency(cashOutAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Instant pay fee ({(FEE_PERCENTAGE * 100).toFixed(1)}%)</span>
                    <span className="font-medium text-red-600">-{formatCurrency(fee)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-medium text-gray-900">You receive</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(cashOutAmount - fee)}</span>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setCashOutStep('confirming')}
                disabled={cashOutAmount <= 0 || cashOutAmount > displayMaxCashOut}
              >
                <Zap className="h-4 w-4" />
                Cash Out {cashOutAmount > 0 ? formatCurrency(cashOutAmount) : 'Now'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                You can access up to {maxPercentage}% of your earned balance instantly.
                The remaining {100 - maxPercentage}% is paid in your regular pay cycle.
              </p>
            </>
          ) : cashOutStep === 'confirming' ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 space-y-4">
              <h3 className="font-semibold text-yellow-900">Confirm Instant Pay</h3>
              <div className="space-y-2 text-sm text-yellow-800">
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="font-semibold">{formatCurrency(cashOutAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee</span>
                  <span className="font-semibold">-{formatCurrency(fee)}</span>
                </div>
                <div className="flex justify-between border-t border-yellow-300 pt-2">
                  <span className="font-semibold">You receive</span>
                  <span className="font-bold">{formatCurrency(cashOutAmount - fee)}</span>
                </div>
              </div>
              <p className="text-xs text-yellow-700">
                This amount will be deducted from your next regular pay run.
              </p>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleCashOut} className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Confirm Cash Out
                </Button>
                <Button variant="outline" onClick={() => setCashOutStep('idle')}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : cashOutStep === 'submitting' ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
              <p className="text-sm text-gray-600">Processing your instant pay request...</p>
            </div>
          ) : cashOutStep === 'success' ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 space-y-3">
              <h3 className="font-semibold text-green-900">Cash Out Submitted!</h3>
              <p className="text-sm text-green-800">
                Your request for {formatCurrency(cashOutAmount)} has been submitted.
                You'll receive {formatCurrency(cashOutAmount - fee)} after the {(FEE_PERCENTAGE * 100).toFixed(1)}% fee.
              </p>
              <p className="text-xs text-green-700">
                Funds typically arrive within minutes for bank transfers.
              </p>
              <Button variant="outline" size="sm" onClick={() => { setCashOutStep('idle'); setCashOutAmount(0); }}>
                Done
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 space-y-3">
              <h3 className="font-semibold text-red-900">Request Failed</h3>
              <p className="text-sm text-red-800">{cashOutError}</p>
              <Button variant="outline" size="sm" onClick={() => setCashOutStep('idle')}>
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Instant Pay Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Enable Instant Pay</p>
                <p className="text-sm text-gray-500">Allow instant access to earned wages</p>
              </div>
              <button
                onClick={() => setSettingsForm({ ...settingsForm, enabled: !settingsForm.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settingsForm.enabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settingsForm.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Preferred payout method</label>
              <select
                value={settingsForm.preferred_method}
                onChange={(e) => setSettingsForm({ ...settingsForm, preferred_method: e.target.value as 'bank_transfer' | 'mobile_money' })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>

            {settingsForm.preferred_method === 'bank_transfer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Bank name</label>
                  <input
                    type="text"
                    value={(settingsForm.account_details.bank_name as string) || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      account_details: { ...settingsForm.account_details, bank_name: e.target.value },
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="e.g., Barclays"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Account number</label>
                  {settingsForm.account_details.account_number_last4 && !settingsForm.account_details.account_number ? (
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
                      ****&nbsp;{settingsForm.account_details.account_number_last4 as string}
                      <button
                        type="button"
                        className="ml-3 text-primary text-xs underline"
                        onClick={() => setSettingsForm({
                          ...settingsForm,
                          account_details: { ...settingsForm.account_details, account_number: '' },
                        })}
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <input
                      type="password"
                      value={(settingsForm.account_details.account_number as string) || ''}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        account_details: { ...settingsForm.account_details, account_number: e.target.value },
                      })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                      placeholder="Enter account number"
                      autoComplete="off"
                    />
                  )}
                  <p className="mt-1 text-xs text-gray-400">Only the last 4 digits are stored. Full details must be entered with a verified payment provider before any transfer is processed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Sort code</label>
                  <input
                    type="text"
                    value={(settingsForm.account_details.sort_code as string) || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      account_details: { ...settingsForm.account_details, sort_code: e.target.value },
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                    placeholder="e.g., 20-30-40"
                  />
                </div>
              </>
            )}

            {settingsForm.preferred_method === 'mobile_money' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Mobile number</label>
                <input
                  type="tel"
                  value={(settingsForm.account_details.mobile_number as string) || ''}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    account_details: { ...settingsForm.account_details, mobile_number: e.target.value },
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  placeholder="e.g., +44 7700 900000"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSaveSettings}>
              Save Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {displayRequests.length > 0 ? (
            <div className="space-y-4">
              {displayRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <p className="font-medium text-gray-900">
                        {req.shift?.title || 'Shift'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(req.requested_at)}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(req.amount)}</p>
                      <p className="text-xs text-gray-500">Fee: {formatCurrency(req.fee)}</p>
                    </div>
                    <Badge variant={statusBadgeVariant(req.status)}>
                      {statusLabel(req.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No instant pay transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">Use the Cash Out button above to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">How Instant Pay works</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Complete a shift and your earnings become available immediately</li>
              <li>Cash out up to {maxPercentage}% of your earned balance at any time</li>
              <li>A small {(FEE_PERCENTAGE * 100).toFixed(1)}% fee is deducted for instant access</li>
              <li>The advanced amount is deducted from your regular pay run</li>
              <li>Funds typically arrive within minutes for bank transfers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
