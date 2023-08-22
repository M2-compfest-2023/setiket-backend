import * as bcrypt from 'bcrypt';

export const hashPassword = async (str: string, salt: number = 10): Promise<string> => {
  return await bcrypt.hash(str, salt);
};

export const comparePassword = async (str: string, str2: string): Promise<boolean> => {
  return await bcrypt.compare(str, str2);
};
