import { RouletteForm1, RouletteForm2 } from "@/types/Roulette";
import { RouletteSlugResponse } from "@/types/rouletteslug.type";
import axios from "axios";

const BASE_URL = "https://api.afiliadoplaysux.com";

export const checkHealth = async () => {
  try {
    const url = `${BASE_URL}/health`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const userSignUp = async (email: string, password: string) => {
  try {
    const url = `${BASE_URL}/user/sign-up`;
    const body = { email, password };
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userSignIn = async (email: string, password: string) => {
  try {
    const url = `${BASE_URL}/user/sign-in?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signout = async (token: string | null) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/user/sign-out`;
    const response = await axios.delete(url, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchRoulettes = async (limit: number, offset: number, token: string) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/roulettes`;
    const response = await axios.get(url, {
      headers: { Authorization: token },
      params: { limit: limit || 10, offset: offset || 0 },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchRouletteBySlug = async (slug: string) => {
  try {
 
    const url = `${BASE_URL}/roulettes/${slug}`;
    const response = await axios.get<RouletteSlugResponse>(url, {
      
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const spinRoulette = async (slug: string) => {
  try {
  
    const url = `${BASE_URL}/roulettes/${slug}/spin`;
    const response = await axios.get(url, {});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchRouletteCustomization = async (slug: string) => {
  try {   
    const url = `${BASE_URL}/roulettes/${slug}/customization`;
    const response = await axios.get(url, {});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const upsertRoulette = async (data: { title: string; favicon: string; slug: string }, token: string) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/admin/roulettes/upsert`;
    const response = await axios.post(url, data, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const upsertRouletteCustomization = async (slug: string, data: RouletteForm2, token: string) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/admin/roulettes/${slug}/customization/upsert`;
    const response = await axios.post(url, data, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRoulette = async (slug: string, data: RouletteForm1, token: string) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/admin/roulettes/${slug}/upsert`;
    const response = await axios.put(url, data, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRouletteCustomization = async (slug: string, data: RouletteForm2, token: string) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/admin/roulettes/${slug}/customization/upsert`;
    const response = await axios.put(url, data, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteRoulette = async (slug: string, token: string) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/admin/roulettes/${slug}/delete`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const uploadFile = async (file: File, token: string): Promise<string> => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/admin/files/upload`;
    const formData = new FormData();
    formData.append("featuredFile", file);

    const response = await axios.post(url, formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      const { filename } = response.data.data;
      return `https://api.afiliadoplaysux.com/files/${filename}`;
    }

    throw new Error("Falha no upload do arquivo");
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
};

export const getFileMetadata = async (filename: string, token: string) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/files/${filename}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const duplicateRoulette = async (slug: string, token: string) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não encontrado");
    }
    const url = `${BASE_URL}/admin/roulettes/${slug}/duplicate`;
    const response = await axios.post(url, {}, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
