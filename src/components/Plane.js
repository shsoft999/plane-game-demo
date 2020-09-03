import { defineComponent, h, ref, toRefs } from '@vue/runtime-core';
import planeImg from "../../assets/my_1.png";

export default defineComponent({
    props: ["x", "y"],
    setup(props, { emit }) {
        const x = ref(props.x);
        const y = ref(props.y);

        console.log(props);
        watch(props, (newProps) => {
            x.value = newProps.x;
            y.value = newProps.y;
        });

        window.addEventListener("keydown", (e) => {
            if (e.code == "Space") {
                //　通知父组件按了空格
                emit("pressSpace", { x: x.value, y: y.value })
            }
        });

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
