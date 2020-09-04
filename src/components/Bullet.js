// 子弹
import { defineComponent, h, ref, toRefs, watch } from '@vue/runtime-core';
import bulletImg1 from "../../assets/myb_1.png";
import bulletImg2 from "../../assets/BossBullet.png";

export const SelfBulletInfo = {
    width: 35,
    height: 65,
    rotation: 0,
    dir: -1,
};

export const EnemyBulletInfo = {
    width: 20,
    height: 20,
    rotation: 0,
    dir: 1,
};

export default defineComponent({
    props: ["x", "y", "id", "rotation", "dir"],
    setup(props) {
        const x = ref(props.x);
        const y = ref(props.y);

        watch(props, (newProps) => {
            x.value = newProps.x;
            y.value = newProps.y;
        });

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
            imgPath: ctx.dir === 1 ? bulletImg2 : bulletImg1
        });
    },
});
