import { Persistence } from 'firebase/auth';

export const getNativePersistence = (): Persistence => {
  throw new Error('Native Firebase persistence is unavailable on this platform.');
};
