import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'
import Layout from './../components/layouts/Layout.vue'
import Login from './../components/layouts/Login2.vue'
import Home from './../components/views/Home/Home.vue'
import Supervisor from './../components/views/Supervisor/Supervisor.vue'
import HRDApproval from './../components/views/HRD/HRD.vue'
import MyActivity from './../components/views/MyActivity/MyActivity.vue'

Vue.use(Router)

const router = new VueRouter({
    routes: [{
        path: '/login',
        name: 'Login',
        component: Login
    }, {
        path: '/',
        name: 'PengajuanCuti',
        component: Layout,
        meta: { requiresAuth: true },
        children: [{
            path: 'dashboard',
            name: 'Home',
            component: Home,
            meta: { requiresAuth: true }
        },
        {
            path: 'my-activity',
            name: 'MyActivity',
            component: MyActivity
        },
        {
            path: 'supervisor',
            name: 'Supervisor',
            component: Supervisor,
            meta: { requiresAuth: true }
        },
        {
            path: 'hrd',
            name: 'HRD',
            component: HRDApproval,
            meta: { requiresAuth: true }
        }
        ]
    }, {
        path: '*',
        name: 'Login',
        redirect: '/login'
    }]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !localStorage.getItem("sessionToken")) {
        next({
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        });
    } else {
        next();
    }
});

export default router