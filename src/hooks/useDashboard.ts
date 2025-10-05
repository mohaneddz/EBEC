// In your useDashboard hook file

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getTotalMembers } from '@/server/leaderboard';

export default function useDashboard() {
  const supabase = createClient(); // normal client

  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [activeMembers, setActiveMembers] = useState<number>(0);
  const [upcomingEvents, setUpcomingEvents] = useState<number>(0);
  const [totalManagers, setTotalManagers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { count, error } = await getTotalMembers();
        if (error) {
          console.error(error);
        } else {
          setTotalMembers(count);
        }

        // Events count
        const { count: eventsCountVal, error: eventsError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
        if (eventsError)
          console.error('Error fetching events count:', eventsError);
        else setEventsCount(eventsCountVal || 0);

        // Registrations sum
        const { data: eventsData, error: registrationsError } = await supabase
          .from('events')
          .select('attendance');
        if (registrationsError) {
          console.error('Error fetching registrations:', registrationsError);
        } else {
          const sum =
            eventsData?.reduce((acc, e) => acc + (e.attendance || 0), 0) || 0;
          setTotalRegistrations(sum);
        }

        // Active Members
        const { count: activeCount, error: activeError } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('active', true);
        if (activeError)
          console.error('Error fetching active members:', activeError);
        else setActiveMembers(activeCount || 0);

        // Upcoming Events
        const { count: upcomingCount, error: upcomingError } = await supabase
          .from('upcoming')
          .select('*', { count: 'exact', head: true });
        if (upcomingError)
          console.error('Error fetching upcoming events:', upcomingError);
        else setUpcomingEvents(upcomingCount || 0);

        // Managers
        const { count: managersCount, error: managersError } = await supabase
          .from('managers')
          .select('*', { count: 'exact', head: true });
        if (managersError)
          console.error('Error fetching total managers:', managersError);
        else setTotalManagers(managersCount || 0);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  return {
    totalMembers,
    eventsCount,
    totalRegistrations,
    activeMembers,
    upcomingEvents,
    totalManagers,
    loading,
  };
}