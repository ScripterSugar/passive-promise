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

(async () => {
  const foo = new PassivePromise(() => {})
    .then((fulfilled) => console.log(fulfilled));
  
  foo.resolve(1); // 1

  await foo;

  
  const bar = new PassivePromise()
    .catch((errored) => console.log('Promise rejected!', errored));
  
  bar.reject(-1); // Promise rejected! -1

  await bar;

  const baz = new PassivePromise(() => {})
    .then(
      (fulfilled) => console.log(fulfilled),
      (errored) => console.log('Promise rejected!', errored),
    )
    .finally(() => console.log('Finally.'));

  baz.reject(-1) // Promise rejected! -1 Finally.
})();

(async () => {
  const chainedPromise = new PassivePromise(() => {})
    .then((firstRes) => {
      console.log('first.');
    })
    .then((secondRes) => {
      console.log('second.');
    })
    .then((thirdRes) => {
      console.log('third.');
    });
  
  chainedPromise.resolve(1); 

  await chainedPromise; // first. second. third.

  const middleChain = new PassivePromise(() => {})
    .then((firstRes) => {
      console.log('first.');
    })
    .then((secondRes) => {
      console.log('second.');
    });

  middleChain.then((thirdRes) => {
    console.log('third.');
  });

  // Regardless of position of PassivePromise instance in the chained promises, they always resolve root promise in the chain.
  middleChain.resolve(1);

  await middleChain; // first. second. third.
  
  // If you want to resolve the instance itself rather than root instance, use passiveResolve() and passiveReject() accordingly.

  const anotherChain = new PassivePromise(() => {})
    .then((firstRes) => {
      console.log('first.');
    })
    .then((secondRes) => {
      console.log('second.');
    });

  anotherChain.then((thirdRes) => {
    console.log('third.');
  });

  // We want to directly resolve this promise rather than the whole promise chain here.
  anotherChain.passiveResolve(1);

  await anotherChain; // third.
})()