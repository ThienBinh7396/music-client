export default function log({ next, to, router }) {
    let u = localStorage.getItem('_u');
    let t = localStorage.getItem('_t');

    let logginPages = ['/register', '/login'];

    let check = logginPages.includes(to.path);


        if(check && u && t){
            return next('/');

        }
        if(!check && (!u || !t)){
            return next('/login');
        }

    return next();
}