import React, { useState } from 'react';
import { useLayers } from '../../contexts/LayersContext';
import { Settings, Zap, Info } from 'lucide-react';
import { generateNFTs } from '../../utils/nftGenerator';
import { saveAs } from 'file-saver';

const CollectionConfig: React.FC = () => {
  const { collectionConfig, updateCollectionConfig, isGenerating, layers } = useLayers();
  const [generating, setGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      updateCollectionConfig({ [name]: checked });
    } else if (type === 'number') {
      updateCollectionConfig({ [name]: parseInt(value) || 0 });
    } else {
      updateCollectionConfig({ [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const { zip } = await generateNFTs(layers, {
        ...collectionConfig,
        numberOfNFTs: collectionConfig.size, // 👈 TRÈS important !
      });      
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${collectionConfig.name.replace(/\s+/g, '_')}_nft_collection.zip`);
    } catch (err) {
      console.error("Erreur lors de la génération :", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Collection Configuration</h2>
        <Settings className="h-6 w-6 text-primary-500" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={collectionConfig.name}
                onChange={handleChange}
                className="input"
                placeholder="My Amazing Collection"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Collection Description
              </label>
              <textarea
                id="description"
                name="description"
                value={collectionConfig.description}
                onChange={handleChange}
                className="input resize-none h-24"
                placeholder="Describe your unique collection..."
              />
            </div>

            <div>
              <label htmlFor="inputMode" className="block text-sm font-medium text-gray-300 mb-1">
                Input Mode
              </label>
              <select
                id="inputMode"
                name="inputMode"
                value={collectionConfig.inputMode}
                onChange={handleChange}
                className="input"
              >
                <option value="file">File Mode (10 files × 50 layers)</option>
                <option value="manual">Manual Mode (500 layers total)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                File mode allows uploading 10 files with up to 50 layers each.
                Manual mode allows up to 500 individual layers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-1">
                Collection Size (1-10000)
              </label>
              <input
                type="number"
                id="size"
                name="size"
                value={collectionConfig.size}
                onChange={handleChange}
                className="input"
                min="1"
                max="10000"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Number of unique NFTs to generate
              </p>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="includeRarity"
                name="includeRarity"
                checked={collectionConfig.includeRarity}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 bg-forge-dark"
              />
              <label htmlFor="includeRarity" className="ml-2 block text-sm text-gray-300">
                Include rarity data in metadata
              </label>
            </div>
          </div>
        </div>

        <div className="card p-4 bg-forge-light border border-gray-600">
          <h3 className="font-medium mb-2">Generation Summary</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>Mode: {collectionConfig.inputMode === 'file' ? 'File Upload (10×50)' : 'Manual Entry (500)'}</li>
            <li>Layers: {layers.length} of {collectionConfig.inputMode === 'file' ? '10 files' : '500 layers'}</li>
            <li>Collection Size: {collectionConfig.size} NFTs</li>
            <li>Metadata: {collectionConfig.includeRarity ? 'With rarity attributes' : 'Basic attributes only'}</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-accent flex items-center"
            disabled={generating || layers.length === 0}
          >
            {generating ? (
              <>
                <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Lancer la génération complète
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectionConfig;
