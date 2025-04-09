
import React from 'react';
import ServerSniperForm from '@/components/ServerSniperForm';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OVH Server Sniper</h1>
          <p className="text-gray-600">Monitor and automatically purchase OVH servers when they become available</p>
        </header>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <ServerSniperForm />
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>OVH Server Sniper &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
