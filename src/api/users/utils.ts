import type { UserDocument } from "../../models/users";

export type UserPreferences = {
  theme?: "light" | "dark" | "system";
  language?: "en" | "fr";
};

const PREFERENCES = [
  {
    key: "theme",
    type: "string",
    default: "light",
    description: "User interface theme preference",
    options: ["light", "dark", "system"],
  },
  {
    key: "language",
    type: "string",
    default: "fr",
    description: "User interface language preference",
    options: ["en", "fr"],
  },
];

export const getUserPreferences = (user: UserDocument) => {
  const preferences: Record<string, unknown> = {};
  PREFERENCES.forEach((pref) => {
    preferences[pref.key] = user.preferences?.[pref.key] || pref.default;
  });
  return preferences;
};

export const getPreferencesPayload = (
  newPreferences: Record<string, unknown>,
): UserPreferences => {
  const preferences: Record<string, unknown> = {};
  PREFERENCES.forEach((pref) => {
    const value = newPreferences[pref.key];
    if (
      value !== undefined &&
      (!pref.options || pref.options.includes(value as string))
    ) {
      preferences[pref.key] = value;
    } else {
      preferences[pref.key] = pref.default;
    }
  });
  return preferences;
};
