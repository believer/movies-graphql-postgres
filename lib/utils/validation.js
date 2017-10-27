const validEmail = email => {
  const validEmail = /^[a-zA-Z0-9!#$%&'*+-=?^_`{|}~.]+@([\w\d]+\.)+[a-z]{2,5}$/gi

  return validEmail.test(email)
}

module.exports = {
  validEmail,
}