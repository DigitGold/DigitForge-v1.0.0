import React, { useState } from 'react';
import { useLayers } from '../contexts/LayersContext';
import LayerManager from '../components/generator/LayerManager';
import CollectionConfig from '../components/generator/CollectionConfig';
import Preview from '../components/generator/Preview';
import ExportPanel from '../components/generator/ExportPanel';
import { Layers, Settings, Eye, Download } from 'lucide-react';
import TestGenerationButton from '../components/generator/TestGenerationButton'; // ← Importé proprement ici

const Generator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layers' | 'config' | 'preview' | 'export'>('layers');
  const { previewImages, isGenerating } = useLayers();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Générateur de Collection NFT</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <TabButton 
          isActive={activeTab === 'layers'} 
          onClick={() => setActiveTab('layers')}
          icon={<Layers className="h-5 w-5" />}
          label="Couches"
        />
        <TabButton 
          isActive={activeTab === 'config'} 
          onClick={() => setActiveTab('config')}
          icon={<Settings className="h-5 w-5" />}
          label="Configuration"
        />
        <TabButton 
          isActive={activeTab === 'preview'} 
          onClick={() => setActiveTab('preview')}
          icon={<Eye className="h-5 w-5" />}
          label="Aperçu"
          disabled={isGenerating}
        />
        <TabButton 
          isActive={activeTab === 'export'} 
          onClick={() => setActiveTab('export')}
          icon={<Download className="h-5 w-5" />}
          label="Exporter"
          disabled={previewImages.length === 0 || isGenerating}
        />
      </div>

      <div className="card p-6 space-y-6">
        {activeTab === 'layers' && <LayerManager />}
        {activeTab === 'config' && <CollectionConfig />}
        {activeTab === 'preview' && <Preview />}
        {activeTab === 'export' && <ExportPanel />}

        {/* 👉 Bouton test pour générer les NFTs */}
        <TestGenerationButton />
      </div>
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label, disabled = false }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
        isActive 
          ? 'bg-primary-600 text-white' 
          : disabled 
            ? 'bg-forge-light text-gray-500 cursor-not-allowed' 
            : 'bg-forge-light text-gray-300 hover:text-white'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default Generator;
