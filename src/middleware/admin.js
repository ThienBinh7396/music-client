export default function log({ next, to }) {
    let a = localStorage.getItem('_a');
    let atk = localStorage.getItem('_atk');

    let logginPages = ['/admin/login', '/admin/register'];

    let check = logginPages.includes(to.path);

    if (check && a && atk) {
        return next('/admin');
    }
    if (!check && (!a || !atk)) {
        return next('/admin/login');
    }

    return next();
}