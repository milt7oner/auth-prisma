import { PrismaClient, User, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import boom from "@hapi/boom";

const prisma = new PrismaClient();

/**
 * Helper para excluir el password antes de devolver un usuario
 */
function excludePassword(user: User): Omit<User, "password"> {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Tipo público de usuario (lo que mostramos al cliente)
 */
export type PublicUser = Omit<User, "password">;

/**
 * Crear usuario nuevo
 */
export async function createUser(
  userData: Partial<User>,
  value: string, // Identificador del país
): Promise<PublicUser> {
  if (!userData.email) throw boom.badRequest("email required");
  if (!userData.password) throw boom.badRequest("password required");

  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    throw boom.conflict("User already exists with this email address");
  }

  // Buscar el país
  const countrydata = await prisma.country.findFirst({
    where: { value },
    select: { id: true },
  });
  if (!countrydata) throw boom.badRequest("Country not found");

  const hash = await bcrypt.hash(userData.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      password: hash,
      countryId: countrydata.id,
      userName: userData.userName ?? null,
      role: userData.role ?? "USER", // Default role
      state: userData.state ?? true,
    },
  });

  return excludePassword(newUser);
}

/**
 * Obtener todos los usuarios (públicos)
 */
export async function getUsers(): Promise<any[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        userName: true,
        role: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

/**
 * Buscar usuario por email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  if (!email) throw boom.badRequest("email is required");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw boom.notFound("user not found");
  return user;
}


/**
 * Buscar usuario por id
 */
export async function getUserById(id: number): Promise<PublicUser> {
  if (!id) throw boom.badRequest("id is required");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw boom.notFound("user not found");

  return excludePassword(user);
}

/**
 * Editar usuario (rehash si cambia la contraseña)
 */
export async function editUser(
  id: number,
  userData: Partial<User>,
): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw boom.notFound("user not found");

  const dataToUpdate: Partial<User> = { ...userData };

  if (userData.password) {
    dataToUpdate.password = await bcrypt.hash(userData.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });

  return excludePassword(updatedUser);
}

/**
 * Cambiar rol del usuario
 */
export async function editRole(id: number, newRole: Role): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw boom.notFound("user not found");

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: newRole },
  });

  return excludePassword(updatedUser);
}

/**
 * Eliminar usuario
 */
export async function deleteUserById(id: number): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw boom.notFound("User not found");

  const deleted = await prisma.user.delete({ where: { id } });
  return excludePassword(deleted);
}

/**
 * Activar/desactivar usuario (soft disable)
 */
export async function setUserState(
  id: number,
  state: boolean,
): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw boom.notFound("User not found");

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { state },
  });

  return excludePassword(updatedUser);
}
