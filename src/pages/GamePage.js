import { defineComponent, h, reactive, onMounted, onUnmounted } from '@vue/runtime-core';
import { game } from '../game.js';
import Map from "../components/Map";
import Plane from "../components/Plane";
import EnemyPlane from '../components/EnemyPlane'
import Bullet, { SelfBulletInfo, EnemyBulletInfo } from '../components/Bullet';
import Blast from '../components/Blast'
import { useKeyboardMove } from '../useKeyboardMove.js';
import TWEEN from '@tweenjs/tween.js';
import { hitTestObject } from '../../src/utils/hitTestRectangle.js'
import { moveBullets } from '../moveBullets.js'
import { moveEnemyPlane } from '../moveEnemyPlane.js'

export default defineComponent({
    setup() {
        // 敌方飞机
        const enemyPlanes = enemyPlane();

        // 敌方子弹
        const { enemyBullets, createEnemyBullet } = useEnemyBullets();

        // 我方飞机
        const selfPlane = usePlane();

        // 我方子弹
        const { selfBullets, createSelfBullet, destroySelfBullet } = useBullets();

        // 爆炸数据
        const blasts = reactive([]);

        // 战斗逻辑
        useFighting({ selfPlane, selfBullets, enemyBullets, enemyPlanes, blasts });

        return {
            selfPlane,
            selfBullets,
            enemyPlanes,
            enemyBullets,
            createSelfBullet,
            createEnemyBullet,
            destroySelfBullet,
            blasts,
        };
    },
    render(ctx) {
        const createEnemyPlane = (info, index) => {
            return h(EnemyPlane, {
                key: "EnemyPlane" + index,
                x: info.x,
                y: info.y,
                height: info.height,
                width: info.width,
                onAttack({ x, y }) {
                    ctx.createEnemyBullet(x, y);
                },
            });
        };

        const createBlast = (info) => {
            return h(Blast, { x: info.x, y: info.y });
        };

        const createBullet = (info) => {
            return h(Bullet, {
                key: "Bullet" + info.id,
                x: info.x,
                y: info.y,
                id: info.id,
                width: info.width,
                height: info.height,
                rotation: info.rotation,
                dir: info.dir,
                onDestroy({ id }) {
                    ctx.destroySelfBullet(id);
                },
            });
        };

        return h("Container", [
            h(Map),
            ...ctx.selfBullets.map(createBullet),
            ...ctx.enemyBullets.map(createBullet),
            ...ctx.enemyPlanes.map(createEnemyPlane),
            ...ctx.blasts.map(createBlast),
            h(Plane, { x: ctx.selfPlane.x, y: ctx.selfPlane.y, onPressSpace: ctx.createSelfBullet }),
        ]);
    },
});

// 敌人飞机
const enemyPlane = () => {
    // 生产敌机
    const createEnemyPlaneData = (x) => {
        return {
            x,
            y: 50,
            width: 134,
            height: 89,
        };
    };

    // 敌人飞机数据
    const enemyPlanes = reactive([]);

    setInterval(() => {
        const x = Math.floor((1 + 700) * Math.random());
        enemyPlanes.push(createEnemyPlaneData(x));
    }, 2000);

    return enemyPlanes;
}

// 敌人子弹
const useEnemyBullets = () => {
    // 敌军子弹数据
    const enemyBullets = reactive([]);

    const createEnemyBullet = (x, y) => {
        const id = createHashCode();
        const width = EnemyBulletInfo.width;
        const height = EnemyBulletInfo.height;
        const rotation = EnemyBulletInfo.rotation;
        const dir = EnemyBulletInfo.dir;
        enemyBullets.push({ x, y, id, width, height, rotation, dir });
    };

    return {
        enemyBullets,
        createEnemyBullet,
    };
};

// 我方子弹
let hashCode = 0;
const createHashCode = () => {
    return hashCode++;
};
const useBullets = () => {
    // 子弹数据
    const selfBullets = reactive([]);

    // 创建子弹
    const createSelfBullet = ({ x, y }) => {
        const id = createHashCode();
        const width = SelfBulletInfo.width;
        const height = SelfBulletInfo.height;
        const rotation = SelfBulletInfo.rotation;
        const dir = SelfBulletInfo.dir;
        selfBullets.push({ x: x, y: y, id, width, height, rotation, dir });
    };

    // 销毁子弹
    const destroySelfBullet = (id) => {
        const index = selfBullets.findIndex((info) => info.id == id);
        if (index !== -1) {
            selfBullets.splice(index, 1);
        }
    };

    return {
        selfBullets,
        createSelfBullet,
        destroySelfBullet,
    };
};

// 我方飞机
const usePlane = () => {
    const selfPlane = reactive({ x: 600 / 2 - 60, y: 800, width: 182, height: 120 });
    const speed = 7;

    // 平滑控制我方飞机移动
    const { x: selfPlaneX, y: selfPlaneY } = useKeyboardMove({
        x: selfPlane.x,
        y: selfPlane.y,
        speed: speed,
    });

    // 缓动出场
    var tween = new TWEEN.Tween({
        x: selfPlane.x,
        y: selfPlane.y,
    })
        .to({ y: selfPlane.y - 250 }, 500)
        .start();
    tween.onUpdate((obj) => {
        selfPlane.x = obj.x;
        selfPlane.y = obj.y;
    });

    const handleTicker = () => {
        TWEEN.update();
    };

    onMounted(() => {
        game.ticker.add(handleTicker);
    });

    onUnmounted(() => {
        game.ticker.remove(handleTicker);
    });

    // 我方飞机初始坐标
    selfPlane.x = selfPlaneX;
    selfPlane.y = selfPlaneY;

    return selfPlane;
}

// 战斗逻辑
const useFighting = ({
    selfPlane,
    selfBullets,
    enemyBullets,
    enemyPlanes,
    blasts }) => {

    const handleTicker = () => {
        // 移动我方子弹
        moveBullets(selfBullets);
        // 移动敌人子弹
        moveBullets(enemyBullets);
        // 移动敌人飞机
        moveEnemyPlane(enemyPlanes);

        // 先遍历自己所有的子弹
        selfBullets.forEach((bullet, selfIndex) => {
            // 检测我方子弹是否碰到了敌机
            enemyPlanes.forEach((enemyPlane, enemyPlaneIndex) => {
                const isIntersect = hitTestObject(bullet, enemyPlane);
                if (isIntersect) {
                    blasts.push({ x: enemyPlane.x, y: enemyPlane.y, id: createHashCode() });

                    selfBullets.splice(selfIndex, 1);
                    enemyPlanes.splice(enemyPlaneIndex, 1);
                    // // 敌机需要减血
                    // enemyPlane.life--;
                    // if (enemyPlane.life <= 0) {
                    //     // todo
                    //     // 可以让实例发消息过来在销毁
                    //     // 因为需要在销毁之前播放销毁动画
                    //     enemyPlanes.splice(enemyPlaneIndex, 1);
                    // }
                }
            });

            // 检测是否碰到了敌方子弹
            enemyBullets.forEach((enemyBullet, enemyBulletIndex) => {
                const isIntersect = hitTestObject(bullet, enemyBullet);
                if (isIntersect) {
                    selfBullets.splice(selfIndex, 1);
                    enemyBullets.splice(enemyBulletIndex, 1);
                }
            });
        });
    };

    onUnmounted(() => {
        game.ticker.remove(handleTicker);
    });

    onMounted(() => {
        game.ticker.add(handleTicker);
    });
};
