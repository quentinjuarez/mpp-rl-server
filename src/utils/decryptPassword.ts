import bcrypt from "bcrypt";

const decryptPassword = async (
  candidatePassword: string,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, password);
};

export default decryptPassword;
