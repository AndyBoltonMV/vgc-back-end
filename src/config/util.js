exports.userSanitize = (user) => {
  user.password = "";
  user.email = "";
  return user;
};
