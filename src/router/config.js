// 1. 定义路由组件.
// 也可以从其他文件导入
// const Home = { template: '<div>Homejjjjj</div>' };
import Demo1 from '../page/demo1/index.vue';
import Demo2 from '../page/demo2/index.vue';

const About = { template: '<div>About</div>' };

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: Demo1 },
  { path: '/demo2', component: Demo2 },
];
console.log(routes);
export default routes;
