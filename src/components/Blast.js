// 爆炸动画
import { defineComponent, h, toRefs } from '@vue/runtime-core';
import blowImg1 from "../../assets/blow1.png";
import blowImg2 from "../../assets/blow2.png";
import blowImg3 from "../../assets/blow3.png";
import blowImg4 from "../../assets/blow4.png";
import blowImg5 from "../../assets/blow5.png";
import blowImg6 from "../../assets/blow6.png";
import blowImg7 from "../../assets/blow7.png";
import blowImg8 from "../../assets/blow8.png";
import blowImg9 from "../../assets/blow9.png";

export default defineComponent({
    props: ["blastData"],
    setup(props) {
        const { x, y } = toRefs(props.blastData);
        return {
            x,
            y,
        }
    },
    render(ctx) {
        return h("Container", { x: ctx.x, y: ctx.y }, [
            h("AnimatedSprite", {
                imgPathArray: [blowImg1, blowImg2, blowImg3, blowImg4, blowImg5, blowImg6, blowImg7, blowImg8, blowImg9],
            }),
        ]);
    },
});
