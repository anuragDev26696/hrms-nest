export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'hospital_dev',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

export const mongoConfig = { uri: process.env.MONGO_URI };
export const bcryptConfig = {
  saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
};
// mongodb+srv://anuragspundan:<db_password>@cluster1.wzkrc20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1
