function adminValidation(role) {
  if (role && role !== 'admin') {
    throw {
      status: 403,
      message: 'Access forbidden. You are not an admin.',
    };
  }
}

module.exports = adminValidation;