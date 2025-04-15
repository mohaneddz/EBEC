import { OptimizedTabs } from '@/components/OptimizedTabs';
import { GlareCardDemo } from './Glare-card';
import { ExpandableCardDemo } from './ExpandableCards';
import { useOptimizedFetch } from '@/hooks/useOptimizedFetch';

const tabs = [
  {
    id: 'glare',
    label: 'Featured Events',
    component: 'GlareCardDemo',
  },
  {
    id: 'expandable',
    label: 'All Events',
    component: 'ExpandableCardDemo',
  },
];

export function EventsTabs() {
  const { data: eventsData, loading, error } = useOptimizedFetch('/api/events');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading events: {error}
      </div>
    );
  }

  const components = {
    GlareCardDemo: () => <GlareCardDemo cards={eventsData?.featured || []} />,
    ExpandableCardDemo: () => <ExpandableCardDemo cards={eventsData?.all || []} />,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <OptimizedTabs 
        tabs={tabs.map(tab => ({
          ...tab,
          component: components[tab.component],
        }))} 
      />
    </div>
  );
} 