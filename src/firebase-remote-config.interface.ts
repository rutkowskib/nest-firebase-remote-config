export interface FirebaseRemoteConfigModuleOptions {
  firebaseServiceAccount: string; // Stringified JSON of Firebase service account
  ttl?: number; // Time to cache fetched remote config in milliseconds
}
