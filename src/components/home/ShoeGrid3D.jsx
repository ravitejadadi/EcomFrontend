import React, { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Link, useNavigate } from 'react-router-dom';

import { DEFAULT_CONFIG, CONFIG } from './r3f/gridConfig';
import { rigState, calculateGridDimensions, matchesFilter } from './r3f/gridState';
import { Rig } from './r3f/Rig';
import { GridCanvas } from './r3f/GridCanvas';
import { TopologyBackground } from './r3f/TopologyBackground';
import { UnifiedControlBar } from './r3f/GridUI';
import './r3f/HoloCardMaterial'; // Registers <holoCardMaterial /> with R3F

// Fallback product images (transparent-background-friendly Unsplash shoes)
const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465479423260-c4afc24172c6?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop&q=80',
];

// Map a product to the shape expected by the grid tiles
const mapProduct = (p, fallbackIdx) => ({
    title: p.name || p.title || 'Product',
    price: p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : null,
    image_url: p.images?.[0]?.url || FALLBACK_IMAGES[fallbackIdx % FALLBACK_IMAGES.length],
    product_url: String(p._id || p.id || p.name || fallbackIdx),
    badges: p.badges || [],
});

// Build collections from the products array
const buildCollections = (products) => {
    const running = products
        .filter(p => p.category === 'Running')
        .map((p, i) => mapProduct(p, i));

    const sneakers = products
        .filter(p => p.category === 'Sneakers')
        .map((p, i) => mapProduct(p, i));

    const budget = products
        .filter(p => typeof p.price === 'number' && p.price < 2500)
        .map((p, i) => mapProduct(p, i));

    // Pad each collection to at least 24 items using fallbacks
    const padCollection = (col, offset) => {
        if (col.length >= 8) return col;
        const extra = Array.from({ length: 24 - col.length }, (_, i) => ({
            title: 'The Elegant Collection',
            price: null,
            image_url: FALLBACK_IMAGES[(offset + i) % FALLBACK_IMAGES.length],
            product_url: `fallback-${offset}-${i}`,
            badges: [],
        }));
        return [...col, ...extra];
    };

    return [
        padCollection(running.length ? running : padCollection([], 0), 0),
        padCollection(sneakers.length ? sneakers : padCollection([], 8), 8),
        padCollection(budget.length ? budget : padCollection([], 16), 16),
    ];
};

export default function ShoeGrid3D({ products = [] }) {
    const navigate = useNavigate();
    const [zoomTarget, setZoomTarget] = useState(null);
    const [isZoomedIn, setIsZoomedIn] = useState(false);
    const [hasActiveSelection, setHasActiveSelection] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeCollectionIdx, setActiveCollectionIdx] = useState(0);

    // Reset rig state on mount so it's fresh each time the section mounts
    useEffect(() => {
        rigState.zoom = DEFAULT_CONFIG.zoomOut;
        rigState.target.set(0, 2, 0);
        rigState.current.set(0, 2, 0);
        rigState.activeId = null;
        rigState.isDragging = false;
    }, []);

    // Single RAF loop to sync critical UI state updates (only re-renders React when values cross state thresholds)
    useEffect(() => {
        let rafId;
        let lastZoomedIn = rigState.zoom <= CONFIG.zoomIn + 0.5;
        let lastActive = rigState.activeId !== null;
        
        setIsZoomedIn(lastZoomedIn);
        setHasActiveSelection(lastActive);

        const poll = () => {
            const zoomedIn = rigState.zoom <= CONFIG.zoomIn + 0.5;
            const active = rigState.activeId !== null;
            if (zoomedIn !== lastZoomedIn) {
                lastZoomedIn = zoomedIn;
                setIsZoomedIn(zoomedIn);
            }
            if (active !== lastActive) {
                lastActive = active;
                setHasActiveSelection(active);
            }
            rafId = requestAnimationFrame(poll);
        };
        rafId = requestAnimationFrame(poll);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Responsive zoom levels for the embedded canvas
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            CONFIG.zoomOut = w < 480 ? 48 : w < 768 ? 38 : DEFAULT_CONFIG.zoomOut;
            if (rigState.zoom > CONFIG.zoomIn + 2) {
                rigState.zoom = CONFIG.zoomOut;
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // Apply zoom trigger from UI
    useEffect(() => {
        if (zoomTarget === 'OUT') {
            rigState.zoom = CONFIG.zoomOut;
            rigState.target.set(0, 2, 0);
        } else if (typeof zoomTarget === 'number') {
            rigState.zoom = zoomTarget;
        }
        setZoomTarget(null);
    }, [zoomTarget]);

    const collectionsData = useMemo(() => buildCollections(products), [products]);

    const [gridLayers, setGridLayers] = useState(() => [{
        id: 'init',
        items: buildCollections(products)[0],
        mode: 'enter',
        startTime: 0,
    }]);

    // Keep initial layer in sync with product data once loaded
    useEffect(() => {
        setGridLayers([{
            id: 'init-loaded',
            items: collectionsData[0],
            mode: 'enter',
            startTime: Date.now(),
        }]);
    }, [collectionsData]);

    const handleCollectionSwitch = (index) => {
        if (index === activeCollectionIdx) return;
        const now = Date.now();
        setGridLayers(prev => {
            const exiting = prev.map(l => l.mode === 'enter' ? { ...l, mode: 'exit', startTime: now } : l);
            return [...exiting, { id: `grid-${index}-${now}`, items: collectionsData[index], mode: 'enter', startTime: now }];
        });
        setActiveCollectionIdx(index);
        setActiveFilter('all');
        rigState.target.set(0, 2, 0);
        rigState.activeId = null;
        setTimeout(() => {
            setGridLayers(prev => prev.filter(l => l.mode === 'enter'));
        }, CONFIG.cleanupTimeout);
    };

    const handleFilterChange = (filter) => {
        if (filter === activeFilter) return;
        setActiveFilter(filter);
        rigState.activeId = null;
    };

    const activeLayer = gridLayers[gridLayers.length - 1];
    const filteredCount = useMemo(() => {
        if (activeCollectionIdx !== 0) return activeLayer.items.length;
        return activeLayer.items.filter(item => matchesFilter(item, activeFilter)).length;
    }, [activeLayer.items, activeCollectionIdx, activeFilter]);

    const activeDims = calculateGridDimensions(filteredCount);


    return (
        <section style={{ background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
            {/* Three.js canvas */}
            <div
                style={{
                    position: 'relative',
                    height: 'clamp(480px, 65vh, 700px)',
                    touchAction: 'none',
                }}
            >
                <Canvas
                    camera={{ position: [0, 0, DEFAULT_CONFIG.zoomOut], fov: 45 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, toneMapping: THREE.NoToneMapping, powerPreference: 'high-performance' }}
                    style={{ background: '#f0f0f0' }}
                >
                    <Rig gridW={activeDims.width} gridH={activeDims.height} />
                    <TopologyBackground
                        isZoomedIn={isZoomedIn}
                        color={CONFIG.bgColor}
                        opacity={CONFIG.bgOpacity}
                        speed={CONFIG.bgSpeed}
                        scale={CONFIG.bgScale}
                        lineThickness={CONFIG.bgLineThickness}
                    />
                    <fog attach="fog" args={['#f0f0f0', DEFAULT_CONFIG.fogNear, DEFAULT_CONFIG.fogFar]} />
                    <Suspense fallback={null}>
                        {gridLayers.map(layer => (
                            <GridCanvas
                                key={layer.id}
                                items={layer.items}
                                gridVisible={layer.mode === 'enter'}
                                transitionStartTime={layer.startTime}
                                interactive={layer.mode === 'enter'}
                                filter={activeCollectionIdx === 0 ? activeFilter : 'all'}
                            />
                        ))}
                    </Suspense>
                </Canvas>

                {/* Overlaid control bar (absolute within the canvas div) */}
                <UnifiedControlBar
                    currentCollection={activeCollectionIdx}
                    onSwitch={handleCollectionSwitch}
                    setZoomTrigger={setZoomTarget}
                    isZoomedIn={isZoomedIn}
                    hasActiveSelection={hasActiveSelection}
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                    onShopNow={() => {
                        const links = ['/collections/running', '/collections/sneakers', '/collections'];
                        navigate(links[activeCollectionIdx] || '/collections/running');
                    }}
                />
            </div>

            {/* Bottom CTA */}
            <div style={{ textAlign: 'center', padding: '32px 24px 56px' }}>
                <Link
                    to="/collections/running"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: '#000', color: '#fff',
                        padding: '14px 32px', borderRadius: '4px',
                        fontSize: '13px', fontWeight: '700',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        textDecoration: 'none',
                    }}
                >
                    Shop All Footwear →
                </Link>
            </div>
        </section>
    );
}
