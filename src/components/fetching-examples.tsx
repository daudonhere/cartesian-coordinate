import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Mock API
const fetchMockData = async (shouldFail = false) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay
  if (shouldFail && Math.random() > 0.5) throw new Error("Random API Error");
  return { 
    id: Math.floor(Math.random() * 1000), 
    message: "Fetched Successfully", 
    timestamp: new Date().toLocaleTimeString() 
  };
};

// 1. useEffect Fetching
export function UseEffectFetching() {
  const [data, setData] = useState<{ message: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockData()
      .then(res => setData(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <p className="text-xs text-muted-foreground">Auto-fetches on mount</p>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <div className="text-center">
          <p className="font-medium text-sm">{data?.message}</p>
          <p className="text-xs text-muted-foreground">{data?.timestamp}</p>
        </div>
      )}
    </div>
  );
}

// 2. Event-Based Fetching
export function EventFetching() {
  const [data, setData] = useState<{ message: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    setData(null);
    fetchMockData()
      .then(res => setData(res))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <Button size="sm" onClick={handleFetch} disabled={loading}>
        {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
        {loading ? "Fetching..." : "Click to Fetch"}
      </Button>
      {data && (
        <div className="text-center animate-in fade-in slide-in-from-top-1">
          <p className="font-medium text-sm">{data.message}</p>
          <p className="text-xs text-muted-foreground">{data.timestamp}</p>
        </div>
      )}
    </div>
  );
}

// 3. React Query Fetching
export function ReactQueryFetching() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['mockData'],
    queryFn: () => fetchMockData(true), // Allow random failures for demo
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
        Refetch
      </Button>
      
      {isLoading ? (
         <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : isError ? (
        <p className="text-xs text-destructive font-medium">Error loading data</p>
      ) : (
        <div className="text-center animate-in fade-in">
          <p className="font-medium text-sm">{data?.message}</p>
          <p className="text-xs text-muted-foreground">{data?.timestamp}</p>
        </div>
      )}
    </div>
  );
}
