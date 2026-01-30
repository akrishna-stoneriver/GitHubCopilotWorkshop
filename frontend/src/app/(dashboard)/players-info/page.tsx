'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const PlayersInfoPage = () => {
  const [players, setPlayers] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const abortController = new AbortController();
    
    const fetchPlayers = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090'}/api/player-info`;
        const response = await fetch(apiUrl, {
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch player data');
        }
        const data = await response.json();
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

    fetchPlayers();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Player Information</h1>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <Card key={player.id} className="p-4">
            <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
            <p className="text-sm text-gray-600">Team: {player.team}</p>
            <p className="text-sm text-gray-600">Position: {player.position}</p>
            <p className="text-sm text-gray-600">Height: {player.height}</p>
            <p className="text-sm text-gray-600">Weight: {player.weight}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlayersInfoPage;