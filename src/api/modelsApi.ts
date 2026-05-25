// ─────────────────────────────────────────────
//  src/api/modelsApi.ts
//  Changes vs previous version:
//  - Added ModelFile interface (used by coverPicture and files)
//  - Added ModelDetail interface for single model response
//  - Added DetailEnvelope interface
//  - Added fetchModelById() — GET /skort_app/fetchers/open/model/fetch/{id}
// ─────────────────────────────────────────────

import { API_BASE_URL } from "./config";

const MODELS_ENDPOINT = `${API_BASE_URL}/skort_app/fetchers/open/models/fetch`;
const MODEL_ENDPOINT  = (id: number) => `${API_BASE_URL}/skort_app/fetchers/open/model/fetch/${id}`;

// ── Request shape ─────────────────────────────
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface FetchModelsParams {
  pageNumber?: number;
  pageSize?: number;
  startDate?: string | null;
  endDate?: string | null;
  email?: string;
  country?: string;
  location?: string;
  landmark?: string;
  gender?: Gender;
  subExpiryDaysWithin?: number;
}

// ── Shared file shape ─────────────────────────
export interface ModelFile {
  id: number;
  fileName: string;
  storeFileName: string;
  contentType: string;
  size: string;
}

// kept for backward compatibility — same shape as ModelFile
export interface ModelProfilePic extends ModelFile {}

export interface ModelService {
  createdAt: string;
  deleted: boolean;
  id: number;
  serviceDescription: string;
  serviceName: string;
  updatedAt: string | null;
}

// ── List response shape ───────────────────────
export interface Model {
  modelId: number;
  modelName: string;
  fullName: string;
  age: number;
  location: string;
  tagline: string;
  ratesFrom: number;
  ratingsAvg: number;
  ratingsCount: number;
  featured: boolean;
  profilePic: ModelFile | null;
  services: ModelService[];
}

// ── Detail response shape ─────────────────────
export interface ModelDetail {
  modelId: number;
  fullName: string;
  modelName: string;
  location: string;
  tagline: string;
  aboutMe: string;
  age: number;
  ratesFrom: number;
  ratingsAvg: number;
  ratingsCount: number;
  featured: boolean;
  profilePic: ModelFile | null;
  coverPicture: ModelFile | null;
  files: ModelFile[] | null;
  services: ModelService[];
}

// ── List API envelope ─────────────────────────
interface ListEnvelope {
  status: number;
  message: string;
  timestamp: string;
  data: {
    content: Model[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
}

// ── Detail API envelope ───────────────────────
interface DetailEnvelope {
  status: number;
  message: string;
  timestamp: string;
  data: ModelDetail;
}

// ── fetchModels — list ────────────────────────
export async function fetchModels(filters: FetchModelsParams = {}): Promise<Model[]> {
  const payload: Record<string, unknown> = {
    pageNumber: filters.pageNumber ?? 0,
    pageSize: filters.pageSize ?? 50,
    startDate: filters.startDate ?? null,
    endDate: filters.endDate ?? null,
    ...(filters.email !== undefined && { email: filters.email }),
    ...(filters.country !== undefined && { country: filters.country }),
    ...(filters.location !== undefined && { location: filters.location }),
    ...(filters.landmark !== undefined && { landmark: filters.landmark }),
    ...(filters.gender !== undefined && { gender: filters.gender }),
    ...(filters.subExpiryDaysWithin !== undefined && {
      subExpiryDaysWithin: filters.subExpiryDaysWithin,
    }),
  };

  const response = await fetch(MODELS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
  }

  const envelope: ListEnvelope = await response.json();
  return envelope.data?.content ?? [];
}

// ── fetchModelById — single detail ────────────
export async function fetchModelById(id: number): Promise<ModelDetail> {
  const response = await fetch(MODEL_ENDPOINT(id));

  if (!response.ok) {
    throw new Error(`Failed to fetch model: ${response.status} ${response.statusText}`);
  }

  const envelope: DetailEnvelope = await response.json();
  return envelope.data;
}