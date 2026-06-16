import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Maximize, Settings2, Undo2, Redo2, Save, Trash2, 
  LayoutTemplate, Sofa, Square, PaintRoller, Type, Image as ImageIcon 
} from 'lucide-react';
import { BuilderCanvas } from './three/BuilderCanvas';
import { useBuilderStore } from '../stores/useBuilderStore';
import { builderTemplates } from '../lib/builderTemplates';
import { useTranslation } from 'react-i18next';

export const DecorBuilder = ({ isFullScreen = false }: { isFullScreen?: boolean }) => {
  const { t, i18n } = useTranslation();
  const { 
    viewMode, setViewMode, walls, furniture, floors, 
    selectedId, updateWall, updateFurniture, removeWall, removeFurniture, 
    addWall, addFurniture, loadTemplate, clearScene 
  } = useBuilderStore();

  const [leftTab, setLeftTab] = useState<'build' | 'decor' | 'templates'>('templates');

  const selectedObject = 
    walls.find(w => w.id === selectedId) || 
    furniture.find(f => f.id === selectedId) || 
    floors.find(f => f.id === selectedId);
  
  const objectType = walls.some(w => w.id === selectedId) ? 'wall' : 
                     furniture.some(f => f.id === selectedId) ? 'furniture' : 
                     floors.some(f => f.id === selectedId) ? 'floor' : null;

  return (
    <div className={`flex h-screen bg-[#f8f9fa] overflow-hidden font-sans ${isFullScreen ? 'pt-0' : 'pt-16'}`}>
      
      {/* Floating Back to Home button for fullscreen tab */}
      {isFullScreen && (
        <a
          href="/"
          className="absolute top-6 start-6 z-20 flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md border border-gray-250/20 hover:bg-white text-gray-700 hover:text-gray-950 font-semibold text-xs rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
        >
          <span className="rtl:rotate-180">←</span> {
            i18n.language === 'ar' ? 'العودة للرئيسية' : 
            i18n.language === 'fr' ? 'Retour à l\'accueil' : 
            'Back to Home'
          }
        </a>
      )}
      
      {/* LEFT SIDEBAR - Tool Palette */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm relative">
        <div className="flex border-b border-gray-200">
          <button onClick={() => setLeftTab('templates')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${leftTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Templates</button>
          <button onClick={() => setLeftTab('build')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${leftTab === 'build' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Build</button>
          <button onClick={() => setLeftTab('decor')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${leftTab === 'decor' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Decor</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {leftTab === 'templates' && (
            <div className="grid grid-cols-2 gap-3">
              {builderTemplates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => loadTemplate(template.data)}
                  className="group relative rounded-xl overflow-hidden cursor-pointer border border-gray-200 hover:border-primary transition-all aspect-square"
                >
                  <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-medium">{template.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {leftTab === 'build' && (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => addWall({ start: [-2, 0], end: [2, 0], height: 3, thickness: 0.2, color: '#f0f0f0' })}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Square className="w-8 h-8 mb-2 text-gray-600" strokeWidth={1.5} />
                <span className="text-sm text-gray-700">Add Wall</span>
              </button>
            </div>
          )}

          {leftTab === 'decor' && (
            <div className="grid grid-cols-2 gap-3">
              {['sofa', 'table', 'chair', 'lamp', 'bed'].map((type) => (
                <button 
                  key={type}
                  onClick={() => addFurniture({ type, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#d1cbbd' })}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors capitalize"
                >
                  <Sofa className="w-8 h-8 mb-2 text-gray-600" strokeWidth={1.5} />
                  <span className="text-sm text-gray-700">{type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CENTER CANVAS */}
      <div className="flex-1 relative bg-neutral-100">
        
        {/* Top Action Bar */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Undo"><Undo2 className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Redo"><Redo2 className="w-5 h-5" /></button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <div className="flex bg-gray-100 rounded-full p-1">
            <button 
              onClick={() => setViewMode('2d')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${viewMode === '2d' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-900'}`}
            >
              2D Top
            </button>
            <button 
              onClick={() => setViewMode('3d')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${viewMode === '3d' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-900'}`}
            >
              3D View
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button onClick={clearScene} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full text-gray-600 transition-colors" title="Clear Scene"><Trash2 className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-full text-gray-600 transition-colors" title="Save Project"><Save className="w-5 h-5" /></button>
        </div>

        {/* WebGL Canvas */}
        <BuilderCanvas />

        {/* View Controls Helper (Bottom Right) */}
        <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20 text-xs text-gray-500 flex items-center gap-2">
          <Maximize className="w-4 h-4" />
          <span>Left Click: Select/Drag • Right Click: Pan • Scroll: Zoom</span>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Properties Panel */}
      <AnimatePresence>
        {selectedId && selectedObject && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-l border-gray-200 z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.05)] flex flex-col"
          >
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900 capitalize">{objectType} Properties</h3>
              </div>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* Common Property: Color */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Material Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={(selectedObject as any).color || '#ffffff'}
                    onChange={(e) => {
                      if (objectType === 'wall') updateWall(selectedId, { color: e.target.value });
                      if (objectType === 'furniture') updateFurniture(selectedId, { color: e.target.value });
                    }}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-200 p-0"
                  />
                  <span className="text-sm text-gray-700 font-mono">{(selectedObject as any).color}</span>
                </div>
              </div>

              {/* Wall Specific Properties */}
              {objectType === 'wall' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Dimensions</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Height (m)</span>
                        <input 
                          type="number" 
                          step="0.1"
                          value={(selectedObject as any).height}
                          onChange={(e) => updateWall(selectedId, { height: parseFloat(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Thickness (m)</span>
                        <input 
                          type="number" 
                          step="0.05"
                          value={(selectedObject as any).thickness}
                          onChange={(e) => updateWall(selectedId, { thickness: parseFloat(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeWall(selectedId)}
                    className="w-full mt-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Wall
                  </button>
                </div>
              )}

              {/* Furniture Specific Properties */}
              {objectType === 'furniture' && (
                <div className="space-y-4">
                  <button 
                    onClick={() => removeFurniture(selectedId)}
                    className="w-full mt-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Item
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DecorBuilder;
