'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Sprite sheet configuration
// Canvas: 192x96, Grid: 3 rows x 6 columns, Cell: 32x32
const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 32;
const SPRITE_COLS = 6;
const FRAME_DURATION = 120; // ms per frame
const SCALE = 2; // Scale up for visibility

// Animation rows
const ANIMATIONS = {
    hop: 0,      // Row 1: Hop cycle
    idle: 1,     // Row 2: Idle & pouch interaction
    kick: 2,     // Row 3: Kick attack
};

type AnimationType = keyof typeof ANIMATIONS;

// Paths where the kangaroo should be hidden (exercise pages)
const HIDDEN_PATHS = [
    '/learning/',
    '/games/',
];

export default function AnimatedKangaroo() {
    const pathname = usePathname();
    const [frame, setFrame] = useState(0);
    const [positionX, setPositionX] = useState(100);
    const [facingRight, setFacingRight] = useState(true);
    const [currentAnimation, setCurrentAnimation] = useState<AnimationType>('idle');
    const [isMoving, setIsMoving] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const targetXRef = useRef(0);
    const animationTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const frameRef = useRef(0);

    // Sync ref with state
    useEffect(() => {
        frameRef.current = frame;
    }, [frame]);

    // Check if kangaroo should be hidden on current page
    const shouldHide = HIDDEN_PATHS.some(path => pathname.includes(path));

    // Frame animation loop
    useEffect(() => {
        if (shouldHide) return;

        const frameInterval = setInterval(() => {
            setFrame((prev) => (prev + 1) % SPRITE_COLS);
        }, FRAME_DURATION);

        return () => clearInterval(frameInterval);
    }, [shouldHide]);

    // Initialize position
    useEffect(() => {
        if (shouldHide || !containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const startX = Math.random() * (containerWidth - SPRITE_WIDTH * SCALE - 40) + 20;
        setPositionX(startX);
        setIsInitialized(true);
    }, [shouldHide]);

    // Start moving after initialization
    useEffect(() => {
        if (shouldHide || !isInitialized || !containerRef.current) return;

        const startMoving = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const maxX = containerWidth - SPRITE_WIDTH * SCALE - 20;
            const newTargetX = Math.random() * maxX + 10;

            targetXRef.current = newTargetX;
            setFacingRight(newTargetX > positionX);
            setCurrentAnimation('hop');
            setIsMoving(true);
        };

        // Start first movement after 1-3 seconds
        const initialTimeout = setTimeout(startMoving, 1000 + Math.random() * 2000);

        return () => clearTimeout(initialTimeout);
    }, [isInitialized, shouldHide]);

    // Movement loop
    useEffect(() => {
        if (shouldHide || !isMoving) return;

        const moveInterval = setInterval(() => {
            setPositionX((prev) => {
                const target = targetXRef.current;
                const speed = 3;

                // Only move if not in the first or last frame of the hop animation
                const currentFrame = frameRef.current;
                const shouldMove = currentAnimation === 'hop'
                    ? (currentFrame !== 0 && currentFrame !== SPRITE_COLS - 1)
                    : true;

                if (!shouldMove) return prev;

                if (Math.abs(target - prev) < speed) {
                    // Arrived at destination
                    setIsMoving(false);
                    setCurrentAnimation('idle');

                    // Schedule next action
                    clearTimeout(animationTimeoutRef.current);
                    animationTimeoutRef.current = setTimeout(() => {
                        if (!containerRef.current) return;

                        // Sometimes do an idle animation first
                        if (Math.random() > 0.6) {
                            // Play kick animation
                            setCurrentAnimation('kick');
                            animationTimeoutRef.current = setTimeout(() => {
                                startNewMovement();
                            }, FRAME_DURATION * SPRITE_COLS);
                        } else {
                            startNewMovement();
                        }
                    }, 1500 + Math.random() * 3000);

                    return target;
                }

                // Update facing direction while moving
                setFacingRight(target > prev);
                return prev + (target > prev ? speed : -speed);
            });
        }, 16);

        return () => clearInterval(moveInterval);
    }, [isMoving, shouldHide, currentAnimation]);

    // Helper to start a new movement
    const startNewMovement = () => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const maxX = containerWidth - SPRITE_WIDTH * SCALE - 20;
        const newTargetX = Math.random() * maxX + 10;

        targetXRef.current = newTargetX;
        setCurrentAnimation('hop');
        setIsMoving(true);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            clearTimeout(animationTimeoutRef.current);
        };
    }, []);

    // Don't render if on exercise pages
    if (shouldHide) {
        return null;
    }

    // Calculate sprite background position
    const row = ANIMATIONS[currentAnimation];
    const backgroundX = -frame * SPRITE_WIDTH;
    const backgroundY = -row * SPRITE_HEIGHT;

    return (
        <div
            ref={containerRef}
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none overflow-hidden"
            aria-hidden="true"
        >
            {/* Kangaroo sprite container */}
            <div
                className="absolute bottom-1"
                style={{
                    left: positionX,
                    width: SPRITE_WIDTH * SCALE,
                    height: SPRITE_HEIGHT * SCALE,
                    transform: `scaleX(${facingRight ? 1 : -1})`,
                    transition: 'transform 0.1s ease-out',
                }}
            >
                {/* Sprite */}
                <div
                    style={{
                        width: SPRITE_WIDTH * SCALE,
                        height: SPRITE_HEIGHT * SCALE,
                        backgroundImage: 'url(/kangaroo-sprite.png)',
                        backgroundPosition: `${backgroundX * SCALE}px ${backgroundY * SCALE}px`,
                        backgroundSize: `${192 * SCALE}px ${96 * SCALE}px`,
                        imageRendering: 'pixelated',
                    }}
                />
            </div>
        </div>
    );
}
