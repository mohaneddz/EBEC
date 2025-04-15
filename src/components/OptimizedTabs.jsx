import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
  </div>
);

export function OptimizedTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  // Lazy load tab content
  const TabContent = lazy(() => 
    import(`../components/tabs/${tabs[activeTab].component}`).catch(() => ({
      default: () => <div>Error loading content</div>
    }))
  );

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200
              ${activeTab === index
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <TabContent />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 