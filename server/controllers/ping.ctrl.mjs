export default class pingController {
    async get(req, reply) {
        
        await reply.type('application/json').code(200);
        
        return {
            message: 'PONG',
            development: this.config.development,
            time: new Date()
        };
    }
}