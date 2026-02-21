import axios from "axios";
import { ArtworkApiResponse } from "../types/artwork";

const API = axios.create({
  baseURL: "https://api.artic.edu/api/v1",
  timeout: 8000,
});

export async function getArtworks(page: number, limit = 12) {
  try {
    const res = await API.get<ArtworkApiResponse>("/artworks", {
      params: {
        page,
        limit,
        fields:
          "id,title,place_of_origin,artist_display,inscriptions,date_start,date_end",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to fetch artworks:", err);
    throw new Error("Something went wrong while loading artworks.");
  }
}