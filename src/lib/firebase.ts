// firebase.ts — LOCAL DEMO MODE (no Firebase required)
// Mimir Metals Digital Toolroom
// Drop-in replacement for the Firebase version.
// All data lives in localStorage so it persists across page refreshes.
// To reset to factory data: localStorage.clear() in browser console.

import initialInventory, { Die } from "../data/initialInventory";

const STORAGE_KEY = "mimir_toolroom_inventory";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function loadFromStorage(): Die[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Die[];
  } catch (e) {
    console.warn("Failed to load from localStorage, using initial inventory.");
  }
  return initialInventory;
}

function saveToStorage(inventory: Die[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  } catch (e) {
    console.warn("Failed to save to localStorage.");
  }
}

// ─── PUBLIC API (mirrors Firebase interface) ──────────────────────────────────

/**
 * Subscribe to inventory changes.
 * Calls the callback immediately with current data, then on every update.
 * Returns an unsubscribe function.
 */
export function subscribeToInventory(
  callback: (dies: Die[]) => void
): () => void {
  // Initial load
  callback(loadFromStorage());

  // Listen for cross-tab updates (optional but nice)
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(loadFromStorage());
    }
  };
  window.addEventListener("storage", handler);

  return () => window.removeEventListener("storage", handler);
}

/**
 * Get all dies once (no subscription).
 */
export async function getAllDies(): Promise<Die[]> {
  return loadFromStorage();
}

/**
 * Update a single die's status and/or notes.
 */
export async function updateDie(
  id: string,
  updates: Partial<Die>
): Promise<void> {
  const inventory = loadFromStorage();
  const idx = inventory.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error(`Die ${id} not found`);
  inventory[idx] = { ...inventory[idx], ...updates };
  saveToStorage(inventory);
  // Trigger any subscribeToInventory listeners in same tab
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

/**
 * Add a new die to inventory.
 */
export async function addDie(die: Die): Promise<void> {
  const inventory = loadFromStorage();
  if (inventory.find((d) => d.id === die.id)) {
    throw new Error(`Die ID ${die.id} already exists`);
  }
  inventory.push(die);
  saveToStorage(inventory);
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

/**
 * Remove a die from inventory (use sparingly — prefer status: "Scrapped").
 */
export async function deleteDie(id: string): Promise<void> {
  const inventory = loadFromStorage();
  const filtered = inventory.filter((d) => d.id !== id);
  saveToStorage(filtered);
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

/**
 * Reset inventory back to the initial Mimir Metals demo data.
 * Useful for demo resets between presentations.
 */
export async function resetToDemo(): Promise<void> {
  saveToStorage(initialInventory);
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  console.log("Inventory reset to Mimir Metals demo data.");
}

// ─── PHOTO UPLOAD STUB ────────────────────────────────────────────────────────
// In production this would upload to Firebase Storage.
// For demo, we just return a fake URL so the UI doesn't break.

export async function uploadPaperworkPhoto(
  _dieId: string,
  file: File
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
