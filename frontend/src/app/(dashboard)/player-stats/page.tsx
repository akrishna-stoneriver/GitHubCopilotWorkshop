'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface PlayerStats {
  name: string;
  team: string;
  points: number;
  rebounds: number;
  assists: number;
}

type SortKey = keyof Pick<PlayerStats, 'name' | 'team' | 'points' | 'rebounds' | 'assists'>;

const PlayerStatsPage = () => {
  const [players, setPlayers] = React.useState<PlayerStats[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sortKey, setSortKey] = React.useState<SortKey>('points');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  React.useEffect(() => {
    const abortController = new AbortController();

    const fetchPlayerStats = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090'}/api/player-stats`;
        const response = await fetch(apiUrl, {
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch player stats');
        }

        const data: PlayerStats[] = await response.json();
        setPlayers(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();

    return () => {
      abortController.abort();
    };
  }, []);

  const sortedPlayers = React.useMemo(() => {
    const sorted = [...players];
    sorted.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });

    return sorted;
  }, [players, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    setSortDirection((current) => (sortKey === key ? (current === 'asc' ? 'desc' : 'asc') : 'desc'));
    setSortKey(key);
  };

  const sortLabel = sortDirection === 'asc' ? '▲' : '▼';

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <p className="font-semibold">Error loading player stats</p>
          <p className="text-sm">{error}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Player Statistics</h1>
        <p className="text-gray-600 mt-2">Top NBA performers with points, rebounds, and assists</p>
      </div>
      <Separator className="mb-6" />

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top 10 Leaders</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedPlayers.length === 0 ? (
            <div className="text-sm text-gray-600">No player stats available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="border-b">
                  <tr className="text-xs uppercase text-gray-500">
                    <th className="px-4 py-3 font-semibold">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('name')}>
                        Player {sortKey === 'name' && sortLabel}
                      </Button>
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('team')}>
                        Team {sortKey === 'team' && sortLabel}
                      </Button>
                    </th>
                    <th className="px-4 py-3 font-semibold text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('points')}>
                        Points {sortKey === 'points' && sortLabel}
                      </Button>
                    </th>
                    <th className="px-4 py-3 font-semibold text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('rebounds')}>
                        Rebounds {sortKey === 'rebounds' && sortLabel}
                      </Button>
                    </th>
                    <th className="px-4 py-3 font-semibold text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('assists')}>
                        Assists {sortKey === 'assists' && sortLabel}
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.map((player) => (
                    <tr key={player.name} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{player.name}</td>
                      <td className="px-4 py-3 text-gray-600">{player.team}</td>
                      <td className="px-4 py-3 text-right">{player.points.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right">{player.rebounds.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right">{player.assists.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerStatsPage;
