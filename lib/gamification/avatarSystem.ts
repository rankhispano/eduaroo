// Avatar System for Eduaroo
// Manages avatar customization, unlockables, and the item store

export interface AvatarPart {
    id: string;
    category: AvatarCategory;
    nameEs: string;
    cost: number;
    emoji: string;
    unlocked: boolean;
    equipped: boolean;
}

export type AvatarCategory = 'head' | 'face' | 'body' | 'accessory' | 'background';

// Default avatar parts (what everyone starts with)
export const DEFAULT_AVATAR_PARTS: AvatarPart[] = [
    // Heads - free defaults
    { id: 'head_default', category: 'head', nameEs: 'Cabeza Normal', cost: 0, emoji: '👤', unlocked: true, equipped: true },
    { id: 'head_cool', category: 'head', nameEs: 'Gafas de Sol', cost: 20, emoji: '😎', unlocked: false, equipped: false },
    { id: 'head_nerd', category: 'head', nameEs: 'Gafas Nerd', cost: 15, emoji: '🤓', unlocked: false, equipped: false },
    { id: 'head_party', category: 'head', nameEs: 'Gorro Fiesta', cost: 25, emoji: '🥳', unlocked: false, equipped: false },
    { id: 'head_crown', category: 'head', nameEs: 'Corona', cost: 100, emoji: '👑', unlocked: false, equipped: false },
    { id: 'head_wizard', category: 'head', nameEs: 'Mago', cost: 50, emoji: '🧙', unlocked: false, equipped: false },
    { id: 'head_astronaut', category: 'head', nameEs: 'Astronauta', cost: 75, emoji: '👨‍🚀', unlocked: false, equipped: false },

    // Faces
    { id: 'face_happy', category: 'face', nameEs: 'Feliz', cost: 0, emoji: '😊', unlocked: true, equipped: true },
    { id: 'face_star', category: 'face', nameEs: 'Ojos Estrella', cost: 30, emoji: '🤩', unlocked: false, equipped: false },
    { id: 'face_cool', category: 'face', nameEs: 'Guay', cost: 20, emoji: '😏', unlocked: false, equipped: false },
    { id: 'face_thinking', category: 'face', nameEs: 'Pensando', cost: 15, emoji: '🤔', unlocked: false, equipped: false },
    { id: 'face_robot', category: 'face', nameEs: 'Robot', cost: 40, emoji: '🤖', unlocked: false, equipped: false },

    // Body/Outfit
    { id: 'body_casual', category: 'body', nameEs: 'Casual', cost: 0, emoji: '👕', unlocked: true, equipped: true },
    { id: 'body_superhero', category: 'body', nameEs: 'Superhéroe', cost: 50, emoji: '🦸', unlocked: false, equipped: false },
    { id: 'body_scientist', category: 'body', nameEs: 'Científico', cost: 45, emoji: '🥼', unlocked: false, equipped: false },
    { id: 'body_athlete', category: 'body', nameEs: 'Atleta', cost: 35, emoji: '🏃', unlocked: false, equipped: false },
    { id: 'body_pirate', category: 'body', nameEs: 'Pirata', cost: 60, emoji: '🏴‍☠️', unlocked: false, equipped: false },

    // Accessories
    { id: 'acc_none', category: 'accessory', nameEs: 'Ninguno', cost: 0, emoji: '✨', unlocked: true, equipped: true },
    { id: 'acc_pet_dog', category: 'accessory', nameEs: 'Perrito', cost: 40, emoji: '🐕', unlocked: false, equipped: false },
    { id: 'acc_pet_cat', category: 'accessory', nameEs: 'Gatito', cost: 40, emoji: '🐈', unlocked: false, equipped: false },
    { id: 'acc_trophy', category: 'accessory', nameEs: 'Trofeo', cost: 80, emoji: '🏆', unlocked: false, equipped: false },
    { id: 'acc_rocket', category: 'accessory', nameEs: 'Cohete', cost: 70, emoji: '🚀', unlocked: false, equipped: false },
    { id: 'acc_book', category: 'accessory', nameEs: 'Libro Mágico', cost: 55, emoji: '📖', unlocked: false, equipped: false },

    // Backgrounds
    { id: 'bg_default', category: 'background', nameEs: 'Azul', cost: 0, emoji: '🔵', unlocked: true, equipped: true },
    { id: 'bg_sunset', category: 'background', nameEs: 'Atardecer', cost: 30, emoji: '🌅', unlocked: false, equipped: false },
    { id: 'bg_space', category: 'background', nameEs: 'Espacio', cost: 50, emoji: '🌌', unlocked: false, equipped: false },
    { id: 'bg_forest', category: 'background', nameEs: 'Bosque', cost: 35, emoji: '🌲', unlocked: false, equipped: false },
    { id: 'bg_ocean', category: 'background', nameEs: 'Océano', cost: 35, emoji: '🌊', unlocked: false, equipped: false },
    { id: 'bg_rainbow', category: 'background', nameEs: 'Arcoíris', cost: 45, emoji: '🌈', unlocked: false, equipped: false },
];

// Get category display name
export function getCategoryName(category: AvatarCategory): string {
    const names: Record<AvatarCategory, string> = {
        head: 'Cabeza',
        face: 'Cara',
        body: 'Ropa',
        accessory: 'Accesorios',
        background: 'Fondo',
    };
    return names[category];
}

// Get category icon
export function getCategoryIcon(category: AvatarCategory): string {
    const icons: Record<AvatarCategory, string> = {
        head: '🎭',
        face: '😊',
        body: '👕',
        accessory: '⭐',
        background: '🖼️',
    };
    return icons[category];
}

// Get currently equipped items from parts array
export function getEquippedAvatar(parts: AvatarPart[]): Record<AvatarCategory, AvatarPart | undefined> {
    const categories: AvatarCategory[] = ['head', 'face', 'body', 'accessory', 'background'];
    const equipped: Record<AvatarCategory, AvatarPart | undefined> = {} as any;

    categories.forEach(cat => {
        equipped[cat] = parts.find(p => p.category === cat && p.equipped);
    });

    return equipped;
}

// Calculate total unlocked value (for stats)
export function getTotalUnlockedValue(parts: AvatarPart[]): number {
    return parts.filter(p => p.unlocked).reduce((sum, p) => sum + p.cost, 0);
}

// Get items by category
export function getItemsByCategory(parts: AvatarPart[], category: AvatarCategory): AvatarPart[] {
    return parts.filter(p => p.category === category);
}

// Check if user can afford an item
export function canAfford(stars: number, item: AvatarPart): boolean {
    return stars >= item.cost;
}
