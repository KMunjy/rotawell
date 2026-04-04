'use client';

import { Award, Zap, Star, Moon, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const badgeDefinitions = [
  {
    id: 'first_shift',
    name: 'First Shift',
    description: 'Completed your first shift',
    icon: Zap,
    earned: true,
  },
  {
    id: 'five_star',
    name: '5-Star Rated',
    description: 'Received 5-star rating from employer',
    icon: Star,
    earned: true,
  },
  {
    id: 'ten_shifts',
    name: '10 Shifts',
    description: 'Completed 10 shifts',
    icon: Award,
    earned: true,
  },
  {
    id: 'fifty_shifts',
    name: '50 Shifts',
    description: 'Completed 50 shifts',
    icon: Award,
    earned: false,
    progress: 45,
  },
  {
    id: 'hundred_shifts',
    name: '100 Shifts',
    description: 'Completed 100 shifts',
    icon: Award,
    earned: false,
    progress: 45,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Completed 10+ night shifts',
    icon: Moon,
    earned: true,
  },
  {
    id: 'reliability_star',
    name: 'Reliability Star',
    description: '100% attendance on assigned shifts',
    icon: CheckCircle,
    earned: false,
    progress: 85,
  },
  {
    id: 'quick_responder',
    name: 'Quick Responder',
    description: 'Applied within 1 hour of shift posted',
    icon: Clock,
    earned: true,
  },
  {
    id: 'verified_pro',
    name: 'Verified Pro',
    description: 'All documents verified',
    icon: CheckCircle,
    earned: false,
    progress: 75,
  },
];

export function BadgesComponent() {
  const earnedBadges = badgeDefinitions.filter((b) => b.earned);
  const lockedBadges = badgeDefinitions.filter((b) => !b.earned);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Earned Badges ({earnedBadges.length})
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {earnedBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <Card key={badge.id} className="border-green-200 bg-green-50">
                <CardContent className="pt-6 text-center">
                  <Icon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          In Progress ({lockedBadges.length})
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {lockedBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <Card key={badge.id} className="border-gray-200 bg-gray-50">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  {badge.progress && (
                    <div className="mt-3">
                      <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${badge.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{badge.progress}% progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
