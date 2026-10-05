import crypto from "node:crypto";
import { users } from "../data/users.js";
import { validateLoginPayload } from "../utils/validation.js";

const JWT_SECRET = process.env.JWT_SECRET || "hush-lush-assignment-secret";
const TOKEN_TTL_SECONDS = 60 * 60 * 24;

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

function base64Url(input) {
  return Buffer.from(JSON.stringify(input)).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", JWT_SECRET).update(value).digest("base64url");
}

function createToken(user) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + TOKEN_TTL_SECONDS;
  const header = base64Url({ alg: "HS256", typ: "JWT" });
  const payload = base64Url({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: issuedAt,
    exp: expiresAt
  });
  const unsignedToken = `${header}.${payload}`;

  return {
    token: `${unsignedToken}.${sign(unsignedToken)}`,
    expiresAt
  };
}

export function verifyToken(token) {
  const [header, payload, signature] = String(token || "").split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = sign(unsignedToken);

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

  if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return {
    id: decoded.sub,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role
  };
}

export function login(payload) {
  const validation = validateLoginPayload(payload);

  if (!validation.isValid) {
    return {
      ok: false,
      status: 422,
      body: {
        message: "Please correct the highlighted fields.",
        errors: validation.errors
      }
    };
  }

  const user = users.find(
    (entry) => entry.email === validation.email && entry.password === validation.password
  );

  if (!user) {
    return {
      ok: false,
      status: 401,
      body: { message: "Invalid email or password." }
    };
  }

  return {
    ok: true,
    status: 200,
    body: {
      ...createToken(user),
      user: publicUser(user)
    }
  };
}

export function guestLogin() {
  const guest = {
    id: `guest-${Date.now()}`,
    name: "Guest",
    email: "guest@hushlush.local",
    role: "guest"
  };

  return {
    ...createToken(guest),
    user: guest
  };
}
