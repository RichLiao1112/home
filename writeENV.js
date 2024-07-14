const fs = require('fs');

try {
  console.log('[process.env]', process.env);
  fs.writeFileSync('/app/env.json', JSON.stringify(process.env), 'utf8');
} catch (err) {
  console.log(err);
  process.exit(1);
}
