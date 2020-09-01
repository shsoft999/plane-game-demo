import { defineComponent, h, reactive, toRefs, onMounted, onUnmounted } from '@vue/runtime-core';
import { game } from '../game.js';
import Map from "../components/Map";
import Plane from "../components/Plane";
import EnemyPlane from '../components/EnemyPlane'
import Bullet from '../components/Bullet';
import Blast from '../components/Blast'
import { useKeyboardMove } from '../useKeyboardMove.js';
import TWEEN from '@tweenjs/tween.js';
import { hitTestObject } from '../../src/utils/hitTestRectangle.js'

export default defineComponent({
    setup() {
        // 我方飞机
        const planeInfo = reactive({ x: 600 / 2 - 60, y: 800, width: 180, height: 150 });
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
        const enemyPlaneInfo = reactive([{ x: 100, y: 100, width: 120, height: 90 }, { x: 300, y: 50, width: 120, height: 90 }]);

        // 爆炸数据
        const blasts = reactive([]);

        // 我方子弹
        const bullets = reactive([]);
        const handPressSpace = ((info) => {
            bullets.push({ ...info, width: 35, height: 64 });
            return
        });

        const handTicker = () => {
            // 移动我方子弹
            bullets.forEach((info) => {
                info.y -= 10;
            });

            // 移动敌人飞机
            // enemyPlaneInfo.forEach((info) => {
            //     info.y++;
            // });

            // 敌方飞机和我方子弹的碰撞检测
            bullets.forEach((bullet, bulletIndex) => {
                enemyPlaneInfo.forEach((enemy, enemyIndex) => {
                    const isIntersect = hitTestObject(bullet, enemy);
                    if (isIntersect) {
                        console.log(bulletIndex);
                        console.log(enemyIndex);
                        //blasts.push({ x: enemy.x, y: enemy.y });
                        enemyPlaneInfo.splice(enemyIndex, 1);
                        bullets.splice(bulletIndex, 1);
                    }
                });
            });

            TWEEN.update();
        };

        onMounted(() => {
            game.ticker.add(handTicker);
            console.log(game);
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
            blasts,
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

        const createBlast = () => {
            return ctx.blasts.map((info) => {
                return h(Blast, { blastData: info });
            });
        }

        return h("Container", [
            h(Map),
            ...createBullets(),
            ...createEnemyPlane(),
            ...createBlast(),
            h(Plane, { planeData: ctx.planeInfo, onPressSpace: ctx.handPressSpace }),
        ]);
    },
});
