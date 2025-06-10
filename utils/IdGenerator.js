import { v4 as uuidv4 } from "uuid";

/** Skapar en unik ID */
export const generatePrefixedId = (prefix) => {
  const shortId = uuidv4().replace(/-/g, "").slice(0, 5);
  return `${prefix}-${shortId}`;
};
