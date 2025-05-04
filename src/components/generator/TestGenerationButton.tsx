import React from 'react';
import { useLayers } from '../../contexts/LayersContext';
import { generateNFTs } from '../../utils/nftGenerator';
import JSZip from 'jszip';

const TestGenerationButton: React.FC = () => {
  const { layers, collectionConfig } = useLayers();

  const handleTestGeneration = async () => {
    if (!layers.length || layers.some(layer => !layer.items.length)) {
      alert("⚠️ Aucun layer valide détecté. Veuillez importer des images dans au moins un layer.");
      return;
    }

    try {
      const { zip } = await generateNFTs(layers, {
        ...collectionConfig,
        previewMode: false // ⚠️ Désactivé définitivement
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
      alert("Erreur lors de la génération des NFTs. Voir la console pour plus de détails.");
    }
  };

  return (
    <div className="card p-6 mt-6 space-y-4">
      <button onClick={handleTestGeneration} className="btn-primary w-full">
        🔨 Générer ma collection ({collectionConfig.size} NFTs)
      </button>
    </div>
  );
};

export default TestGenerationButton;
