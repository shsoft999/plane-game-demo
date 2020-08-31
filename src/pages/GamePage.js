import { defineComponent, h, reactive, onMounted, onUnmounted } from '@vue/runtime-core';
import { game } from '../game.js';
import Map from "../components/Map";
import Plane from "../components/Plane";
import EnemyPlane from '../components/EnemyPlane'
import Bullet from '../components/Bullet';
import { useKeyboardMove } from '../useKeyboardMove.js';
import TWEEN from '@tweenjs/tween.js';

export default defineComponent({
    setup() {
        // 我方飞机
        const planeInfo = reactive({ x: 600 / 2 - 60, y: 800 });
        const speed = 7;

        // 平滑控制我方飞机移动
        const { x: selfPlaneX, y: selfPlaneY } = useKeyboardMove({
            x: planeInfo.x,
            y: planeInfo.y,
            speed: speed,
        });

        // 缓动出场
        var tween = new TWEEN.Tween({
            x: planeInfo.x,
            y: planeInfo.y,
        })
            .to({ y: planeInfo.y - 250 }, 500)
            .start();
        tween.onUpdate((obj) => {
            planeInfo.x = obj.x;
            planeInfo.y = obj.y;
        });

        // 敌人飞机
        const enemyPlaneInfo = reactive([{ x: 100, y: 100 }]);

        const handTicker = () => {
            // 移动我方子弹
            bullets.forEach((info) => {
                info.y--;
            });

            // 移动敌人飞机
            enemyPlaneInfo.forEach((info) => {
                info.y++;
            });

            TWEEN.update();
        };

        // 我方子弹
        const bullets = reactive([]);
        const handPressSpace = ((info) => {
            bullets.push({ ...info, width: 61, height: 99 });
            return
        });

        onMounted(() => {
            game.ticker.add(handTicker);
        });

        onUnmounted(() => {
            game.ticker.remove(handTicker);
        });

        // 我方飞机初始坐标
        planeInfo.x = selfPlaneX;
        planeInfo.y = selfPlaneY;

        return {
            planeInfo,
            bullets,
            handPressSpace,
            enemyPlaneInfo,
        };
    },
    render(ctx) {
        const createEnemyPlane = () => {
            return ctx.enemyPlaneInfo.map((info) => {
                return h(EnemyPlane, { planeData: info });
            });
        };

        const createBullets = () => {
            return ctx.bullets.map((info) => {
                return h(Bullet, { bulletData: info });
            });
        };

        return h("Container", [
            h(Map),
            h(Plane, { planeData: ctx.planeInfo, onPressSpace: ctx.handPressSpace }),
            ...createBullets(),
            ...createEnemyPlane(),
        ]);
    },
});
