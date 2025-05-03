import JSZip from "jszip";

interface LayerItem {
  id: string;
  image: string;
  weight: number;
}

interface Layer {
  id: string;
  name: string;
  type: 'file' | 'manual';
  items: LayerItem[];
}

interface GenerationOptions {
  width: number;
  height: number;
  numberOfNFTs: number;
  includeMetadata: boolean;
  previewMode: boolean;
  enforceUniqueness: boolean;
  outputStructure: 'flat' | 'separated';
  randomizeLayerOrder: boolean;
  editionMode?: boolean;
}

export async function generateNFTs(
  layers: Layer[],
  options: GenerationOptions
): Promise<{ zip: JSZip, rarityReport: Record<string, Record<string, number>> }> {
  const zip = new JSZip();
  const imageFolder = zip.folder(options.outputStructure === 'separated' ? 'images' : '');
  const metadataFolder = options.includeMetadata
    ? zip.folder(options.outputStructure === 'separated' ? 'metadata' : '')
    : null;

  const width = options.editionMode ? 1200 : options.width;
  const height = options.editionMode ? 2000 : options.height;
  const rarityReport: Record<string, Record<string, number>> = {};
  const existingCombinations: string[] = [];

  const loadImage = async (src: string, timeout = 3000): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const timer = setTimeout(() => {
        console.warn(`⏱️ Timeout image (non bloquant) ➜ ${src}`);
        resolve(null);
      }, timeout);

      img.onload = () => {
        clearTimeout(timer);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timer);
        console.warn(`❌ Échec chargement image (non bloquant) ➜ ${src}`);
        resolve(null);
      };

      img.src = src;
    });
  };

  const generateCombination = () => {
    return layers.map(layer => {
      const totalWeight = layer.items.reduce((acc, item) => acc + item.weight, 0);
      let random = Math.random() * totalWeight;
      for (const item of layer.items) {
        random -= item.weight;
        if (random <= 0) return item;
      }
      return layer.items[layer.items.length - 1];
    });
  };

  const combinationToDNA = (combination: LayerItem[]) => {
    const ids = combination.map(item => (item.id || '').toString().substring(0, 4));
    return {
      formatted: ids.join('-'),
      raw: ids.join('')
    };
  };

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  const numberOfNFTs = options.previewMode
    ? Math.min(5, options.numberOfNFTs)
    : options.numberOfNFTs;

  for (let i = 0; i < numberOfNFTs; i++) {
    console.log(`🎨 Génération NFT ${i + 1}/${numberOfNFTs}`);

    let combination = generateCombination();
    let dna = combinationToDNA(combination);

    if (options.enforceUniqueness) {
      while (existingCombinations.includes(dna.raw)) {
        combination = generateCombination();
        dna = combinationToDNA(combination);
      }
      existingCombinations.push(dna.raw);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const item of combination) {
      console.log("📥 Tentative de chargement image :", item.image);
      const img = await loadImage(item.image);
      if (img) {
        console.log("✅ Image chargée avec succès :", item.image);
        ctx.drawImage(img, 0, 0, width, height);
      } else {
        console.warn("⚠️ Image ignorée (non chargée) :", item.image);
      }
    }

    console.log("🖼️ Canvas prêt ➜ export PNG...");
    const blob = await new Promise<Blob>(resolve =>
      canvas.toBlob(blob => resolve(blob!), 'image/png')
    );

    if (!blob) {
      console.error("❌ Erreur critique : canvas.toBlob() a renvoyé null !");
      throw new Error("Erreur : le canvas n’a pas pu être converti en image PNG.");
    }

    console.log("📦 PNG généré avec succès.");

    const imageName = `${dna.formatted}.png`;
    const arrayBuffer = await blob.arrayBuffer();
    imageFolder?.file(imageName, arrayBuffer);

    if (metadataFolder) {
      const attributes = layers.map((layer, index) => ({
        trait_type: layer.name,
        value: combination[index].id
      }));

      const metadata = {
        name: dna.formatted,
        description: 'Une collection DigitForge NFT',
        image: "ipfs://TO_BE_FILLED",
        dna: dna.formatted,
        raw_dna: dna.raw,
        edition: options.editionMode ? "Collector" : "Standard",
        attributes
      };

      metadataFolder.file(`${dna.formatted}.json`, JSON.stringify(metadata, null, 2));
    }

    layers.forEach((layer, index) => {
      const traitName = layer.name;
      const value = combination[index].id;
      if (!rarityReport[traitName]) {
        rarityReport[traitName] = {};
      }
      if (!rarityReport[traitName][value]) {
        rarityReport[traitName][value] = 0;
      }
      rarityReport[traitName][value]++;
    });
  }

  zip.file('rarity_report.json', JSON.stringify(rarityReport, null, 2));

  return { zip, rarityReport };
}
