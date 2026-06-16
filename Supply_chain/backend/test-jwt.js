const jwt = require('jsonwebtoken');
try {
  jwt.sign({ sub: 123 }, 'secret', { expiresIn: 3600, expiresIn: '7d' });
  console.log('Success');
} catch (e) {
  console.error(e);
}
