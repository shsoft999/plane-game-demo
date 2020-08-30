import App from "./src/App";

//下面两个重构包装结果
import { createApp } from './src/runtime-canvas';
import { getRootContainer } from './src/game';

// 根组件
// mount 需要一个根容器
// 以 canvas 根容器为目标
// 因为 canvas api 难用，这里用 pixijs 一个游戏引擎库，还有类式的 egret 这国内的库
// 从虚拟结点 vnode 生成真实的 element（element 有可能是 dom、canvas） 接下来会把element添加到根容器内
// 通过 h() 生成虚拟结点
// 流程 h() -> vnode -> element(dom、canvas) -> 添加到根容器内
createApp(App).mount(getRootContainer());