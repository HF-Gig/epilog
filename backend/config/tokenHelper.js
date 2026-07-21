import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "epilog-super-secret-key-123!";

/**
 * Generates a signed token containing only the user_id and workspace_id
 * @param {string} userId 
 * @param {string} workspaceId 
 * @returns {string} Signed token
 */
export const generateToken = (userId, workspaceId) => {
  const payload = JSON.stringify({ user_id: userId, workspace_id: workspaceId });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(encodedPayload);
  const signature = hmac.digest("base64url");
  return `${encodedPayload}.${signature}`;
};

/**
 * Verifies the token and returns the decoded payload if valid, otherwise null
 * @param {string} token 
 * @returns {object|null} Decoded payload { user_id, workspace_id } or null
 */
export const verifyToken = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, signature] = parts;
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(encodedPayload);
  const expectedSignature = hmac.digest("base64url");
  if (signature !== expectedSignature) return null;
  try {
    const payloadStr = Buffer.from(encodedPayload, "base64url").toString("utf8");
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
};
