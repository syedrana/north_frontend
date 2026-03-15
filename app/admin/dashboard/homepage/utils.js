export const prettyJson = (value) => JSON.stringify(value ?? {}, null, 2);

export const parseSettingsOrThrow = (settingsJson) => {
  try {
    return JSON.parse(settingsJson || "{}");
  } catch {
    throw new Error("Settings JSON is invalid. Please fix JSON format.");
  }
};

export const parseSettingsOrFallback = (settingsJson) => {
  try {
    return JSON.parse(settingsJson || "{}");
  } catch {
    return {};
  }
};

export const updateSettingsJson = (settingsJson, updater) => {
  const current = parseSettingsOrFallback(settingsJson);
  const next = updater(current);
  return prettyJson(next);
};

export const convertFileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
