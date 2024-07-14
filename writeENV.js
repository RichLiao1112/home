const fs = require('fs');

try {
  fs.writeFileSync('/app/env.json', JSON.stringify(process.env), 'utf8');
} catch (err) {
  console.log(err);
  process.exit(1);
}
