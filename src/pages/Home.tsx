import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Download, Palette, Zap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 text-transparent bg-clip-text">
          Crée tes Collections NFT DigitGold
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Bienvenue dans ton outil de création NFT DigitGold Invest. Tu peux maintenant générer et personnaliser 
          tes collections en quelques clics. Télécharge tes ressources, configure ta collection et obtiens 
          tes NFTs prêts à être frappés.
        </p>
        <div className="flex justify-center">
          <Link to="/generator" className="btn-primary text-lg py-3 px-8 flex items-center justify-center">
            <Zap className="mr-2 h-5 w-5" />
            Commence à Créer
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Comment utiliser ton générateur</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Layers className="h-10 w-10 text-primary-500" />}
            title="Télécharge tes Couches"
            description="Ajoute jusqu'à 10 dossiers de couches différentes (arrière-plans, accessoires, etc.) au format PNG, GIF ou autres."
          />
          <FeatureCard 
            icon={<Palette className="h-10 w-10 text-accent-500" />}
            title="Configure & Génère"
            description="Définis la taille de ta collection, personnalise les raretés des couches et génère des combinaisons uniques automatiquement."
          />
          <FeatureCard 
            icon={<Download className="h-10 w-10 text-secondary-500" />}
            title="Exporte & Utilise"
            description="Télécharge ta collection NFT complète avec les images haute qualité et les métadonnées JSON prêtes pour le minting."
          />
        </div>
      </section>

      <section className="text-center py-8">
        <div className="card max-w-3xl mx-auto p-8">
          <h2 className="text-2xl font-bold mb-4">Prêt à créer ta collection ?</h2>
          <p className="text-gray-300 mb-6">
            Lance-toi dans la création de ta collection NFT avec ton générateur DigitGold Invest.
          </p>
          <Link to="/generator" className="btn-accent inline-flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Lancer le Générateur
          </Link>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="card p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default Home;