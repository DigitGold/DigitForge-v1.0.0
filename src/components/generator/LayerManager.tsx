import React, { useRef, useState } from 'react';
import { useLayers, Layer, LayerItem } from '../../contexts/LayersContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Upload, Trash2, GripVertical, Edit, X, Save, Plus, ChevronDown, ChevronRight, Info, Layers, FolderOpen } from 'lucide-react';

const LayerManager: React.FC = () => {
  const { 
    layers, 
    addLayer, 
    addLayerItem,
    removeLayer, 
    reorderLayers,
    reorderLayerItems,
    updateLayer,
    updateLayerItem,
    toggleLayerExpanded,
    collectionConfig
  } = useLayers();
  
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [dragDisabled, setDragDisabled] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
  
    console.log("📂 Fichiers sélectionnés :", files);
  
    const filesByFolder = new Map<string, File[]>();
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = file.webkitRelativePath;
      const [folderName] = path.split('/');
  
      if (!filesByFolder.has(folderName)) {
        filesByFolder.set(folderName, []);
      }
      filesByFolder.get(folderName)?.push(file);
    }
  
    if (filesByFolder.size > 10) {
      alert('Maximum 10 couches (dossiers) autorisées.');
      return;
    }
  
    for (const [folderName, folderFiles] of filesByFolder.entries()) {
      if (folderFiles.length > 50) {
        alert(`Le dossier "${folderName}" contient plus de 50 fichiers. Seuls les 50 premiers seront utilisés.`);
        folderFiles.length = 50;
      }
  
      const layerId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
      const imageFiles = folderFiles.filter(file =>
        /\.(png|jpe?g|gif|webp)$/i.test(file.name)
      );
  
      if (imageFiles.length === 0) {
        console.warn(`⚠️ Aucun fichier image valide trouvé dans ${folderName}`);
        continue;
      }
  
      const items: LayerItem[] = await Promise.all(
        imageFiles.map(async (file, index) => {
          const url = URL.createObjectURL(file);
          return {
            id: `${layerId}-item-${index}`,
            name: file.name.split('.')[0],
            image: url,
            weight: 100,
            order: index,
            format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          };
        })
      );
  
      const newLayer: Layer = {
        id: layerId,
        name: folderName,
        type: 'file',
        items,
        expanded: true,
      };
  
      console.log("✅ Nouvelle couche prête :", newLayer);
      addLayer(newLayer);
    }
  
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  }; 

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = layers.findIndex(layer => layer.id === active.id);
      const newIndex = layers.findIndex(layer => layer.id === over.id);
      reorderLayers(oldIndex, newIndex);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Gestion des Couches</h2>
          <button
            className="p-1 rounded-full hover:bg-forge-medium text-gray-400 hover:text-primary-400"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            className="btn-primary flex items-center"
            onClick={() => folderInputRef.current?.click()}
            disabled={layers.length >= 10}
          >
            <FolderOpen className="mr-2 h-5 w-5" />
            Sélectionner des Dossiers
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={folderInputRef}
        className="hidden"
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFolderSelect}
      />

      {showInfo && (
        <div className="card p-4 bg-forge-light mb-6 text-sm text-gray-300">
          <h3 className="font-semibold mb-2">Instructions pour les Dossiers :</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Créez un dossier séparé pour chaque couche (max 10 dossiers)</li>
            <li>Chaque dossier peut contenir jusqu'à 50 fichiers</li>
            <li>Formats supportés : PNG, JPG, JPEG, GIF, WEBP</li>
            <li>Le nom du dossier sera utilisé comme nom de la couche</li>
            <li>L'ordre des couches détermine leur superposition dans le NFT final</li>
          </ul>
        </div>
      )}
      
      {layers.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
          <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300 mb-4">
            Sélectionnez jusqu'à 10 dossiers contenant vos images.<br />
            Chaque dossier représente une couche et peut contenir jusqu'à 50 fichiers.
          </p>
          <button 
            className="btn-primary"
            onClick={() => folderInputRef.current?.click()}
          >
            Sélectionner des Dossiers
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="mb-4 p-3 bg-forge-light rounded-lg text-sm text-gray-300">
            <p className="flex items-center">
              <Layers className="h-4 w-4 text-primary-400 mr-2" />
              Ordre de superposition : haut (arrière-plan) → bas (premier plan)
            </p>
          </div>
          <SortableContext
            items={layers.map(layer => layer.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {layers.map((layer, index) => (
                <LayerCard
                  key={layer.id}
                  layer={layer}
                  index={index}
                  onDelete={() => removeLayer(layer.id)}
                  onUpdate={(updates) => updateLayer(layer.id, updates)}
                  onToggleExpand={() => toggleLayerExpanded(layer.id)}
                  onAddItem={(item) => addLayerItem(layer.id, item)}
                  onUpdateItem={(itemId, updates) => updateLayerItem(layer.id, itemId, updates)}
                  onDeleteItem={(itemId) => removeLayer(itemId)}
                  setDragDisabled={setDragDisabled}
                  disabled={dragDisabled}
                  totalLayers={layers.length}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-400">
        <div>
          <p>{layers.length} sur 10 couches ajoutées</p>
          <p>{layers.reduce((sum, layer) => sum + layer.items.length, 0)} fichiers au total</p>
        </div>
        <p>Maximum 50 fichiers par couche</p>
      </div>
    </div>
  );
};

interface LayerCardProps {
  layer: Layer;
  index: number;
  totalLayers: number;
  onDelete: () => void;
  onUpdate: (updates: Partial<Omit<Layer, 'id'>>) => void;
  onToggleExpand: () => void;
  onAddItem: (item: LayerItem) => void;
  onUpdateItem: (itemId: string, updates: Partial<Omit<LayerItem, 'id'>>) => void;
  onDeleteItem: (itemId: string) => void;
  setDragDisabled: (disabled: boolean) => void;
  disabled: boolean;
}

const LayerCard: React.FC<LayerCardProps> = ({ 
  layer, 
  index,
  totalLayers,
  onDelete, 
  onUpdate,
  onToggleExpand,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  setDragDisabled,
  disabled
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(layer.name);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: layer.id, disabled });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setDragDisabled(true);
  };
  
  const handleCancel = () => {
    setTempName(layer.name);
    setIsEditing(false);
    setDragDisabled(false);
  };
  
  const handleSave = () => {
    onUpdate({ name: tempName });
    setIsEditing(false);
    setDragDisabled(false);
  };

  const handleAddItem = () => {
    const newItem: LayerItem = {
      id: `${layer.id}-item-${layer.items.length + 1}`,
      name: `Élément ${layer.items.length + 1}`,
      weight: 100,
      order: layer.items.length
    };
    onAddItem(newItem);
  };

  const getLayerPosition = () => {
    if (index === 0) return "Arrière-plan";
    if (index === totalLayers - 1) return "Premier plan";
    return `Couche ${index + 1}`;
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card bg-forge-light border-l-4 ${
        index === 0 
          ? 'border-gray-600' 
          : index === totalLayers - 1 
            ? 'border-gray-400' 
            : 'border-gray-500'
      }`}
      {...attributes}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 text-gray-400 flex justify-center">
            <button onClick={onToggleExpand}>
              {layer.expanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="w-8 text-gray-400 flex justify-center" {...listeners}>
            <div className="draggable-layer">
              <GripVertical className="h-5 w-5" />
            </div>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="input py-1 px-2"
                autoFocus
              />
            ) : (
              <div>
                <div className="font-medium">{layer.name}</div>
                <div className="text-xs text-gray-400">{getLayerPosition()}</div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1 text-green-400 hover:text-green-300"
                  title="Sauvegarder"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-300"
                  title="Annuler"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="p-1 text-gray-400 hover:text-primary-400"
                  title="Modifier"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 text-gray-400 hover:text-red-400"
                  title="Supprimer"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {layer.expanded && (
        <div className="border-t border-gray-700 p-4">
          <SortableContext
            items={layer.items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {layer.items.map((item, itemIndex) => (
                <LayerItemCard
                  key={item.id}
                  item={item}
                  onUpdate={(updates) => onUpdateItem(item.id, updates)}
                  onDelete={() => onDeleteItem(item.id)}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContext>
          
          {layer.items.length < (layer.type === 'file' ? 50 : 500) && (
            <button
              onClick={handleAddItem}
              className="mt-4 btn-outline text-sm w-full"
            >
              <Plus className="h-4 w-4 mr-1 inline" />
              Ajouter un Élément
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface LayerItemCardProps {
  item: LayerItem;
  onUpdate: (updates: Partial<Omit<LayerItem, 'id'>>) => void;
  onDelete: () => void;
  disabled: boolean;
}

const LayerItemCard: React.FC<LayerItemCardProps> = ({
  item,
  onUpdate,
  onDelete,
  disabled
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(item.name);
  const [tempWeight, setTempWeight] = useState(item.weight.toString());
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, disabled });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
  };
  
  const handleSave = () => {
    const weight = parseInt(tempWeight);
    onUpdate({
      name: tempName,
      weight: isNaN(weight) ? 100 : Math.min(100, Math.max(1, weight))
    });
    setIsEditing(false);
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-forge-medium p-2 rounded"
      {...attributes}
    >
      <div className="text-gray-400" {...listeners}>
        <GripVertical className="h-4 w-4" />
      </div>
      
      {item.image && (
        <div className="h-8 w-8 rounded overflow-hidden bg-forge-dark">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      {isEditing ? (
        <>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="input py-1 px-2 flex-1 text-sm"
          />
          <input
            type="number"
            value={tempWeight}
            onChange={(e) => setTempWeight(e.target.value)}
            className="input py-1 px-2 w-20 text-sm text-center"
            min="1"
            max="100"
          />
          <button
            onClick={handleSave}
            className="p-1 text-green-400 hover:text-green-300"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 text-gray-400 hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 text-sm">{item.name}</div>
          <div className="text-sm text-gray-400">{item.weight}%</div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-primary-400"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default LayerManager;