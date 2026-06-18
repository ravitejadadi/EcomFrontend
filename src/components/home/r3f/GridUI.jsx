import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONFIG } from './gridConfig';

const islandTransition = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 1,
};

export function UnifiedControlBar({
    currentCollection,
    onSwitch,
    setZoomTrigger,
    isZoomedIn,
    hasActiveSelection,
    activeFilter,
    onFilterChange,
    onShopNow,
}) {
    // The Elegant collections
    const collections = ['Running', 'Sneakers', 'Under ₹2500'];

    // Sub-filters for Running collection (collection 0)
    const runningFilters = [
        { id: 'all', label: 'All' },
        { id: 'nitro', label: 'Nitro' },
        { id: 'new', label: 'New' },
    ];

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '32px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                zIndex: 100,
                pointerEvents: 'none',
            }}
        >
            <motion.div
                layout
                transition={islandTransition}
                style={{
                    background: 'linear-gradient(135deg, rgba(255,240,235,0.4) 0%, rgba(255,255,255,0.3) 50%, rgba(245,235,255,0.4) 100%)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    borderRadius: '32px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'auto',
                    height: '56px',
                    overflow: 'hidden',
                }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {hasActiveSelection ? (
                        /* STATE 1: Shop Now (when shoe selected) */
                        <motion.button
                            key="shop-now"
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                            transition={{ ...islandTransition, opacity: { duration: 0.2 } }}
                            onClick={onShopNow}
                            style={{
                                background: '#000', color: '#fff', border: 'none',
                                borderRadius: '24px', padding: '0 24px', height: '44px',
                                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Shop Now →
                        </motion.button>
                    ) : isZoomedIn ? (
                        /* STATE 2: Compact (zoom out button) */
                        <motion.div
                            key="compact"
                            initial={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
                            transition={{ ...islandTransition, opacity: { duration: 0.2 } }}
                            style={{ display: 'flex' }}
                        >
                            <ControlButton icon="remove" onClick={() => setZoomTrigger('OUT')} label="Zoom Out" />
                        </motion.div>
                    ) : (
                        /* STATE 3: Expanded (collections + filters) */
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                            transition={{ ...islandTransition, opacity: { duration: 0.2 } }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <ControlButton icon="add" onClick={() => setZoomTrigger(CONFIG.zoomIn)} label="Zoom In" />

                            <Divider />

                            {/* Collection tabs */}
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {collections.map((name, index) => (
                                    <TabButton key={name} isActive={currentCollection === index} onClick={() => onSwitch(index)}>
                                        {name}
                                    </TabButton>
                                ))}
                            </div>

                            {/* Running sub-filters (desktop) */}
                            {currentCollection === 0 && (
                                <div className="sg-desktop-filters" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Divider />
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={islandTransition}
                                        style={{ display: 'flex', gap: '4px' }}
                                    >
                                        {runningFilters.map(f => (
                                            <FilterChip key={f.id} isActive={activeFilter === f.id} onClick={() => onFilterChange(f.id)}>
                                                {f.label}
                                            </FilterChip>
                                        ))}
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Mobile running filters */}
            <AnimatePresence>
                {currentCollection === 0 && !isZoomedIn && !hasActiveSelection && (
                    <motion.div
                        className="sg-mobile-filters"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={islandTransition}
                        style={{ position: 'absolute', bottom: '70px', left: 0, right: 0, display: 'none', justifyContent: 'center', pointerEvents: 'none' }}
                    >
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: '4px',
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                            borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '6px 8px',
                            pointerEvents: 'auto',
                        }}>
                            {runningFilters.map(f => (
                                <FilterChip key={`m-${f.id}`} isActive={activeFilter === f.id} onClick={() => onFilterChange(f.id)}>
                                    {f.label}
                                </FilterChip>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .sg-desktop-filters { display: flex; align-items: center; }
                .sg-mobile-filters { display: none !important; }
                @media (max-width: 768px) {
                    .sg-desktop-filters { display: none !important; }
                    .sg-mobile-filters { display: flex !important; }
                }
            `}</style>
        </div>
    );
}

function Divider() {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '24px' }}
            transition={{ delay: 0.1 }}
            style={{ width: '1px', background: 'rgba(0,0,0,0.08)', margin: '0 2px', boxShadow: '0 0 1px rgba(255,255,255,0.3)' }}
        />
    );
}

function ControlButton({ onClick, icon, label }) {
    return (
        <motion.button
            layout="position"
            onClick={onClick}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: 'transparent', color: '#111',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', outline: 'none',
            }}
            aria-label={label}
        >
            {icon === 'add' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            )}
        </motion.button>
    );
}

function TabButton({ children, isActive, onClick }) {
    return (
        <motion.button
            layout
            onClick={onClick}
            style={{
                position: 'relative', border: 'none', background: 'transparent',
                color: isActive ? '#000' : '#666', padding: '8px 16px',
                borderRadius: '20px', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', whiteSpace: 'nowrap', zIndex: 1,
                transition: 'color 0.2s ease',
            }}
        >
            {children}
            {isActive && (
                <motion.div
                    layoutId="activeTabIndicator"
                    transition={islandTransition}
                    style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '20px', border: '1px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
                        zIndex: -1,
                    }}
                />
            )}
        </motion.button>
    );
}

function FilterChip({ children, isActive, onClick }) {
    return (
        <motion.button
            layout
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={islandTransition}
            style={{
                position: 'relative', border: 'none', background: 'transparent',
                color: isActive ? '#fff' : '#555', padding: '6px 12px',
                borderRadius: '14px', fontSize: '12px', fontWeight: '500',
                cursor: 'pointer', whiteSpace: 'nowrap', zIndex: 1,
            }}
        >
            {isActive && (
                <motion.div
                    layoutId="activeFilterIndicator"
                    transition={islandTransition}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', borderRadius: '14px', zIndex: -1 }}
                />
            )}
            {!isActive && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.05)', borderRadius: '14px', zIndex: -1 }} />
            )}
            {children}
        </motion.button>
    );
}
