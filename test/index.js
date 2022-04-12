/* eslint-disable */

import PassivePromise from '../lib/index.js';

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