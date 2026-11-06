import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-expect-error Firebase exposes this helper through its React Native conditional entrypoint.
import { getReactNativePersistence } from 'firebase/auth';

export const getNativePersistence = () => getReactNativePersistence(AsyncStorage);
