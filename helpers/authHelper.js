import bcrypt from "bcrypt";

export const hashMyPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    console.log(err);
  }
};

export const comparePassword = async (password, hashOfPassword) => {
  return bcrypt.compare(password, hashOfPassword);
};
