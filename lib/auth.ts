import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email: string, password: string) {
  const database = getDb();
  const user = await database.select().from(users).where(eq(users.email, email)).get();
  
  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.password);
  
  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function createUser(email: string, password: string, name: string, role: 'admin' | 'editor' = 'editor') {
  const hashedPassword = await hashPassword(password);
  
  const result = await getDb().insert(users).values({
    email,
    password: hashedPassword,
    name,
    role,
  }).returning();

  return result[0];
} 