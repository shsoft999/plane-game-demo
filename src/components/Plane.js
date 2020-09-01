import { defineComponent, h, ref, toRefs } from '@vue/runtime-core';
import planeImg from "../../assets/my_1.png";

export default defineComponent({
    props: ["planeData"],
    setup(props, { emit }) {
        window.addEventListener("keydown", (e) => {
            if (e.code == "Space") {
                //通知父组件按了空格
                emit("pressSpace", { x: props.planeData.x + 55, y: props.planeData.y })
            }
        });

        const { x, y } = toRefs(props.planeData);
        return {
            x,
            y,
        }
    },
    render(ctx) {
        return h("Container", { x: ctx.x, y: ctx.y }, [
            h("Sprite", { imgPath: planeImg }),
        ]);
    },
});
