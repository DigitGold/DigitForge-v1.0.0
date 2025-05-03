import React from 'react';
import { useLayers } from '../../contexts/LayersContext';
import { generateNFTs } from '../../utils/nftGenerator';
import JSZip from 'jszip';

const TestGenerationButton: React.FC = () => {
  const { layers } = useLayers(); // 🧠 Important : appel ici pour que `layers` existe

  console.log("✅ useLayers chargé :", typeof useLayers);
  console.log("✅ JSZip chargé :", typeof JSZip);
  console.log("📊 Layers actuels dans le contexte :", layers);

  const handleTestGeneration = async () => {
    console.log("🧪 Lancement test génération avec layers :", layers);

    if (!layers.length || layers.some(layer => !layer.items.length)) {
      alert("⚠️ Aucun layer valide détecté. Veuillez importer des images dans au moins un layer.");
      return;
    }

    try {
      const { zip } = await generateNFTs(layers, {
        width: 600,
        height: 1000,
        numberOfNFTs: 5,
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

      console.log("✅ Génération et téléchargement ZIP terminés.");
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
