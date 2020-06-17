import logClient from '@/middleware/logClient'

export default [{
        path: '/',
        name: 'Client',
        component: () =>
            import ('@/views/client/layouts/MainLayout'),
        redirect: '/home',
        meta: {
            middleware: logClient
        },
        children: [{
                path: '/home',
                name: "Home",
                component: () =>
                    import ('@/views/client/pages/HomePage'),
                meta: {
                    middleware: logClient
                }
            },
            {
                path: '/profile',
                name: "Profile",
                component: () =>
                    import ('@/views/client/pages/Profile'),
                meta: {
                    middleware: logClient
                }
            },
            {
                path: '/playlistCategory/:data',
                name: 'PlaylistCategory',
                component: () =>
                    import ('@/views/client/pages/PlaylistCategory'),
                meta: {
                    middleware: logClient
                }
            },
            {
                path: '/playlist/:data',
                name: 'Playlist',
                component: () =>
                    import ('@/views/client/pages/Playlist'),
                meta: {
                    middleware: logClient
                }
            },
            {
                path: '/music/:data',
                name: 'Music',
                component: () =>
                    import ('@/views/client/pages/Music'),
                meta: {
                    middleware: logClient
                }
            },
            {
                path: '/singer/:data',
                name: 'Singer',
                component: () =>
                    import ('@/views/client/pages/Singer'),
                meta: {
                    middleware: logClient
                }
            },
            {
                path: '/contact',
                name: "Contact",
                component: () =>
                    import ('@/views/client/pages/Contact'),
                meta: {
                    middleware: logClient
                }
            }
        ]

    },
    {
        name: "ClientLogin",
        path: '/login',
        component: () =>
            import ('@/views/components/LoginLayout'),
        meta: {
            middleware: logClient
        }
    },
    {
        name: "ClientRegister",
        path: '/register',
        component: () =>
            import ('@/views/components/LoginLayout'),
        meta: {
            middleware: logClient
        }
    },
]