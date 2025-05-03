import React from 'react';
import { useLayers } from '../../contexts/LayersContext';
import { Eye, AlertCircle, Loader } from 'lucide-react';

const Preview: React.FC = () => {
  const { previewImages, generateCollection, isGenerating, layers, collectionConfig } = useLayers();
  
  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <Loader className="h-12 w-12 animate-spin mx-auto text-primary-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Génération de Votre Collection</h3>
        <p className="text-gray-300">
          Cela peut prendre un moment. Nous créons {collectionConfig.size} NFTs uniques à partir de vos couches...
        </p>
      </div>
    );
  }
  
  if (layers.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Aucune Couche Ajoutée</h3>
        <p className="text-gray-300 mb-4">
          Vous devez ajouter au moins une couche avant de générer un aperçu.
        </p>
        <button
          className="btn-outline"
          onClick={() => window.location.hash = '#/layers'}
        >
          Ajouter des Couches
        </button>
      </div>
    );
  }
  
  if (previewImages.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Aucun Aperçu Disponible</h3>
        <p className="text-gray-300 mb-4">
          Générez votre collection pour voir un aperçu de vos NFTs.
        </p>
        <button
          className="btn-primary"
          onClick={() => generateCollection()}
          disabled={isGenerating}
        >
          Générer l'Aperçu
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Aperçu de la Collection Générée</h2>
        <button
          className="btn-primary text-sm"
          onClick={() => generateCollection()}
          disabled={isGenerating}
        >
          Régénérer
        </button>
      </div>
      
      <p className="text-gray-300 mb-6">
        Affichage de {previewImages.length} sur {collectionConfig.size} NFTs générés
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {previewImages.map((image, index) => (
          <div key={index} className="card overflow-hidden bg-forge-light">
            <img
              src={image}
              alt={`NFT Généré #${index + 1}`}
              className="w-full aspect-square object-cover"
            />
            <div className="p-2 text-center">
              <p className="text-sm font-medium">#{index + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preview;