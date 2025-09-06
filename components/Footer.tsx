import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gole-sand border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Mzalendo Trust. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;