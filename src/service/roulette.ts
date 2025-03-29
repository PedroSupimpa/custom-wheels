import { RouletteForm1, RouletteForm2 } from "@/types/Roulette";
import { RouletteSlugResponse } from "@/types/rouletteslug.type";

// Local storage keys
const ROULETTES_KEY = "roulettes";
const USER_KEY = "user";

// Helper functions for local storage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generate a random ID for new items
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock user authentication
export const userSignUp = async (email: string, password: string) => {
  const user = { email, password, token: generateId() };
  saveToStorage(USER_KEY, user);
  return { status: 201, data: { token: user.token } };
};

export const userSignIn = async (email: string, password: string) => {
  // For demo purposes, any email/password combination works
  const token = generateId();
  const user = { email, password, token };
  saveToStorage(USER_KEY, user);
  return { status: 200, data: { token } };
};

export const signout = async (token: string | null) => {
  localStorage.removeItem(USER_KEY);
  return { status: 200 };
};

// Roulette management functions
export const fetchRoulettes = async (
  limit: number,
  offset: number,
  token: string,
) => {
  const roulettes = getFromStorage<RouletteForm1[]>(ROULETTES_KEY, []);
  const paginatedRoulettes = roulettes.slice(offset, offset + limit);
  return { status: 200, data: paginatedRoulettes };
};

export const fetchRouletteBySlug = async (slug: string) => {
  const roulettes = getFromStorage<RouletteForm1[]>(ROULETTES_KEY, []);
  const roulette = roulettes.find((r) => r.slug === slug);

  if (!roulette) {
    throw new Error("Roulette not found");
  }

  // Get the customization data
  const customizationKey = `roulette_${slug}_customization`;
  const customization = getFromStorage(customizationKey, {});

  const response: RouletteSlugResponse = {
    status: 200,
    message: "Success",
    data: {
      slug: roulette.slug,
      favicon: roulette.favicon,
      title: roulette.title,
      customization: customization,
    },
  };

  return response;
};

export const spinRoulette = async (slug: string) => {
  const customizationKey = `roulette_${slug}_customization`;
  const customization = getFromStorage<RouletteForm2>(customizationKey, {
    roulette: { options: [] },
  } as any);

  // Calculate result based on percentages
  const options = customization.roulette.options;
  const totalPercentage = options.reduce(
    (sum, option) => sum + option.percentage,
    0,
  );
  const random = Math.random() * totalPercentage;

  let cumulativePercentage = 0;
  let result = 0;

  for (let i = 0; i < options.length; i++) {
    cumulativePercentage += options[i].percentage;
    if (random <= cumulativePercentage) {
      result = i;
      break;
    }
  }

  return { status: 200, data: { result } };
};

export const fetchRouletteCustomization = async (slug: string) => {
  const customizationKey = `roulette_${slug}_customization`;
  const customization = getFromStorage(customizationKey, {});
  return { status: 200, data: customization };
};

export const upsertRoulette = async (
  data: { title: string; favicon: string; slug: string },
  token: string,
) => {
  const roulettes = getFromStorage<RouletteForm1[]>(ROULETTES_KEY, []);
  const existingIndex = roulettes.findIndex((r) => r.slug === data.slug);

  if (existingIndex >= 0) {
    roulettes[existingIndex] = data;
  } else {
    roulettes.push(data);
  }

  saveToStorage(ROULETTES_KEY, roulettes);
  return { status: 201, data: { message: "Roulette created successfully" } };
};

export const upsertRouletteCustomization = async (
  slug: string,
  data: RouletteForm2,
  token: string,
) => {
  const customizationKey = `roulette_${slug}_customization`;
  saveToStorage(customizationKey, data);
  return { status: 201, data: { message: "Customization saved successfully" } };
};

export const updateRoulette = async (
  slug: string,
  data: RouletteForm1,
  token: string,
) => {
  const roulettes = getFromStorage<RouletteForm1[]>(ROULETTES_KEY, []);
  const index = roulettes.findIndex((r) => r.slug === slug);

  if (index >= 0) {
    // If slug is changing, update the customization key too
    if (slug !== data.slug) {
      const oldCustomizationKey = `roulette_${slug}_customization`;
      const newCustomizationKey = `roulette_${data.slug}_customization`;
      const customization = getFromStorage(oldCustomizationKey, {});
      saveToStorage(newCustomizationKey, customization);
      localStorage.removeItem(oldCustomizationKey);
    }

    roulettes[index] = data;
    saveToStorage(ROULETTES_KEY, roulettes);
  }

  return { status: 200, data: { message: "Roulette updated successfully" } };
};

export const updateRouletteCustomization = async (
  slug: string,
  data: RouletteForm2,
  token: string,
) => {
  const customizationKey = `roulette_${slug}_customization`;
  saveToStorage(customizationKey, data);
  return {
    status: 200,
    data: { message: "Customization updated successfully" },
  };
};

export const deleteRoulette = async (slug: string, token: string) => {
  const roulettes = getFromStorage<RouletteForm1[]>(ROULETTES_KEY, []);
  const filteredRoulettes = roulettes.filter((r) => r.slug !== slug);
  saveToStorage(ROULETTES_KEY, filteredRoulettes);

  // Remove customization data
  const customizationKey = `roulette_${slug}_customization`;
  localStorage.removeItem(customizationKey);

  return { status: 200, data: { message: "Roulette deleted successfully" } };
};

export const uploadFile = async (
  file: File,
  token: string,
): Promise<string> => {
  // Convert file to data URL for local storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Store the data URL in localStorage for demo purposes
      const fileId = generateId();
      const fileKey = `file_${fileId}`;
      saveToStorage(fileKey, reader.result);
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getFileMetadata = async (filename: string, token: string) => {
  // Not needed for local storage implementation
  return { status: 200, data: { filename } };
};

export const duplicateRoulette = async (slug: string, token: string) => {
  const roulettes = getFromStorage<RouletteForm1[]>(ROULETTES_KEY, []);
  const roulette = roulettes.find((r) => r.slug === slug);

  if (!roulette) {
    throw new Error("Roulette not found");
  }

  // Create a copy with a new slug
  const newSlug = `${slug}-copy-${generateId().substring(0, 5)}`;
  const newRoulette = { ...roulette, slug: newSlug };
  roulettes.push(newRoulette);
  saveToStorage(ROULETTES_KEY, roulettes);

  // Copy customization
  const customizationKey = `roulette_${slug}_customization`;
  const newCustomizationKey = `roulette_${newSlug}_customization`;
  const customization = getFromStorage(customizationKey, {});
  saveToStorage(newCustomizationKey, customization);

  return { status: 201, data: { message: "Roulette duplicated successfully" } };
};
