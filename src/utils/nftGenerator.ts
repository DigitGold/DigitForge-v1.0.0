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
  const metadataFolder = options.includeMetadata ? zip.folder(options.outputStructure === 'separated' ? 'metadata' : '') : null;

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

  const slugifyImageName = (item: LayerItem): string => {
    try {
      const url = new URL(item.image);
      const base = url.pathname.split('/').pop()?.replace(/\.[^/.]+$/, '') || item.id;
      return base.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
    } catch {
      return item.id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
    }
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

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  const numberOfNFTs = options.previewMode ? Math.min(5, options.numberOfNFTs) : options.numberOfNFTs;

  for (let i = 0; i < numberOfNFTs; i++) {
    let combination = generateCombination();
    const compactName = combination.map(slugifyImageName).join('-');
    const dnaRaw = combination.map(item => item.id).join('');

    if (options.enforceUniqueness) {
      while (existingCombinations.includes(dnaRaw)) {
        combination = generateCombination();
      }
      existingCombinations.push(dnaRaw);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const item of combination) {
      const img = await loadImage(item.image);
      if (img) ctx.drawImage(img, 0, 0, width, height);
    }

    const blob = await new Promise<Blob>(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'));
    if (!blob) throw new Error("Erreur : canvas.toBlob() a échoué");

    const arrayBuffer = await blob.arrayBuffer();
    imageFolder?.file(`${compactName}.png`, arrayBuffer);

    if (metadataFolder) {
      const attributes = layers.map((layer, index) => ({
        trait_type: layer.name,
        value: slugifyImageName(combination[index])
      }));

      const metadata = {
        name: compactName,
        description: 'Une collection DigitForge NFT',
        image: "ipfs://TO_BE_FILLED",
        dna: compactName,
        raw_dna: dnaRaw,
        edition: options.editionMode ? "Collector" : "Standard",
        attributes
      };

      metadataFolder.file(`${compactName}.json`, JSON.stringify(metadata, null, 2));
    }

    layers.forEach((layer, index) => {
      const traitName = layer.name;
      const value = combination[index].id;
      rarityReport[traitName] = rarityReport[traitName] || {};
      rarityReport[traitName][value] = (rarityReport[traitName][value] || 0) + 1;
    });
  }

  zip.file('rarity_report.json', JSON.stringify(rarityReport, null, 2));
  return { zip, rarityReport };
}
