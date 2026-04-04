import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  className,
}: MetricCardProps) {
  const isPositive = change && change > 0;

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <>
                    <ArrowUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      +{change}%
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      {change}%
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          {icon && <div className="flex items-center justify-center">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
