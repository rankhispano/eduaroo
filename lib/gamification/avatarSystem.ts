// Avatar System for Eduaroo
// Manages avatar customization, unlockables, and the item store

export interface AvatarPart {
    id: string;
    category: AvatarCategory;
    nameKey: string;
    cost: number;
    emoji: string;
    unlocked: boolean;
    equipped: boolean;
}

export type AvatarCategory = 'head' | 'face' | 'body' | 'accessory' | 'background';

// Default avatar parts (what everyone starts with)
export const DEFAULT_AVATAR_PARTS: AvatarPart[] = [
    // Heads - free defaults
    { id: 'head_default', category: 'head', nameKey: 'Store.items.head_default', cost: 0, emoji: '👤', unlocked: true, equipped: true },
    { id: 'head_cool', category: 'head', nameKey: 'Store.items.head_cool', cost: 20, emoji: '😎', unlocked: false, equipped: false },
    { id: 'head_nerd', category: 'head', nameKey: 'Store.items.head_nerd', cost: 15, emoji: '🤓', unlocked: false, equipped: false },
    { id: 'head_party', category: 'head', nameKey: 'Store.items.head_party', cost: 25, emoji: '🥳', unlocked: false, equipped: false },
    { id: 'head_crown', category: 'head', nameKey: 'Store.items.head_crown', cost: 100, emoji: '👑', unlocked: false, equipped: false },
    { id: 'head_wizard', category: 'head', nameKey: 'Store.items.head_wizard', cost: 50, emoji: '🧙', unlocked: false, equipped: false },
    { id: 'head_astronaut', category: 'head', nameKey: 'Store.items.head_astronaut', cost: 75, emoji: '👨‍🚀', unlocked: false, equipped: false },

    // Faces
    { id: 'face_happy', category: 'face', nameKey: 'Store.items.face_happy', cost: 0, emoji: '😊', unlocked: true, equipped: true },
    { id: 'face_star', category: 'face', nameKey: 'Store.items.face_star', cost: 30, emoji: '🤩', unlocked: false, equipped: false },
    { id: 'face_cool', category: 'face', nameKey: 'Store.items.face_cool', cost: 20, emoji: '😏', unlocked: false, equipped: false },
    { id: 'face_thinking', category: 'face', nameKey: 'Store.items.face_thinking', cost: 15, emoji: '🤔', unlocked: false, equipped: false },
    { id: 'face_robot', category: 'face', nameKey: 'Store.items.face_robot', cost: 40, emoji: '🤖', unlocked: false, equipped: false },

    // Body/Outfit
    { id: 'body_casual', category: 'body', nameKey: 'Store.items.body_casual', cost: 0, emoji: '👕', unlocked: true, equipped: true },
    { id: 'body_superhero', category: 'body', nameKey: 'Store.items.body_superhero', cost: 50, emoji: '🦸', unlocked: false, equipped: false },
    { id: 'body_scientist', category: 'body', nameKey: 'Store.items.body_scientist', cost: 45, emoji: '🥼', unlocked: false, equipped: false },
    { id: 'body_athlete', category: 'body', nameKey: 'Store.items.body_athlete', cost: 35, emoji: '🏃', unlocked: false, equipped: false },
    { id: 'body_pirate', category: 'body', nameKey: 'Store.items.body_pirate', cost: 60, emoji: '🏴‍☠️', unlocked: false, equipped: false },

    // Accessories
    { id: 'acc_none', category: 'accessory', nameKey: 'Store.items.acc_none', cost: 0, emoji: '✨', unlocked: true, equipped: true },
    { id: 'acc_pet_dog', category: 'accessory', nameKey: 'Store.items.acc_pet_dog', cost: 40, emoji: '🐕', unlocked: false, equipped: false },
    { id: 'acc_pet_cat', category: 'accessory', nameKey: 'Store.items.acc_pet_cat', cost: 40, emoji: '🐈', unlocked: false, equipped: false },
    { id: 'acc_trophy', category: 'accessory', nameKey: 'Store.items.acc_trophy', cost: 80, emoji: '🏆', unlocked: false, equipped: false },
    { id: 'acc_rocket', category: 'accessory', nameKey: 'Store.items.acc_rocket', cost: 70, emoji: '🚀', unlocked: false, equipped: false },
    { id: 'acc_book', category: 'accessory', nameKey: 'Store.items.acc_book', cost: 55, emoji: '📖', unlocked: false, equipped: false },

    // Backgrounds
    { id: 'bg_default', category: 'background', nameKey: 'Store.items.bg_default', cost: 0, emoji: '🔵', unlocked: true, equipped: true },
    { id: 'bg_sunset', category: 'background', nameKey: 'Store.items.bg_sunset', cost: 30, emoji: '🌅', unlocked: false, equipped: false },
    { id: 'bg_space', category: 'background', nameKey: 'Store.items.bg_space', cost: 50, emoji: '🌌', unlocked: false, equipped: false },
    { id: 'bg_forest', category: 'background', nameKey: 'Store.items.bg_forest', cost: 35, emoji: '🌲', unlocked: false, equipped: false },
    { id: 'bg_ocean', category: 'background', nameKey: 'Store.items.bg_ocean', cost: 35, emoji: '🌊', unlocked: false, equipped: false },
    { id: 'bg_rainbow', category: 'background', nameKey: 'Store.items.bg_rainbow', cost: 45, emoji: '🌈', unlocked: false, equipped: false },
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
