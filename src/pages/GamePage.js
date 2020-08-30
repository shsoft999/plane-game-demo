import { defineComponent, h, reactive } from '@vue/runtime-core';
import Map from "../components/Map";
import Plane from "../components/Plane";

export default defineComponent({
    setup() {
        const planeInfo = reactive({ x: 300, y: 300 });

        window.addEventListener("keydown", (e) => {
            if (e.code == "ArrowUp") {
                console.log("up");
            }
        });

        return {
            planeInfo,
        };
    },
    render(ctx) {
        return h("Container", [
            h(Map),
            h(Plane, { planeData: ctx.planeInfo }),
        ]);
    },
});
