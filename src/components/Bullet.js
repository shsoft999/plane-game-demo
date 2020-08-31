// 子弹
import { defineComponent, h, ref, toRefs } from '@vue/runtime-core';
import bulletImg from "../../assets/bullet.png";

export default defineComponent({
    props: ["bulletData"],
    setup(props) {
        const { x, y } = toRefs(props.bulletData);
        return {
            x,
            y,
        }
    },
    render(ctx) {
        return h("Container", { x: ctx.x, y: ctx.y }, [
            h("Sprite", { imgPath: bulletImg }),
        ]);
    },
});
