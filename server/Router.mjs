import Handler from './Handler';
import * as Middleware from './middlewares';

export default class Router {
    constructor (server, routes) {
        this.server = server;
        this.routes = routes;
    }

    async link() {
        try {
            for (let route of this.routes) {
                const handler = new Handler(route.controller, this.server);

                route.path = route.top ? `/api/${route.path}` : `/${route.path}`;
                route.handler = handler[route.method.toLowerCase()];

                if (route.middlewares) {
                    this.server.log.info(`Loading route [${route.path}] middlewares...`);
                    route.beforeHandler = async (request, reply) => {
                        let queue = [];
                        
                        // We would like to map that middlewares to a queue in order as from config
                        for (const item of route.middlewares) {
                            const instance = new Middleware[item](this.server, request, reply);

                            this.server.log.info(`Running middleware [${item}]`);
                            queue.push(instance.handle());
                        }

                        const runQueue = await Promise.all(queue);

                        console.log(runQueue);

                        // If one of promises will fail it should ideally return an error 
                        return Promise.all(queue); 
                    };
                }

                await this.server.route(route);

                this.server.log.info(`Route [${route.path}] linked to [${route.controller}]->(${route.method})`);
            }
        } catch (error) {
            throw error; 
        }
    }
}