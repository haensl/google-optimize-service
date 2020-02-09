const fs = require('fs');
const rollup = require('rollup');

rollup.rollup({
  input: 'src/google-optimize-service.js'
}).then((bundle) => bundle.generate({
  format: 'cjs'
})).then((bundled) =>
  new Promise((resolve, reject) => {
    fs.writeFile(
      'lib/google-optimize-service.node.js',
      bundled.code,
      'utf8',
      (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      }
    );
  })
).catch((e) => {
  console.error(e);
});
