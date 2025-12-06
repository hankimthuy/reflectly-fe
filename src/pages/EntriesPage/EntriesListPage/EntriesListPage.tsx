import React, { useState } from 'react';
import './EntriesListPage.scss';

const EntriesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="entries-list">
    </div>
  );
};

export default EntriesPage;