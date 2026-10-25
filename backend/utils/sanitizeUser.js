function sanitizeUser(user) {
  if (!user) return null;
  const source = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete source.password;
  return source;
}

module.exports = { sanitizeUser };
