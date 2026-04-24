export type DataProviderMode = 'json' | 'firestore';

export function getDataProviderMode(): DataProviderMode {
  const value = process.env.JOBMATE_DATA_PROVIDER?.toLowerCase();
  return value === 'firestore' ? 'firestore' : 'json';
}
