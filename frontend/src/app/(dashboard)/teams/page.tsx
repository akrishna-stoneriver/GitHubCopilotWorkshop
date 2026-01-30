'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Team {
  name: string;
  city: string;
  conference: 'East' | 'West';
}

const TeamsPage = () => {
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTeams = React.useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return teams;
    }
    return teams.filter((team) => {
      const name = team.name.toLowerCase();
      const city = team.city.toLowerCase();
      return name.includes(normalizedTerm) || city.includes(normalizedTerm);
    });
  }, [teams, searchTerm]);

  const hasSearch = searchTerm.trim().length > 0;

  React.useEffect(() => {
    const abortController = new AbortController();

    const fetchTeams = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090'}/api/teams`;
        const response = await fetch(apiUrl, {
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }

        const data: Team[] = await response.json();
        setTeams(data);
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

    fetchTeams();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
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
          <p className="font-semibold">Error loading teams</p>
          <p className="text-sm">{error}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">NBA Teams</h1>
          <p className="text-gray-600 mt-2">Explore all 30 NBA franchises by conference</p>
        </div>
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search by team or city"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search teams"
          />
        </div>
      </div>
      <Separator className="mb-6" />

      {filteredTeams.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-gray-600">
            {hasSearch ? `No teams match "${searchTerm.trim()}"` : 'No teams available.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.name} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {team.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{team.city}</p>
                  </div>
                  <Badge variant="secondary">{team.conference}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Conference:</span> {team.conference}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
