import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

// Simplex 2D noise (inlined from glsl-noise)
const SIMPLEX_2D = /* glsl */`
    vec3 _permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = _permute(_permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m; m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
`;

const vertexShader = /* glsl */`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = /* glsl */`
    ${SIMPLEX_2D}

    uniform float uTime;
    uniform vec3 uColor;
    uniform vec2 uResolution;
    uniform float uOpacity;
    uniform float uLineOpacity;
    uniform float uScale;
    uniform float uLineThickness;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 noiseUv = uv;
        noiseUv.x *= aspect;

        vec2 centeredUv = uv - 0.5;
        centeredUv.x *= aspect;
        float dist = length(centeredUv);
        float radius = 0.6;
        float mask = 1.0 - smoothstep(radius - 0.01, radius + 0.01, dist);

        float n = snoise(noiseUv * uScale + uTime * 0.05);
        float lines = fract(n * 5.0);
        float pattern = smoothstep(0.5 - uLineThickness, 0.5, lines) - smoothstep(0.5, 0.5 + uLineThickness, lines);

        float grain = (fract(sin(dot(vUv, vec2(12.9898, 78.233) * 2.0)) * 43758.5453) - 0.5) * 0.15;
        vec3 finalColor = uColor + grain;

        gl_FragColor = vec4(finalColor, pattern * uLineOpacity * mask * uOpacity);
    }
`;

const TopographyMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#c8c8c8'),
        uResolution: new THREE.Vector2(1, 1),
        uOpacity: 1.0,
        uLineOpacity: 0.4,
        uScale: 3.0,
        uLineThickness: 0.03,
    },
    vertexShader,
    fragmentShader
);

extend({ TopographyMaterial });

export function TopologyBackground({
    isZoomedIn = false,
    color = '#c8c8c8',
    opacity = 0.4,
    speed = 0.05,
    scale = 3.0,
    lineThickness = 0.03,
}) {
    const materialRef = useRef();
    const planeWidth = 90;
    const planeHeight = 40;

    useFrame((_, delta) => {
        if (!materialRef.current) return;
        materialRef.current.uTime += delta * (speed / 0.05);
        materialRef.current.uResolution.set(planeWidth, planeHeight);
        materialRef.current.uColor.set(color);
        materialRef.current.uLineOpacity = opacity;
        materialRef.current.uScale = scale;
        materialRef.current.uLineThickness = lineThickness;
        const targetOpacity = isZoomedIn ? 0.25 : 1.0;
        easing.damp(materialRef.current, 'uOpacity', targetOpacity, 0.3, delta);
    });

    return (
        <Plane args={[planeWidth, planeHeight]} position={[0, 0, -15]} renderOrder={-1}>
            <topographyMaterial ref={materialRef} transparent depthWrite={false} />
        </Plane>
    );
}
