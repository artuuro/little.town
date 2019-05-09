import Loader from './server/Loader';

const instance = new Loader({
    'modules': [
        'ROUTER', 
        'STATIC', 
        'DATA'
    ]
});

instance.run();

