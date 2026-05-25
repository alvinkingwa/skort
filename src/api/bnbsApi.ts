// ─────────────────────────────────────────────
//  src/api/bnbsApi.ts
//  Contains both:
//  - fetchBnbs()    — POST list endpoint
//  - fetchBnbById() — GET single detail endpoint
// ─────────────────────────────────────────────

import { API_BASE_URL } from "./config";

const BNBS_ENDPOINT   = `${API_BASE_URL}/skort_app/fetchers/open/bnbs/fetch`;
const BNB_ENDPOINT    = (id: number) => `${API_BASE_URL}/skort_app/fetchers/open/bnb/fetch/${id}`;

// ── Shared types ──────────────────────────────
export type BnbType =
  | "Cottage"
  | "Apartment"
  | "Villa"
  | "Studio"
  | "House"
  | "Hotel"
  | string;

export interface BnbAmenity {
  id: number;
  amenityName: string;
  amenityIcon: string;
  createdAt: string;
  updatedAt: string | null;
  deleted: boolean;
}

export interface BnbFile {
  id: number;
  fileName: string;
  storeFileName: string;
  contentType: string;
  size: string;
}

// ── List response shape ───────────────────────
export interface Bnb {
  bnbId: number;
  title: string;
  location: string;
  type: BnbType | null;
  ratePerNight: number;
  ratingsAvg: number;
  ratingsCount: number;
  beds: string;
  baths: string;
  guests: string;
  latitude: string;
  longitude: string;
  amenities: BnbAmenity[];
  files: BnbFile[] | null;
}

// ── Detail response shape ─────────────────────
export interface BnbDetail {
  bnbId: number;
  title: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  type: string | null;
  beds: string;
  baths: string;
  guests: string;
  ratePerNight: number;
  ratingsAvg: number;
  ratingsCount: number;
  hostName: string;
  hostPorfilePic: BnbFile | null; // API typo kept intentionally
  files: BnbFile[] | null;
  amenities: BnbAmenity[];
}

// ── List API envelope ─────────────────────────
interface ListEnvelope {
  status: number;
  message: string;
  timestamp: string;
  data: {
    content: Bnb[];
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
  data: BnbDetail;
}

// ── Request shape ─────────────────────────────
export interface FetchBnbsParams {
  pageNumber?: number;
  pageSize?: number;
  startDate?: string | null;
  endDate?: string | null;
  country?: string;
  location?: string;
  landmark?: string;
  lowerPrice?: number;
  higherPrice?: number;
  type?: BnbType;
}

// ── fetchBnbs — list ──────────────────────────
export async function fetchBnbs(filters: FetchBnbsParams = {}): Promise<Bnb[]> {
  const payload: Record<string, unknown> = {
    pageNumber: filters.pageNumber ?? 0,
    pageSize: filters.pageSize ?? 50,
    startDate: filters.startDate ?? null,
    endDate: filters.endDate ?? null,
    ...(filters.country !== undefined && { country: filters.country }),
    ...(filters.location !== undefined && { location: filters.location }),
    ...(filters.landmark !== undefined && { landmark: filters.landmark }),
    ...(filters.lowerPrice !== undefined && { lowerPrice: filters.lowerPrice }),
    ...(filters.higherPrice !== undefined && { higherPrice: filters.higherPrice }),
    ...(filters.type !== undefined && { type: filters.type }),
  };

  const response = await fetch(BNBS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stays: ${response.status} ${response.statusText}`);
  }

  const envelope: ListEnvelope = await response.json();
  return envelope.data?.content ?? [];
}

// ── fetchBnbById — single detail ──────────────
export async function fetchBnbById(id: number): Promise<BnbDetail> {
  const response = await fetch(BNB_ENDPOINT(id));

  if (!response.ok) {
    throw new Error(`Failed to fetch stay: ${response.status} ${response.statusText}`);
  }

  const envelope: DetailEnvelope = await response.json();
  return envelope.data;
}

// ── fetchBnbTypes — GET list of types ─────────
// Added: fetches dynamic BnB types from the API
interface TypesEnvelope {
  status: number;
  message: string;
  timestamp: string;
  data: string[];
}

export async function fetchBnbTypes(): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/skort_app/fetchers/open/bnb-types/fetch`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch BnB types: ${response.status} ${response.statusText}`);
  }

  const envelope: TypesEnvelope = await response.json();
  return envelope.data ?? [];
}

// ── Amenity types ─────────────────────────────
export interface Amenity {
  id: number;
  amenityName: string;
  amenityIcon: string;
  createdAt: string;
  updatedAt: string | null;
  deleted: boolean;
}

interface AmenitiesEnvelope {
  status: number;
  message: string;
  timestamp: string;
  data: Amenity[];
}

// ── fetchAmenities ────────────────────────────
export async function fetchAmenities(token: string): Promise<Amenity[]> {
  const response = await fetch(
    `${API_BASE_URL}/skort_app/items/amenities/fetch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch amenities: ${response.status} ${response.statusText}`);
  }
  const envelope: AmenitiesEnvelope = await response.json();
  return envelope.data ?? [];
}

// ── BnB creation types ────────────────────────
export interface BnbLocationDto {
  location: string;
  landmark: string;
  country: string;
  longitude: string;
  latitude: string;
}

export interface BnbCreationDto {
  location: BnbLocationDto;
  title: string;
  description: string;
  amount: number;
  pricePerBooking: number;
  guests: string;
  bedrooms: string;
  bathrooms: string;
  amenities: number[]; // amenity IDs
  type: BnbType;
}

// ── createBnb ─────────────────────────────────
export async function createBnb(
  dto: BnbCreationDto,
  files: File[],
  token: string,
): Promise<void> {
  const formData = new FormData();

  // Append files
  files.forEach((file) => formData.append("files", file));

  // Append bnbCreationDto as a JSON blob
  formData.append(
    "bnbCreationDto",
    new Blob([JSON.stringify(dto)], { type: "application/json" }),
  );

  const response = await fetch(`${API_BASE_URL}/skort_app/bnbs/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type — browser sets it with boundary for multipart
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to create BnB: ${response.status} ${response.statusText}`);
  }
}

// ── deleteBnb ─────────────────────────────────
// DELETE /skort_app/bnbs/delete/{bnbId}
export async function deleteBnb(bnbId: number, token: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/skort_app/bnbs/delete/${bnbId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to delete BnB: ${response.status} ${response.statusText}`);
  }
}

// ── updateBnb ─────────────────────────────────
// PUT /skort_app/bnbs/update/{bnbId}
// Accepts same shape as BnbCreationDto — all fields optional for partial update
export interface BnbUpdateDto {
  location?: BnbLocationDto;
  title?: string;
  description?: string;
  amount?: number;
  pricePerBooking?: number;
  guests?: string;
  bedrooms?: string;
  bathrooms?: string;
  amenities?: number[];
  type?: BnbType;
}

export async function updateBnb(
  bnbId: number,
  dto: BnbUpdateDto,
  files: File[],
  token: string,
): Promise<void> {
  const formData = new FormData();

  files.forEach((file) => formData.append("files", file));

  formData.append(
    "bnbCreationDto",
    new Blob([JSON.stringify(dto)], { type: "application/json" }),
  );

  const response = await fetch(
    `${API_BASE_URL}/skort_app/bnbs/update/${bnbId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to update BnB: ${response.status} ${response.statusText}`);
  }
}

// ── toggleBnbFileView ─────────────────────────
// PUT /skort_app/bnbs/toggle-file-view/{bnbId}/{fileId}
// Toggles visibility of a specific file on a BnB listing
export async function toggleBnbFileView(
  bnbId: number,
  fileId: number,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/skort_app/bnbs/toggle-file-view/${bnbId}/${fileId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to toggle file view: ${response.status} ${response.statusText}`);
  }
}