const toExpress = (handler) => {
  return async (c) => {
    let body = {};
    if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
      try {
        body = await c.req.json();
      } catch (e) {
        try {
          body = await c.req.parseBody();
        } catch (_) {}
      }
    }

    const req = {
      body,
      params: c.req.param(),
      query: c.req.query(),
      headers: c.req.header() || {},
      user: c.get('user'),
    };

    let status = 200;
    let sentResponse = null;

    return new Promise(async (resolve, reject) => {
      const res = {
        status(code) {
          status = code;
          return this;
        },
        json(data) {
          sentResponse = c.json(data, status);
          resolve(sentResponse);
          return this;
        },
        send(data) {
          if (typeof data === 'object') {
            sentResponse = c.json(data, status);
          } else {
            sentResponse = c.text(data, status);
          }
          resolve(sentResponse);
          return this;
        }
      };

      try {
        await handler(req, res, () => {
          resolve(c.text('', status));
        });
      } catch (error) {
        console.error("Express handler wrapper error:", error);
        reject(error);
      }
    });
  };
};

const toExpressMiddleware = (middleware) => {
  return async (c, next) => {
    let body = {};
    if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
      try {
        body = await c.req.json();
      } catch (e) {
        try {
          body = await c.req.parseBody();
        } catch (_) {}
      }
    }

    const req = {
      body,
      params: c.req.param(),
      query: c.req.query(),
      headers: c.req.header() || {},
      user: c.get('user'),
    };

    let status = 200;
    let middlewareResponse = null;
    let nextCalled = false;

    const res = {
      status(code) {
        status = code;
        return this;
      },
      json(data) {
        middlewareResponse = c.json(data, status);
        return this;
      },
      send(data) {
        if (typeof data === 'object') {
          middlewareResponse = c.json(data, status);
        } else {
          middlewareResponse = c.text(data, status);
        }
        return this;
      }
    };

    await middleware(req, res, () => {
      nextCalled = true;
    });

    if (nextCalled) {
      if (req.user) {
        c.set('user', req.user);
      }
      return await next();
    }

    return middlewareResponse || c.json({ error: 'Unauthorized' }, status);
  };
};

module.exports = {
  toExpress,
  toExpressMiddleware
};
