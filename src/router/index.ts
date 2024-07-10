import { NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import { sleep } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import {
  onBeforeRouteUpdate,
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.app },
  },
  {
    path: '/',
    name: ROUTE_NAMES.app,
    component: () => import('@/pages/HomePage/index.vue'),
    redirect: () => router.resolve({ name: ROUTE_NAMES.appCapital }).path,
    children: [
      {
        path: 'capital',
        name: ROUTE_NAMES.appCapital,
        component: () => import('@/pages/HomePage/views/PublicPoolView.vue'),
        props: { poolId: 0 },
      },
      {
        path: 'community',
        name: ROUTE_NAMES.appCommunity,
        component: () => import('@/pages/HomePage/views/PrivatePoolView.vue'),
        props: { poolId: 1 },
      },
    ],
  },
  {
    path: '/mor20-ecosystem',
    children: [
      {
        path: '',
        name: ROUTE_NAMES.appMor20EcosystemMain,
        component: () => import('@/pages/Mor20Ecosystem/MainPage.vue'),
      },
      {
        path: 'protocol-creation',
        name: ROUTE_NAMES.appMor20EcosystemProtocolCreation,
        component: () =>
          import('@/pages/Mor20Ecosystem/ProtocolCreationPage.vue'),
        beforeEnter: async to => {
          const { provider } = useWeb3ProvidersStore()

          // waiting for the web3 provider to be initialized on page reload
          if (!provider.selectedAddress) {
            await sleep(1000)
          }

          if (!provider.selectedAddress)
            return { ...to, name: ROUTE_NAMES.appMor20EcosystemMain }
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

router.beforeEach((to, from) => {
  if (to.query.network) return
  return {
    ...to,
    query: { network: from.query.network || NETWORK_IDS.mainnet },
  }
})

export { onBeforeRouteUpdate, router, useRouter, useRoute }
