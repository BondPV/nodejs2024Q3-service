import { genSalt, hash } from 'bcrypt';

const saltSize = +(process.env.CRYPT_SALT ?? '10');

export const generateHash = async (str: string): Promise<string> => {
  const salt = await genSalt(saltSize);
  return hash(str, salt);
};
