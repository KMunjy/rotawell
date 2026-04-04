'use client';

import { useEffect, useState } from 'react';
import { Copy, Share2, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

const rewardTiers = [
  { referrals: 1, reward: 25 },
  { referrals: 5, reward: 150 },
  { referrals: 10, reward: 350 },
];

function generateCodeFromUserId(userId: string): string {
  return 'CARE' + userId.replace(/-/g, '').substring(0, 6).toUpperCase();
}

export default function ReferralsPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState({ signed_up: 0, earned: 0 });

  useEffect(() => {
    const loadReferral = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Try to load existing referral record
        const { data: existing, error: fetchError } = await supabase
          .from('nursly_referrals')
          .select('referral_code')
          .eq('user_id', user.id)
          .single();

        if (existing) {
          setReferralCode(existing.referral_code);
        } else {
          // Generate and persist a new stable code
          const code = generateCodeFromUserId(user.id);
          const { data: inserted, error: insertError } = await supabase
            .from('nursly_referrals')
            .insert({ user_id: user.id, referral_code: code })
            .select('referral_code')
            .single();

          if (insertError) {
            console.error('Failed to create referral:', insertError);
            // Still display generated code even if DB write failed
            setReferralCode(code);
          } else if (inserted) {
            setReferralCode(inserted.referral_code);
          }
        }

        // Load real stats: count users who signed up with this code
        const { data: referralRow } = await supabase
          .from('nursly_referrals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (referralRow) {
          const { count: signedUpCount } = await supabase
            .from('nursly_referral_uses')
            .select('*', { count: 'exact', head: true })
            .eq('referral_id', referralRow.id);

          const { data: paidUses } = await supabase
            .from('nursly_referral_uses')
            .select('reward_amount')
            .eq('referral_id', referralRow.id)
            .eq('reward_paid', true);

          const earned = (paidUses || []).reduce(
            (sum: number, u: any) => sum + (u.reward_amount || 0),
            0
          );

          setStats({ signed_up: signedUpCount || 0, earned });
        }
      } catch (err) {
        console.error('Error loading referral:', err);
        toast('Failed to load referral data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadReferral();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareText = `Join Rotawell and get £25 bonus! Use my code: ${referralCode}`;
    if (navigator.share) {
      navigator.share({ title: 'Rotawell Referral', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      toast('Referral link copied to clipboard', 'success');
    }
  };

  const getTierStatus = (tierReferrals: number) => {
    if (stats.signed_up >= tierReferrals) return 'unlocked';
    if (stats.signed_up > 0 && tierReferrals > stats.signed_up) return 'in_progress';
    return 'locked';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
        <p className="mt-2 text-gray-600">Earn rewards by inviting others to join Rotawell</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600">Your Referral Code</p>
            {loading ? (
              <p className="text-2xl text-gray-400">Loading...</p>
            ) : (
              <p className="text-4xl font-bold text-primary font-mono">{referralCode}</p>
            )}
            <div className="flex gap-2 justify-center">
              <Button
                variant="primary"
                onClick={handleCopy}
                disabled={loading || !referralCode}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={loading || !referralCode}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Signed Up</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{loading ? '—' : stats.signed_up}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Earned</p>
            <p className="mt-2 text-3xl font-bold text-primary">{loading ? '—' : `£${stats.earned}`}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Reward Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rewardTiers.map((tier) => {
              const status = getTierStatus(tier.referrals);
              return (
                <div key={tier.referrals} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{tier.referrals} Referral{tier.referrals > 1 ? 's' : ''}</p>
                    <p className="text-sm text-gray-600">Earn £{tier.reward}</p>
                  </div>
                  {status === 'unlocked' && <Badge variant="success">Unlocked</Badge>}
                  {status === 'in_progress' && <Badge variant="warning">In Progress</Badge>}
                  {status === 'locked' && <Badge variant="secondary">Locked</Badge>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span className="text-gray-600">Share your referral code with friends and colleagues</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span className="text-gray-600">They sign up using your code</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span className="text-gray-600">You both get £25 as a bonus when they complete their first shift</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <span className="text-gray-600">Earn more at each tier milestone</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
