import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LayerItem {
  id: string;
  name: string;
  image?: string;
  weight: number;
  order: number;
  format?: string;
}

export interface Layer {
  id: string;
  name: string;
  type: 'file' | 'manual';
  items: LayerItem[];
  expanded?: boolean;
}

export interface CollectionConfig {
  name: string;
  description: string;
  size: number;
  includeRarity: boolean;
  inputMode: 'file' | 'manual';
}

interface LayersContextType {
  layers: Layer[];
  collectionConfig: CollectionConfig;
  previewImages: string[];
  isGenerating: boolean;
  addLayer: (layer: Layer) => void;
  addLayerItem: (layerId: string, item: LayerItem) => void;
  updateLayer: (id: string, updates: Partial<Omit<Layer, 'id'>>) => void;
  updateLayerItem: (layerId: string, itemId: string, updates: Partial<Omit<LayerItem, 'id'>>) => void;
  removeLayer: (id: string) => void;
  removeLayerItem: (layerId: string, itemId: string) => void;
  reorderLayers: (startIndex: number, endIndex: number) => void;
  reorderLayerItems: (layerId: string, startIndex: number, endIndex: number) => void;
  updateCollectionConfig: (updates: Partial<CollectionConfig>) => void;
  generateCollection: () => Promise<void>;
  clearAllLayers: () => void;
  toggleLayerExpanded: (id: string) => void;
}

const defaultCollectionConfig: CollectionConfig = {
  name: 'Ma Collection NFT',
  description: 'Une collection générée avec DigitForge',
  size: 10,
  includeRarity: true,
  inputMode: 'file'
};

const LayersContext = createContext<LayersContextType | undefined>(undefined);

export const LayersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [collectionConfig, setCollectionConfig] = useState<CollectionConfig>(defaultCollectionConfig);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addLayer = (layer: Layer) => {
    const maxLayers = collectionConfig.inputMode === 'file' ? 10 : 500;
    if (layers.length < maxLayers) {
      setLayers((prevLayers) => [...prevLayers, layer]);
    }
  };

  const addLayerItem = (layerId: string, item: LayerItem) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => {
        if (layer.id === layerId) {
          const maxItems = layer.type === 'file' ? 50 : 500;
          if (layer.items.length < maxItems) {
            return {
              ...layer,
              items: [...layer.items, item]
            };
          }
        }
        return layer;
      })
    );
  };

  const updateLayer = (id: string, updates: Partial<Omit<Layer, 'id'>>) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  };

  const updateLayerItem = (layerId: string, itemId: string, updates: Partial<Omit<LayerItem, 'id'>>) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => {
        if (layer.id === layerId) {
          return {
            ...layer,
            items: layer.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          };
        }
        return layer;
      })
    );
  };

  const removeLayer = (id: string) => {
    setLayers((prevLayers) => prevLayers.filter((layer) => layer.id !== id));
  };

  const removeLayerItem = (layerId: string, itemId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => {
        if (layer.id === layerId) {
          return {
            ...layer,
            items: layer.items.filter((item) => item.id !== itemId)
          };
        }
        return layer;
      })
    );
  };

  const reorderLayers = (startIndex: number, endIndex: number) => {
    const result = Array.from(layers);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setLayers(result);
  };

  const reorderLayerItems = (layerId: string, startIndex: number, endIndex: number) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => {
        if (layer.id === layerId) {
          const items = Array.from(layer.items);
          const [removed] = items.splice(startIndex, 1);
          items.splice(endIndex, 0, removed);
          return { ...layer, items };
        }
        return layer;
      })
    );
  };

  const toggleLayerExpanded = (id: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, expanded: !layer.expanded } : layer
      )
    );
  };

  const updateCollectionConfig = (updates: Partial<CollectionConfig>) => {
    setCollectionConfig((prev) => ({ ...prev, ...updates }));
  };

  const clearAllLayers = () => {
    setLayers([]);
    setPreviewImages([]);
  };

  const generateCollection = async () => {
    if (layers.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      // Dans une implémentation réelle, ceci combinerait les couches pour créer des images uniques
      const mockPreviews = Array(Math.min(5, collectionConfig.size))
        .fill(null)
        .map(() => layers[0].items[0]?.image || '');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPreviewImages(mockPreviews);
    } catch (error) {
      console.error("Erreur lors de la génération de la collection:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const value = {
    layers,
    collectionConfig,
    previewImages,
    isGenerating,
    addLayer,
    addLayerItem,
    updateLayer,
    updateLayerItem,
    removeLayer,
    removeLayerItem,
    reorderLayers,
    reorderLayerItems,
    updateCollectionConfig,
    generateCollection,
    clearAllLayers,
    toggleLayerExpanded,
  };

  return <LayersContext.Provider value={value}>{children}</LayersContext.Provider>;
};

export const useLayers = (): LayersContextType => {
  const context = useContext(LayersContext);
  if (context === undefined) {
    throw new Error('useLayers doit être utilisé à l\'intérieur d\'un LayersProvider');
  }
  return context;
};

export default LayersContext;