import { Application } from "pixi.js";

// 初始化一个 canvas
export const game = new Application({
    width: 800,
    height: 950,
    antialias: true,
    transparent: false,
    resolution: 1,
});


// 将上面初始化的 canvas 添加到当前 html 的 body 内
document.body.append(game.view);

// 获取根容器
export function getRootContainer() {
    return game.stage;
}