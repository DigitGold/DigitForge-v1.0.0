import React from 'react';

const About = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">À propos de DigitForge</h1>
      <p className="text-white">
        DigitForge est un générateur de NFTs interne conçu pour produire des collections hautement configurables et prêtes pour l'intégration blockchain.
      </p>

      <h2 className="text-2xl font-bold mt-6">🛠️ Guide d'utilisation du Générateur NFT</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>1. Définissez la résolution d'image (600x1000px Standard ou 1200x2000px Collector).</li>
        <li>2. Importez vos layers compressés, nommés par des suites de 4 chiffres uniques.</li>
        <li>3. Configurez les options de génération (nombre de NFTs, unicité, mode édition, etc.).</li>
        <li>4. Lancez la génération !</li>
        <li>5. Téléchargez les images et métadonnées générées.</li>
        <li>6. (Optionnel) Uploadez vos fichiers sur IPFS via Pinata.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-6">📋 Notes importantes</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Chaque NFT possède une clé DNA visible et stockée dans le metadata.</li>
        <li>Le champ "name" des NFTs est exactement la clé DNA formatée avec tirets.</li>
        <li>Un rapport de rareté est automatiquement généré pour analyser les occurrences de traits.</li>
      </ul>
    </div>
  );
};

export default About;
