type Resolver = (value: unknown) => void;
type Rejector = (reason?: any) => void;
type Executor = (resolve: (value: unknown) => void, reject: (reason?: any) => void) => void;

export class PassivePromise extends Promise<unknown> {
  passiveResolve: Resolver

  passiveReject: Rejector

  parentPromise?: PassivePromise

  finally?: (afterResolver: () => void) => PassivePromise

  constructor(promiseResolver: Executor) {
    let passiveResolver: Resolver = () => undefined;
    let passiveRejector: Rejector = () => undefined;

    super((resolve, reject) => {
      passiveResolver = resolve;
      passiveRejector = reject;
      return promiseResolver?.(resolve, reject);
    });

    const _then = this.then.bind(this);
    const _catch = this.catch.bind(this);

    this.then = ((afterResolver, afterRejector, ...restArgs ) => {
      const chainedPromise = (_then(afterResolver, afterRejector, ...restArgs) as PassivePromise);
      chainedPromise.parentPromise = this;
      return (chainedPromise as Promise<any>);
    });

    this.catch = ((afterRejector, ...restArgs ) => {
      const chainedPromise = (_catch(afterRejector, ...restArgs ) as PassivePromise);
      chainedPromise.parentPromise = this;
      return (chainedPromise as Promise<any>);
    });

    if (this.finally) {
      const _finally = this.finally.bind(this);

      this.finally = ((afterResolver, ...restArgs) => {
        const chainedPromise = _finally(afterResolver, ...restArgs);
        chainedPromise.parentPromise = this;
        return chainedPromise;
      });
    }

    this.passiveResolve = passiveResolver;
    this.passiveReject = passiveRejector;

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
