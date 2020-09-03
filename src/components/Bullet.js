// 子弹
import { defineComponent, h, ref, toRefs } from '@vue/runtime-core';
import bulletImg from "../../assets/myb_1.png";

export const SelfBulletInfo = {
    width: 35,
    height: 64,
    rotation: 0,
    dir: -1,
};

export const EnemyBulletInfo = {
    width: 61,
    height: 99,
    rotation: 0,
    dir: 1,
};

export default defineComponent({
    props: ["x", "y", "id", "rotation", "dir"],
    setup(props) {
        const x = ref(props.x);
        const y = ref(props.y);

        console.log(props);
        // debugger
        // watch(props.x, (newProps) => {
        //     x.value = newProps.x;
        // });
        // watch(props.y, (newProps) => {
        //     y.value = newProps.y;
        // });

        return {
            x,
            y,
            rotation: props.rotation,
            dir: props.dir
        }
    },
    render(ctx) {
        return h("Sprite", {
            x: ctx.x,
            y: ctx.y,
            rotation: ctx.rotation,
            imgPath: ctx.dir === 1 ? bulletImg : bulletImg
        });
    },
});
