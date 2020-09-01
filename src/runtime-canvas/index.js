import { createRenderer } from "@vue/runtime-core";
import { Texture, Container, Sprite, AnimatedSprite } from 'pixi.js'
import blowImg1 from "../../assets/blow1.png";

// 渲染器
const renderer = createRenderer({
    createElement(type) {
        let element;
        if (type == "Container") {
            element = new Container();
        } else if (type == "Sprite") {
            element = new Sprite();
        } else if (type == "AnimatedSprite") {
            const textureArray = [Texture.from(blowImg1)];
            element = new AnimatedSprite(textureArray);
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
        } else if (key == "imgPathArray") {
            const createTextures = () => {
                return nextValue.map((info) => {
                    return Texture.from(info);
                });
            };
            el.textures = createTextures();
            el.play();
        }
        else {
            el[key] = nextValue;
        }
    },
    // 处理注释
    createComment() { },
    // 获取父节点
    parentNode: (node) => node.parentNode,
    // 获取兄弟节点
    nextSibling: (node) => node.nextSibling,
    // 删除节点时调用
    remove(el) {
        console.log(el);
        const parent = el.parent;
        if (parent) {
            parent.removeChild(el);
        }
    },
});

export function createApp(rootComponent) {
    return renderer.createApp(rootComponent);
}