/* eslint-disable */

import PassivePromise from '../lib/index.js';


(async () => {
  const foo = new PassivePromise((resolve, reject) => setTimeout(() => resolve(1), 1000));

  console.log(await foo); // 1 after 1 sec

  const bar = new PassivePromise((resolve, reject) => setTimeout(() => resolve(1), 1000));

  bar.resolve(-1);

  console.log(await bar); // -1 immedietly

  // const baz = new PassivePromise((resolve, reject) => setTimeout(() => resolve(1), 1000));

  // baz.reject(0) // Unhandled promise rejection.
})();