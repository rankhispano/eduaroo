'use client';

import React from 'react';

interface FractionVisualProps {
    numerator: number;
    denominator: number;
    type?: 'circle' | 'bar';
    size?: number;
    color?: string;
    emptyColor?: string;
}

export default function FractionVisual({
    numerator,
    denominator,
    type = 'circle',
    size = 100,
    color = '#22c55e', // brand-green
    emptyColor = '#ffffff'
}: FractionVisualProps) {

    if (type === 'circle') {
        const center = size / 2;
        const radius = size * 0.45;
        const slices = [];

        for (let i = 0; i < denominator; i++) {
            const startAngle = (i * 360) / denominator;
            const endAngle = ((i + 1) * 360) / denominator;

            // Convert polar to cartesian
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            // SVG Path command for a slice
            const largeArcFlag = 360 / denominator > 180 ? 1 : 0;
            const pathData = [
                `M ${center} ${center}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');

            slices.push(
                <path
                    key={i}
                    d={pathData}
                    fill={i < numerator ? color : emptyColor}
                    stroke="#374151" // gray-700
                    strokeWidth="1.5"
                />
            );
        }

        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {slices}
            </svg>
        );
    }

    // Bar type
    const width = size;
    const height = size / 3;
    const segmentWidth = width / denominator;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {Array.from({ length: denominator }).map((_, i) => (
                <rect
                    key={i}
                    x={i * segmentWidth}
                    y={0}
                    width={segmentWidth}
                    height={height}
                    fill={i < numerator ? color : emptyColor}
                    stroke="#374151"
                    strokeWidth="1.5"
                />
            ))}
        </svg>
    );
}
