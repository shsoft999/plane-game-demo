// 子弹
import { defineComponent, h, ref, toRefs } from '@vue/runtime-core';
import bulletImg from "../../assets/myb_1.png";

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
        return h("Sprite", { x: ctx.x, y: ctx.y, imgPath: bulletImg });
    },
});
