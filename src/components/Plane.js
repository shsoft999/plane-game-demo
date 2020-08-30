import { defineComponent, h, ref } from '@vue/runtime-core';
import planeImg from "../../assets/plane.png";

export default defineComponent({
    props: [ "planeData" ],
    setup(props) {
        return {
            x: props.planeData.x,
            y: props.planeData.y,
        }
    },
    render(ctx) {
        return h("Container", { x: ctx.x, y: ctx.y }, [
            h("Sprite", { imgPath: planeImg }),
        ]);
    },
});
