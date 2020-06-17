import admin from '@/middleware/admin'


export default [{
        path: '/admin',
        name: "AdminLayout",
        component: () =>
            import ('@/views/admin/layouts/MainLayout'),
        redirect: '/admin/dashboard',
        meta: {
            middleware: admin
        },
        children: [{
                path: '/admin/dashboard',
                name: 'AdminDashboard',
                component: () =>
                    import ('@/views/admin/pages/Dashboard'),
                meta: {
                    middleware: admin
                }
            },
            {
                path: '/admin/user',
                name: 'AdminUser',
                component: () =>
                    import ('@/views/admin/pages/User'),
                meta: {
                    middleware: admin
                }
            },
            {
                path: '/admin/singer',
                name: 'AdminSinger',
                component: () =>
                    import ('@/views/admin/pages/Singer'),
                meta: {
                    middleware: admin
                }
            },
            {
                path: '/admin/singer/control/:data',
                name: 'AdminSingerControl',
                component: () =>
                    import ('@/views/admin/pages/ControlSinger'),
                meta: {
                    middleware: admin
                }
            },
            {
                path: '/admin/music',
                name: 'AdminMusic',
                component: () =>
                    import ('@/views/admin/pages/Music'),
                meta: {
                    middleware: admin
                }
            },
            {
                path: '/admin/music/control/:data',
                name: 'AdminMusicControl',
                component: () =>
                    import ('@/views/admin/pages/ControlMusic'),
                meta: {
                    middleware: admin
                }
            },
            {
                path: '/admin/playlist',
                name: 'AdminPlaylist',
                component: () =>
                    import ('@/views/admin/pages/Playlist'),
                meta: {
                    middleware: admin
                }
            },
            {
                path: '/admin/genre',
                name: 'AdminGenre',
                component: () =>
                    import ('@/views/admin/pages/Genre'),
                meta: {
                    middleware: admin
                }
            }
        ]
    },
    {
        name: "AdminLogin",
        path: '/admin/login',
        component: () =>
            import ('@/views/components/LoginLayout'),
        meta: {
            middleware: admin
        }
    },
    {
        name: "AdminRegister",
        path: '/admin/register',
        component: () =>
            import ('@/views/components/LoginLayout'),
        meta: {
            middleware: admin
        }
    }
]