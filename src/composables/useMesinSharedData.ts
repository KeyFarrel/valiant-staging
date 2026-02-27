import { ref, type Ref } from "vue";
import GrafikService from "@/services/grafik-service";

const grafikService = new GrafikService();

export interface MesinSharedCache {
  planning: Ref<any>;
  realisasiProyeksi: Ref<any>;
  realisasiYoy: Ref<any>;
  hasFetchedPlanning: Ref<boolean>;
  hasFetchedRealisasi: Ref<boolean>;
  hasFetchedYoy: Ref<boolean>;
}

const mesinCaches = new Map<string, MesinSharedCache>();

function getCacheKey(uuidMesin: string, tahun: number): string {
  return `${uuidMesin}_${tahun}`;
}

function getOrCreateCache(uuidMesin: string, tahun: number): MesinSharedCache {
  const key = getCacheKey(uuidMesin, tahun);
  if (!mesinCaches.has(key)) {
    mesinCaches.set(key, {
      planning: ref(null),
      realisasiProyeksi: ref(null),
      realisasiYoy: ref(null),
      hasFetchedPlanning: ref(false),
      hasFetchedRealisasi: ref(false),
      hasFetchedYoy: ref(false),
    });
  }
  return mesinCaches.get(key)!;
}

const inflightPlanning = new Map<string, Promise<any>>();
const inflightRealisasi = new Map<string, Promise<any>>();
const inflightYoy = new Map<string, Promise<any>>();

export async function fetchSharedPlanningMesin(
  uuidMesin: string,
  tahun: number,
): Promise<any> {
  const cache = getOrCreateCache(uuidMesin, tahun);
  if (cache.hasFetchedPlanning.value) {
    return cache.planning.value;
  }

  const key = getCacheKey(uuidMesin, tahun);

  if (inflightPlanning.has(key)) {
    return inflightPlanning.get(key)!;
  }

  const promise = grafikService
    .getPlanningMesin({ uuid_mesin: uuidMesin })
    .then((response: any) => {
      cache.planning.value = response.data;
      cache.hasFetchedPlanning.value = true;
      inflightPlanning.delete(key);
      return response.data;
    })
    .catch((error) => {
      inflightPlanning.delete(key);
      throw error;
    });

  inflightPlanning.set(key, promise);
  return promise;
}

export async function fetchSharedRealisasiProyeksiMesin(
  uuidMesin: string,
  tahun: number,
): Promise<any> {
  if (isNaN(tahun)) return null;
  const cache = getOrCreateCache(uuidMesin, tahun);
  if (cache.hasFetchedRealisasi.value) {
    return cache.realisasiProyeksi.value;
  }

  const key = getCacheKey(uuidMesin, tahun);

  if (inflightRealisasi.has(key)) {
    return inflightRealisasi.get(key)!;
  }

  const promise = grafikService
    .getRealisasiProyeksiMesin({ tahun, uuid_mesin: uuidMesin })
    .then((response: any) => {
      cache.realisasiProyeksi.value = response.data;
      cache.hasFetchedRealisasi.value = true;
      inflightRealisasi.delete(key);
      return response.data;
    })
    .catch((error) => {
      inflightRealisasi.delete(key);
      throw error;
    });

  inflightRealisasi.set(key, promise);
  return promise;
}

export async function fetchSharedRealisasiYoyMesin(
  uuidMesin: string,
  tahun: number,
): Promise<any> {
  if (isNaN(tahun)) return null;
  const cache = getOrCreateCache(uuidMesin, tahun);
  if (cache.hasFetchedYoy.value) {
    return cache.realisasiYoy.value;
  }

  const key = getCacheKey(uuidMesin, tahun);

  if (inflightYoy.has(key)) {
    return inflightYoy.get(key)!;
  }

  const promise = grafikService
    .getRealisasiYoyMesin({ uuid_mesin: uuidMesin, tahun: tahun - 1 })
    .then((response: any) => {
      cache.realisasiYoy.value = response.data;
      cache.hasFetchedYoy.value = true;
      inflightYoy.delete(key);
      return response.data;
    })
    .catch((error) => {
      inflightYoy.delete(key);
      throw error;
    });

  inflightYoy.set(key, promise);
  return promise;
}

export function invalidateMesinCache(uuidMesin: string, tahun: number): void {
  const key = getCacheKey(uuidMesin, tahun);
  mesinCaches.delete(key);
}

export function invalidateAllMesinCaches(): void {
  mesinCaches.clear();
}
