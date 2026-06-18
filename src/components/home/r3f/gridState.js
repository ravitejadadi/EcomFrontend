import * as THREE from 'three';
import { CONFIG } from './gridConfig';

export const rigState = {
    target: new THREE.Vector3(0, 2, 0),
    current: new THREE.Vector3(0, 2, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    zoom: CONFIG.zoomOut,
    isDragging: false,
    activeId: null,
};

export const calculateGridDimensions = (count) => {
    const rows = Math.ceil(count / CONFIG.gridCols);
    const spacing = CONFIG.itemSize + CONFIG.gap;
    return {
        width: CONFIG.gridCols * spacing,
        height: rows * spacing,
    };
};

export const EMPTY_COLORS = [];

// Adapted for The Elegant product data:
// filter: 'all' | 'nitro' | 'new'
export const matchesFilter = (item, filter) => {
    if (filter === 'all') return true;
    const title = (item.title || '').toLowerCase();
    if (filter === 'nitro') return title.includes('nitro');
    if (filter === 'new') return (item.badges || []).includes('NEW');
    return true;
};
