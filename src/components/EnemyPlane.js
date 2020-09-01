import { defineComponent, h, toRefs } from '@vue/runtime-core';
import enemyPlaneImg from "../../assets/ep_1.png";

export default defineComponent({
    props: ["planeData"],
    setup(props, { emit }) {
        const { x, y } = toRefs(props.planeData);
        return {
            x,
            y,
        }
    },
    render(ctx) {
        return h("Container", { x: ctx.x, y: ctx.y }, [
            h("Sprite", { imgPath: enemyPlaneImg })
        ]);
    },
});
