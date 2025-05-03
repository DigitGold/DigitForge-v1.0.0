import React from 'react';
import { useLayers } from '../../contexts/LayersContext';
import { generateNFTs } from '../../utils/nftGenerator';
import JSZip from 'jszip';

const TestGenerationButton: React.FC = () => {
  const { layers } = useLayers(); // Accès au contexte global

  const handleTestGeneration = async () => {
    console.log("🧪 Lancement test génération avec layers :", layers);

    // ⚠️ Validation en amont
    if (!layers.length || layers.some(layer => !layer.items.length)) {
      alert("Aucun layer valide détecté. Veuillez importer des images dans au moins un layer.");
      return;
    }

    try {
      const { zip } = await generateNFTs(layers, {
        width: 600,
        height: 1000,
        numberOfNFTs: 5, // Test rapide
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
      console.error("❌ Erreur lors de la génération :", error);
      alert("Erreur lors de la génération des NFTs. Voir console pour les détails.");
    }
  };

  return (
    <div className="card p-6 mt-6 space-y-4">
      <button onClick={handleTestGeneration} className="btn-primary w-full">
        🔨 Tester la Génération de 5 NFTs
      </button>
    </div>
  );
};

export default TestGenerationButton;
