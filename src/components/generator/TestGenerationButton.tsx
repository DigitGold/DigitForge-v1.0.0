import React from 'react';
import { useLayers } from '../../contexts/LayersContext';
import { generateNFTs } from '../../utils/nftGenerator';
import JSZip from 'jszip';

const TestGenerationButton: React.FC = () => {
  const { layers } = useLayers(); // Récupérer tous les layers présents dans le contexte

  const handleTestGeneration = async () => {
    try {
      console.log("Layers utilisés pour génération :", layers);

      const { zip } = await generateNFTs(layers, {
        width: 600,
        height: 1000,
        numberOfNFTs: 5, // Générer 5 NFTs pour test
        includeMetadata: true,
        previewMode: true,
        enforceUniqueness: true,
        outputStructure: 'flat',
        randomizeLayerOrder: false,
        editionMode: false
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'digitforge_nfts.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur lors de la génération :", error);
    }
  };

  return (
    <div className="card p-6 mt-6 space-y-4">
      <button onClick={handleTestGeneration} className="btn-primary w-full">
        Tester Génération NFTs (5 exemplaires)
      </button>
    </div>
  );
};

export default TestGenerationButton;
