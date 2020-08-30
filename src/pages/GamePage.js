import { defineComponent, h, reactive } from '@vue/runtime-core';
import Map from "../components/Map";
import Plane from "../components/Plane";

export default defineComponent({
    setup() {
        const planeInfo = reactive({ x: 300, y: 300 });
        const speed = 10;
        window.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "ArrowUp":
                    if (planeInfo.y > 0) {
                        planeInfo.y -= speed;
                    }
                    break;
                case "ArrowDown":
                    if (planeInfo.y < 400) {
                        planeInfo.y += speed;
                    }
                    break;
                case "ArrowLeft":
                    if (planeInfo.x > 0) {
                        planeInfo.x -= speed;
                    }
                    break;
                case "ArrowRight":
                    if (planeInfo.x < 320) {
                        planeInfo.x += speed;
                    }
                    break;
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
