import React, { useState } from 'react';
import { useLayers } from '../../contexts/LayersContext';
import { Download, Archive, FileJson, Image, CheckCircle, XCircle, Folder } from 'lucide-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { generateNFTs } from '../../utils/nftGenerator';

const ExportPanel: React.FC = () => {
  const { collectionConfig, layers } = useLayers();
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async (type: 'zip' | 'folder') => {
    setExporting(true);
    setExportComplete(false);
    setExportError(null);

    try {
      const { zip } = await generateNFTs(layers, collectionConfig);
      const content = await zip.generateAsync({ type: 'blob' });

      const fileName = `${collectionConfig.name.replace(/\s+/g, '-').toLowerCase()}-collection${type === 'folder' ? '-structured' : ''}.zip`;
      saveAs(content, fileName);

      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('An error occurred during export. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Export Collection</h2>
        <Archive className="h-6 w-6 text-primary-500" />
      </div>

      <div className="card p-6 bg-forge-light mb-8">
        <h3 className="text-xl font-semibold mb-4">Export Summary</h3>
        <ul className="space-y-2 text-gray-300 mb-6">
          <li className="flex items-start">
            <Image className="h-5 w-5 mr-2 mt-0.5 text-primary-400" />
            <div>
              <span className="font-medium">{collectionConfig.size} NFT Images</span>
              <p className="text-sm text-gray-400">PNG format, ready for minting</p>
            </div>
          </li>
          <li className="flex items-start">
            <FileJson className="h-5 w-5 mr-2 mt-0.5 text-primary-400" />
            <div>
              <span className="font-medium">Metadata JSON</span>
              <p className="text-sm text-gray-400">
                Complete metadata file with {collectionConfig.includeRarity ? 'rarity attributes' : 'basic attributes'}
              </p>
            </div>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            <p>Choose your preferred export format:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>ZIP: All files in a single archive</li>
              <li>Folder Structure: Organized in images/ and metadata/ folders</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="btn-primary flex items-center justify-center min-w-[200px]"
              onClick={() => handleExport('zip')}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full" />
                  Exporting...
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-5 w-5" />
                  Export as ZIP
                </>
              )}
            </button>
            <button
              className="btn-secondary flex items-center justify-center min-w-[200px]"
              onClick={() => handleExport('folder')}
              disabled={exporting}
            >
              <Folder className="mr-2 h-5 w-5" />
              Export with Folders
            </button>
          </div>
        </div>
      </div>

      {exportComplete && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-300">Export Successful!</p>
            <p className="text-sm text-green-400">
              Your collection has been exported and downloaded.
            </p>
          </div>
        </div>
      )}

      {exportError && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-center">
          <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-300">Export Failed</p>
            <p className="text-sm text-red-400">{exportError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
