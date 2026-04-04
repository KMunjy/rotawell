'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock, LogIn, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface ClockLocation {
  latitude: number;
  longitude: number;
}

export function ClockInOutComponent() {
  const { toast } = useToast();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [location, setLocation] = useState<ClockLocation | null>(null);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - clockInTime.getTime()) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, clockInTime]);

  const handleClockIn = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setClockInTime(new Date());
          setIsClockedIn(true);
          toast(`Clocked in at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 'success');
        },
        (err) => {
          setError('Unable to get your location. Please check permissions.');
          console.error('Geolocation error:', err);
        }
      );
    } catch (err) {
      setError('Failed to clock in');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockInTime(null);
    setElapsedTime('');
    toast('Clocked out successfully', 'success');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center">
            {isClockedIn ? (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                  <span className="relative inline-flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                  </span>
                  Clocked In
                </div>
                <p className="text-5xl font-bold text-gray-900 font-mono">{elapsedTime}</p>
                <p className="text-sm text-gray-600 mt-2">Time elapsed</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full mb-4">
                  <span className="relative inline-flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-600"></span>
                  </span>
                  Clocked Out
                </div>
                <p className="text-5xl font-bold text-gray-900 font-mono">00:00:00</p>
                <p className="text-sm text-gray-600 mt-2">Ready to clock in</p>
              </>
            )}
          </div>

          {location && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-900">
                <MapPin className="h-4 w-4" />
                <span>
                  Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
                </span>
              </div>
              {clockInTime && (
                <div className="flex items-center gap-2 text-sm text-blue-900">
                  <Clock className="h-4 w-4" />
                  <span>Clocked in at {clockInTime.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-sm text-red-800">{error}</div>
          )}

          <div className="flex gap-2">
            {!isClockedIn ? (
              <Button
                variant="primary"
                onClick={handleClockIn}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <LogIn className="h-5 w-5" />
                Clock In
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={handleClockOut}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Clock Out
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
