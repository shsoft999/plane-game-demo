import { createRenderer } from "@vue/runtime-core";
import { Texture, Container, Sprite } from 'pixi.js'

// 渲染器
const renderer = createRenderer({
    createElement(type) {
        let element;
        if (type == "Container") {
            element = new Container();
        } else if (type == "Sprite") {
            element = new Sprite();
        }

        return element;
    },
    insert(el, parent) {
        parent.addChild(el);
    },
    patchProp(el, key, prevValue, nextValue) {
        if (key == "imgPath") {
            el.texture = Texture.from(nextValue);
        } else if (key == "onClick") {
            el.on("pointertap", nextValue);
        } 
        else {
            el[key] = nextValue;
        }
    },
    // 处理注释
    createComment() { },
    // 获取父节点
    parentNode() { },
    // 获取兄弟节点
    nextSibling() { },
    // 删除节点时调用
    remove(el) {
        const parent = el.parent;
        if (parent) {
            parent.removeChild(el);
        }
    },
});

export function createApp(rootComponent) {
    return renderer.createApp(rootComponent);
}