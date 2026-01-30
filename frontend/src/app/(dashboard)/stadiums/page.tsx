'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface Stadium {
  id: number;
  name: string;
  team: string;
  location: string;
  capacity: number;
  opened: number;
  imageUrl: string;
}

interface StadiumsResponse {
  stadiums: Stadium[];
}

const StadiumsPage = () => {
  const [stadiums, setStadiums] = React.useState<Stadium[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const abortController = new AbortController();
    
    const fetchStadiums = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090'}/api/stadiums`;
        const response = await fetch(apiUrl, {
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch stadium data');
        }
        
        const data: StadiumsResponse = await response.json();
        setStadiums(data.stadiums);
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

    fetchStadiums();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <p className="font-semibold">Error loading stadiums</p>
          <p className="text-sm">{error}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">NBA Stadiums</h1>
        <p className="text-gray-600 mt-2">Explore iconic NBA arenas across the country</p>
      </div>
      <Separator className="mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stadiums.map((stadium) => (
          <Card 
            key={stadium.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-200">
              <img
                src={stadium.imageUrl}
                alt={stadium.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Stadium+Image';
                }}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                {stadium.name}
              </CardTitle>
              <p className="text-sm font-semibold text-blue-600">{stadium.team}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{stadium.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Capacity:</span>
                  <span>{stadium.capacity.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Opened:</span>
                  <span>{stadium.opened}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StadiumsPage;