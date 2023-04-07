exports.userSanitize = async (mongoInstanceUser) => {
  const user = mongoInstanceUser.toObject();
  delete user.password;
  delete user.email;
  return user;
};
