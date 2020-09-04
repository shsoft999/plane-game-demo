import { defineComponent, h, ref, toRefs, watch, onMounted, onUnmounted } from '@vue/runtime-core';
import enemyPlaneImg from "../../assets/ep_1.png";

export default defineComponent({
    props: ["x", "y"],
    setup(props, ctx) {
        const x = ref(props.x);
        const y = ref(props.y);

        watch(props, (newValue) => {
            x.value = newValue.x;
            y.value = newValue.y;
        });

        useAttack(ctx, x, y);
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

const useAttack = (ctx, x, y) => {
    // 发射子弹
    const attackInterval = 2000;
    let intervalId;
    onMounted(() => {
      intervalId = setInterval(() => {
        ctx.emit("attack", {
          x: x.value + 50,
          y: y.value + 89,
        });
      }, attackInterval);
    });
  
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  };
  