import * as bcrypt from 'bcrypt';

export const hash = async (
  plain: string,
  rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10),
) => bcrypt.hash(plain, rounds);

export const compare = async (plain: string, hashed: string) =>
  bcrypt.compare(plain, hashed);
