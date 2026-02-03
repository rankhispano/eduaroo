// Sound effects system for Eduaroo
// Uses Web Audio API for low-latency audio playback

type SoundType = 'correct' | 'incorrect' | 'complete' | 'levelUp' | 'click' | 'star' | 'streak';

// Sound URLs - using base64 encoded simple tones for now
// In production, replace with actual audio files in /public/sounds/
const SOUND_FREQUENCIES: Record<SoundType, { freq: number; duration: number; type: OscillatorType }[]> = {
    correct: [
        { freq: 523.25, duration: 0.1, type: 'sine' }, // C5
        { freq: 659.25, duration: 0.1, type: 'sine' }, // E5
        { freq: 783.99, duration: 0.15, type: 'sine' }, // G5
    ],
    incorrect: [
        { freq: 200, duration: 0.15, type: 'sawtooth' },
        { freq: 150, duration: 0.2, type: 'sawtooth' },
    ],
    complete: [
        { freq: 523.25, duration: 0.1, type: 'sine' }, // C5
        { freq: 659.25, duration: 0.1, type: 'sine' }, // E5
        { freq: 783.99, duration: 0.1, type: 'sine' }, // G5
        { freq: 1046.50, duration: 0.2, type: 'sine' }, // C6
    ],
    levelUp: [
        { freq: 392, duration: 0.1, type: 'square' }, // G4
        { freq: 523.25, duration: 0.1, type: 'square' }, // C5
        { freq: 659.25, duration: 0.1, type: 'square' }, // E5
        { freq: 783.99, duration: 0.1, type: 'square' }, // G5
        { freq: 1046.50, duration: 0.3, type: 'square' }, // C6
    ],
    click: [
        { freq: 800, duration: 0.05, type: 'sine' },
    ],
    star: [
        { freq: 880, duration: 0.08, type: 'sine' }, // A5
        { freq: 1108.73, duration: 0.12, type: 'sine' }, // C#6
    ],
    streak: [
        { freq: 440, duration: 0.1, type: 'triangle' },
        { freq: 554.37, duration: 0.1, type: 'triangle' },
        { freq: 659.25, duration: 0.1, type: 'triangle' },
        { freq: 880, duration: 0.2, type: 'triangle' },
    ],
};

class SoundEffectsManager {
    private audioContext: AudioContext | null = null;
    private enabled: boolean = true;
    private volume: number = 0.3;

    constructor() {
        // Initialize on first user interaction
        if (typeof window !== 'undefined') {
            this.initOnInteraction();
        }
    }

    private initOnInteraction() {
        const init = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', init);
            document.removeEventListener('touchstart', init);
            document.removeEventListener('keydown', init);
        };

        document.addEventListener('click', init);
        document.addEventListener('touchstart', init);
        document.addEventListener('keydown', init);
    }

    private ensureContext(): AudioContext | null {
        if (!this.audioContext && typeof window !== 'undefined') {
            try {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API not supported');
                return null;
            }
        }
        return this.audioContext;
    }

    play(soundType: SoundType) {
        if (!this.enabled) return;

        const ctx = this.ensureContext();
        if (!ctx) return;

        // Resume context if suspended
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const notes = SOUND_FREQUENCIES[soundType];
        if (!notes) return;

        let startTime = ctx.currentTime;

        notes.forEach((note) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = note.type;
            oscillator.frequency.setValueAtTime(note.freq, startTime);

            // Envelope for smoother sound
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(this.volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(startTime);
            oscillator.stop(startTime + note.duration);

            startTime += note.duration * 0.8; // Slight overlap for smoother transitions
        });
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    isEnabled() {
        return this.enabled;
    }
}

// Singleton instance
export const soundEffects = new SoundEffectsManager();

// Convenience functions
export const playCorrect = () => soundEffects.play('correct');
export const playIncorrect = () => soundEffects.play('incorrect');
export const playComplete = () => soundEffects.play('complete');
export const playLevelUp = () => soundEffects.play('levelUp');
export const playClick = () => soundEffects.play('click');
export const playStar = () => soundEffects.play('star');
export const playStreak = () => soundEffects.play('streak');

// Hook for React components
import { useCallback, useState } from 'react';

export function useSoundEffects() {
    const [enabled, setEnabled] = useState(soundEffects.isEnabled());

    const toggleSound = useCallback(() => {
        const newEnabled = !enabled;
        setEnabled(newEnabled);
        soundEffects.setEnabled(newEnabled);
    }, [enabled]);

    const play = useCallback((type: SoundType) => {
        soundEffects.play(type);
    }, []);

    return {
        enabled,
        toggleSound,
        play,
        playCorrect,
        playIncorrect,
        playComplete,
        playLevelUp,
        playClick,
        playStar,
        playStreak,
    };
}
