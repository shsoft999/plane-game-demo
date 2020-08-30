import { defineComponent, h, ref } from '@vue/runtime-core';
import mapImg from "../../assets/map.jpg";
import { game } from '../game'

export default defineComponent({
    setup() {
        const viewHeight = 1075;
        const mapY1 = ref(0);
        const mapY2 = ref(viewHeight);

        const speed = 5;
        // setInterval(() => {
        //     console.log("interval");

        //     mapY1.value += speed;
        //     mapY2.value += speed;

        //     if (mapY1.value >= viewHeight) {
        //         mapY1.value = -viewHeight;
        //     }
        //     if (mapY2.value >= viewHeight) {
        //         mapY2.value = -viewHeight;
        //     }
        // }, 0);

        // ticker 是 pixijs 中的永真循环，利用网页刷新频率
        game.ticker.add(() => {
            mapY1.value += speed;
            mapY2.value += speed;

            if (mapY1.value >= viewHeight) {
                mapY1.value = -viewHeight;
            }
            if (mapY2.value >= viewHeight) {
                mapY2.value = -viewHeight;
            }
        });

        return {
            mapY1,
            mapY2,
        };
    },
    render(ctx) {
        return h("Container", [
            h("Sprite", { imgPath: mapImg, y: ctx.mapY1 }),
            h("Sprite", { imgPath: mapImg, y: ctx.mapY2 })
        ]);
    },
});
