import { useMemo, useState, Component, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { CONFIG } from './gridConfig';
import { matchesFilter, calculateGridDimensions } from './gridState';
import { ShoeTile } from './ShoeTile';

// Per-tile error boundary so a single failed texture doesn't crash the canvas
class TileErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { return this.state.hasError ? null : this.props.children; }
}

export function GridCanvas({ items, gridVisible, transitionStartTime, interactive, filter = 'all' }) {
    const { mappedItems, filteredGridDims } = useMemo(() => {
        const spacing = CONFIG.itemSize + CONFIG.gap;
        const filteredItems = items.filter(item => matchesFilter(item, filter));
        const filteredCount = filteredItems.length;
        const filteredDims = calculateGridDimensions(filteredCount);
        const maxDelay = gridVisible ? CONFIG.enterStaggerDelay : CONFIG.exitStaggerDelay;
        let filteredIdx = 0;

        const mapped = items.map((item, i) => {
            const matches = matchesFilter(item, filter);
            let targetPos;
            if (matches) {
                const col = filteredIdx % CONFIG.gridCols;
                const row = Math.floor(filteredIdx / CONFIG.gridCols);
                targetPos = {
                    x: col * spacing - filteredDims.width / 2 + spacing / 2,
                    y: -(row * spacing) + filteredDims.height / 2 - spacing / 2,
                };
                filteredIdx++;
            } else {
                const col = i % CONFIG.gridCols;
                const row = Math.floor(i / CONFIG.gridCols);
                const originalDims = calculateGridDimensions(items.length);
                targetPos = {
                    x: col * spacing - originalDims.width / 2 + spacing / 2,
                    y: -(row * spacing) + originalDims.height / 2 - spacing / 2,
                };
            }
            return {
                ...item,
                index: i,
                randomDelay: Math.random() * maxDelay,
                basePos: targetPos,
                matchesFilter: matches,
            };
        });

        return { mappedItems: mapped, filteredGridDims: filteredDims };
    }, [items, filter, gridVisible]);

    const [mountedCount, setMountedCount] = useState(gridVisible ? 0 : items.length);

    useFrame(() => {
        if (mountedCount < mappedItems.length) {
            setMountedCount(prev => Math.min(prev + 5, mappedItems.length));
        }
    });

    return (
        <>
            {mappedItems.map((item, i) => {
                if (i > mountedCount) return null;
                return (
                    <TileErrorBoundary key={item.product_url || item.index}>
                        <Suspense fallback={null}>
                            <ShoeTile
                                data={item}
                                index={item.index}
                                basePos={item.basePos}
                                gridVisible={gridVisible}
                                transitionStartTime={transitionStartTime}
                                interactive={interactive && item.matchesFilter}
                                matchesFilter={item.matchesFilter}
                                gridHeight={filteredGridDims.height}
                            />
                        </Suspense>
                    </TileErrorBoundary>
                );
            })}
        </>
    );
}
