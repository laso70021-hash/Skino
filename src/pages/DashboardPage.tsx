import React, { useState } from 'react';
import { UserDashboardView } from '../components/UserDashboardView';
import { SendDigestModal } from '../components/SendDigestModal';

export const DashboardPage: React.FC = () => {
  const [isDigestOpen, setIsDigestOpen] = useState(false);

  return (
    <div className="w-full">
      <UserDashboardView onOpenDigestModal={() => setIsDigestOpen(true)} />
      <SendDigestModal isOpen={isDigestOpen} onClose={() => setIsDigestOpen(false)} />
    </div>
  );
};
