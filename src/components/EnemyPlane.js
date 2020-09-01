import { defineComponent, h, ref, toRefs } from '@vue/runtime-core';
import enemyPlaneImg from "../../assets/ep_1.png";

export default defineComponent({
    props: ["planeData"],
    setup(props, { emit }) {
        // const { x, y } = toRefs(props.planeData);
        const x = ref(props.planeData.x);
        const y = ref(props.planeData.y);
        return {
            x,
            y,
        }
    },
    render(ctx) {
        return h("Sprite", { x: ctx.x, y: ctx.y, imgPath: enemyPlaneImg });
    },
});
