import { nanoid } from "nanoid";
import * as jose from "jose";

const key = jose.base64url.decode(process.env.TOKEN_SYMMETRIC_KEY);

export async function createToken(accountId, duration) {
  let currentDate = new Date();
  const expirationTime = new Date(currentDate.getTime() + duration * 3600000);

  const id = nanoid();
  if (!id) {
    return {
      token: null,
      payload: null,
      error: "Failed to generate random UUID. Please try again later.",
    };
  }

  const payload = {
    id: id,
    accountId: accountId,
    createdAt: currentDate,
    expiredAt: expirationTime,
  };

  const encryptedToken = await new jose.EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .encrypt(key);

  return {
    token: encryptedToken,
    payload: payload,
    error: null,
  };
}

export async function verifyToken(token) {
  const payload = await wrapper(token);

  if (!payload) {
    return { isValid: false, payload: null };
  }

  if (isExpired(payload)) {
    return { isValid: false, payload: payload };
  }

  return { isValid: true, payload: payload };
}

function isExpired(payload) {
  const currentTime = new Date();
  const expireTime = new Date(payload.expiredAt);

  return currentTime > expireTime;
}

async function wrapper(token) {
  try {
    const { payload, protectedHeader } = await jose.jwtDecrypt(token, key);
    return payload;
  } catch (e) {
    if (e instanceof jose.errors.JWEDecryptionFailed) {
      return null;
    }
  }
}
