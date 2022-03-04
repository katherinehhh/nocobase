import Application from './application';

export class ErrorHandler {
  handlers = [];

  constructor(app: Application) {}

  register(guard: (err) => boolean, render: (err, ctx) => void) {
    this.handlers.push({
      guard,
      render,
    });
  }

  defaultHandler(err, ctx) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      errors: [
        {
          message: err.message,
          code: err.code,
        },
      ],
    };
  }

  middleware() {
    const self = this;

    return async function errorHandler(ctx, next) {
      try {
        await next();
      } catch (err) {
        for (const handler of self.handlers) {
          if (handler.guard(err)) {
            return handler.render(err, ctx);
          }
        }

        self.defaultHandler(err, ctx);
        console.error(err);
      }
    };
  }
}