// Minimal types for what we actually use.
// Extend if you need more fields later.

export type Branch = {
  id: string;
  name: string;
  addressLine?: string;
  town?: string;
  postcode?: string;
  country?: string;
  lat?: number;
  lon?: number;
  hours?: Array<{ day: string; opens: string; closes: string }>;
  phone?: string;
  sortCodes?: string[];
  brandName?: string;
};

const BASE =
  "https://europe-west1-proto-rn-frbs-4242.cloudfunctions.net/dev_task";

export async function fetchBranchesRaw(signal?: AbortSignal) {
  const res = await fetch(`${BASE}/branches`, { signal });
  if (!res.ok) throw new Error(`Branches HTTP ${res.status}`);
  return res.json();
}

/** Take the raw API response and flatten into Branch[] */
export function normalizeBranches(raw: any): Branch[] {
  if (!raw?.data) return [];

  const list: Branch[] = [];
  for (const dataItem of raw.data) {
    for (const brand of dataItem.Brand ?? []) {
      const brandName = brand.BrandName;
      for (const b of brand.Branch ?? []) {
        const id = String(b.Identification ?? crypto.randomUUID());
        const name = String(b.Name ?? "Branch");

        // Address
        const pa = b.PostalAddress ?? {};
        const line =
          [pa.BuildingNumber, pa.StreetName].filter(Boolean).join(" ").trim() ||
          undefined;

        // Coordinates
        const geo = pa.GeoLocation?.GeographicCoordinates;
        const lat = geo?.Latitude ? Number(geo.Latitude) : undefined;
        const lon = geo?.Longitude ? Number(geo.Longitude) : undefined;

        // Hours (flatten StandardAvailability.Day[].OpeningHours[])
        const days: Array<{ day: string; opens: string; closes: string }> = [];
        const std = b.Availability?.StandardAvailability?.Day ?? [];
        for (const d of std) {
          for (const oh of d.OpeningHours ?? []) {
            days.push({
              day: d.Name,
              opens: oh.OpeningTime,
              closes: oh.ClosingTime,
            });
          }
        }

        const phone = (b.ContactInfo ?? []).find(
          (c: any) => c.ContactType === "Phone"
        )?.ContactContent;

        list.push({
          id,
          name,
          brandName,
          addressLine: line,
          town: pa.TownName,
          postcode: pa.PostCode,
          country: pa.Country,
          lat,
          lon,
          hours: days,
          phone,
          sortCodes: b.SortCode ?? [],
        });
      }
    }
  }
  return list;
}