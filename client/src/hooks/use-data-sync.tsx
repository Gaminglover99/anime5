import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { Anime } from '@shared/schema';

const SYNC_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds

// Define types for sync response data
interface SyncData {
  watchlist: Anime[];
  favorites: Anime[];
  lastSynced: string;
}

interface DataSyncContextType {
  isLoading: boolean;
  lastSynced: Date | null;
  syncNow: () => Promise<any>;
}

// Create context
export const DataSyncContext = createContext<DataSyncContextType | null>(null);

/**
 * Provider component for data synchronization
 */
export function DataSyncProvider({ children }: { children: ReactNode }) {
  const syncData = useDataSyncInternal();
  
  return (
    <DataSyncContext.Provider value={syncData}>
      {children}
    </DataSyncContext.Provider>
  );
}

/**
 * Hook for accessing data sync functionality
 */
export function useDataSync(): DataSyncContextType {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within a DataSyncProvider');
  }
  return context;
}

/**
 * Internal hook for syncing user data between client and server
 * This keeps watchlist, favorites, and watch progress in sync
 */
function useDataSyncInternal(): DataSyncContextType {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const syncIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Only sync data if user is logged in
  const enabled = !!user;

  // Query to fetch all user data in one request
  const { data, error, isLoading, refetch } = useQuery<SyncData>({
    queryKey: ['/api/user-data-sync'],
    enabled,
    refetchOnWindowFocus: true,
    staleTime: SYNC_INTERVAL, // Consider data fresh for the sync interval
  });

  // Set up periodic syncing
  useEffect(() => {
    // Clear any existing interval when component mounts or user changes
    if (syncIntervalRef.current) {
      window.clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }

    // If user is logged in, set up periodic syncing
    if (user) {
      // Initial sync
      refetch();

      // Set up interval for periodic syncing
      syncIntervalRef.current = window.setInterval(() => {
        refetch();
      }, SYNC_INTERVAL);
    }

    // Clean up interval when component unmounts or user changes
    return () => {
      if (syncIntervalRef.current) {
        window.clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [user, refetch]);

  // When sync data is successfully fetched, update the cache for other queries
  useEffect(() => {
    if (data) {
      // Update watchlist in cache with the correct data structure
      queryClient.setQueryData(['/api/watchlist'], { data: data.watchlist });
      
      // Update favorites in cache with the correct data structure
      queryClient.setQueryData(['/api/favorites'], { data: data.favorites });
    }
  }, [data, queryClient]);

  // Handle sync errors
  useEffect(() => {
    if (error) {
      console.error('Data sync error:', error);
      // Only show error toast once, not on every render
      toast({
        title: 'Sync error',
        description: 'Failed to sync your data. Some changes may not be saved.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return {
    isLoading,
    lastSynced: data?.lastSynced ? new Date(data.lastSynced) : null,
    syncNow: refetch,
  };
}