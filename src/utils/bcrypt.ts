import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
}

export async function comparePasswords(args: {
  password: string;
  hash: string;
}) {
  return await bcrypt.compare(args.password, args.hash);
}
