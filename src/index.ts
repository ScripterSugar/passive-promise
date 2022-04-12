type Resolver = (value: unknown) => void;
type Rejector = (reason?: any) => void;
type Executor = (resolve: (value: unknown) => void, reject: (reason?: any) => void) => void;

export class PassivePromise extends Promise<unknown> {
  passiveResolve: Resolver

  passiveReject: Rejector

  parentPromise?: PassivePromise

  finally?: (afterResolver: () => void) => PassivePromise

  constructor(promiseResolver: Executor) {
    const passiveResolvers: { resolve: Resolver, reject: Rejector } = {
      resolve: () => { return; },
      reject: () => { return; },
    };

    super((resolve, reject) => {
      passiveResolvers.resolve = resolve;
      passiveResolvers.reject = reject;
      return promiseResolver?.(resolve, reject);
    });

    const _then = this.then.bind(this);
    const _catch = this.catch.bind(this);

    this.then = ((afterResolver) => {
      const chainedPromise = (_then(afterResolver) as PassivePromise);
      chainedPromise.parentPromise = this;
      return (chainedPromise as Promise<any>);
    });

    this.catch = ((afterResolver) => {
      const chainedPromise = (_catch(afterResolver) as PassivePromise);
      chainedPromise.parentPromise = this;
      return (chainedPromise as Promise<any>);
    });

    if (this.finally) {
      const _finally = this.finally.bind(this);

      this.finally = ((afterResolver) => {
        const chainedPromise = _finally(afterResolver);
        chainedPromise.parentPromise = this;
        return chainedPromise;
      });
    }

    this.passiveResolve = passiveResolvers.resolve;
    this.passiveReject = passiveResolvers.reject;

    return this;
  }

  resolve = (value: unknown): PassivePromise => {
    if (this.parentPromise) {
      return this.parentPromise.resolve(value);
    }

    this.passiveResolve(value);
    return this;
  }

  reject = (reason: any): PassivePromise => {
    if (this.parentPromise) {
      return this.parentPromise.reject(reason);
    }

    this.passiveReject(reason);
    return this;
  }
}

export default PassivePromise
