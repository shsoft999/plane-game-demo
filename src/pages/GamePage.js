import { defineComponent, h, reactive, toRefs, onMounted, onUnmounted } from '@vue/runtime-core';
import { game } from '../game.js';
import Map from "../components/Map";
import Plane from "../components/Plane";
import EnemyPlane from '../components/EnemyPlane'
import Bullet, { SelfBulletInfo, EnemyBulletInfo } from '../components/Bullet';
import Blast from '../components/Blast'
import { useKeyboardMove } from '../useKeyboardMove.js';
import TWEEN from '@tweenjs/tween.js';
import { hitTestObject } from '../../src/utils/hitTestRectangle.js'

export default defineComponent({
    setup() {
        // 敌人飞机
        const enemyPlanes = enemyPlane();

        // 我方飞机
        const selfPlane = usePlane();

        // 我方子弹
        const { destroySelfBullet } = useBullets();

        // 子弹数据
        const selfBullets = reactive([]);

        // 创建子弹
        const createSelfBullet = ({ x, y }) => {
            console.log("createBullets");
            console.log(x);
            console.log(y);
            console.log(selfBullets);
            const id = createHashCode();
            const width = SelfBulletInfo.width;
            const height = SelfBulletInfo.height;
            const rotation = SelfBulletInfo.rotation;
            const dir = SelfBulletInfo.dir;
            selfBullets.push({ x, y, id, width, height, rotation, dir });
        };

        // const handTicker = () => {
        //     // 移动我方子弹
        //     bullets.forEach((info) => {
        //         info.y -= 10;
        //     });

        //     // 移动敌人飞机
        //     // enemyPlanes.forEach((info) => {
        //     //     info.y++;
        //     // });

        //     // 敌方飞机和我方子弹的碰撞检测
        //     bullets.forEach((bullet, bulletIndex) => {
        //         enemyPlanes.forEach((enemy, enemyIndex) => {
        //             const isIntersect = hitTestObject(bullet, enemy);
        //             if (isIntersect) {
        //                 // blasts.push({ x: enemy.x, y: enemy.y });
        //                 // console.log(blasts);
        //                 enemyPlanes.splice(enemyIndex, 1);
        //                 bullets.splice(bulletIndex, 1);
        //             }
        //         });
        //     });
        // };

        // 爆炸数据
        const blasts = reactive([]);

        // 战斗逻辑
        useFighting({ selfPlane, selfBullets, enemyPlanes });

        return {
            selfPlane,
            selfBullets,
            createSelfBullet,
            destroySelfBullet,
            enemyPlanes,
            blasts,
        };
    },
    render(ctx) {
        const createEnemyPlane = () => {
            return ctx.enemyPlanes.map((info) => {
                return h(EnemyPlane, { planeData: info });
            });
        };

        const createBlast = () => {
            return ctx.blasts.map((info) => {
                return h(Blast, { blastData: info });
            });
        }

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
            ...createEnemyPlane(),
            ...createBlast(),
            h(Plane, { x: ctx.selfPlane.x, y: ctx.selfPlane.y, onPressSpace: ctx.createSelfBullet }),
        ]);
    },
});

// 乱人飞机
const enemyPlane = () => {
    // 生产敌机
    const createEnemyPlaneData = (x) => {
        return {
            x,
            y: 50,
            width: 120,
            height: 90,
        };
    };

    const enemyPlanes = reactive([]);
    setInterval(() => {
        const x = Math.floor((1 + 700) * Math.random());
        enemyPlanes.push(createEnemyPlaneData(x));
    }, 2000);

    return enemyPlanes;
}

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
        console.log("createBullets");
        console.log(x);
        console.log(y);
        console.log(selfBullets);
        const id = createHashCode();
        const width = SelfBulletInfo.width;
        const height = SelfBulletInfo.height;
        const rotation = SelfBulletInfo.rotation;
        const dir = SelfBulletInfo.dir;
        selfBullets.push({ x, y, id, width, height, rotation, dir });
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
    const selfPlane = reactive({ x: 600 / 2 - 60, y: 800, width: 180, height: 150 });
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
    enemyPlanes }) => {

    const handleTicker = () => {
        // 移动我方子弹
        moveBullets(selfBullets);

        // 先遍历自己所有的子弹
        selfBullets.forEach((bullet, selfIndex) => {
            // 检测我方子弹是否碰到了敌机
            enemyPlanes.forEach((enemyPlane, enemyPlaneIndex) => {
                const isIntersect = hitTestObject(bullet, enemyPlane);
                if (isIntersect) {
                    selfBullets.splice(selfIndex, 1);

                    //   // 敌机需要减血
                    //   enemyPlane.life--;
                    //   if (enemyPlane.life <= 0) {
                    //     // todo
                    //     // 可以让实例发消息过来在销毁
                    //     // 因为需要在销毁之前播放销毁动画
                    //     enemyPlanes.splice(enemyPlaneIndex, 1);
                    //   }
                }
            });

            // 检测是否碰到了敌方子弹
            // enemyPlaneBullets.forEach((enemyBullet, enemyBulletIndex) => {
            //     const isIntersect = hitTestRectangle(bullet, enemyBullet);
            //     if (isIntersect) {
            //         selfBullets.splice(selfIndex, 1);
            //         enemyPlaneBullets.splice(enemyBulletIndex, 1);
            //     }
            // });
        });
    };

    onUnmounted(() => {
        game.ticker.remove(handleTicker);
    });

    onMounted(() => {
        game.ticker.add(handleTicker);
    });
};

// 移动子弹
const bulletSpeed = 7;
const moveBullets = (bullets) => {
    bullets.forEach((bullet, index) => {
        const dir = bullet.dir;
        bullet.y += bulletSpeed * dir;
        if (isOverBorder(bullet.y)) {
            bullets.splice(index, 1);
            console.log("moveBullets");
        }
    });
};

// 画布高度 + 50，子弹超出屏幕销毁
const bottomLine = 950 + 50;
const topLine = -100;
const isOverBorder = (val) => {
    if (val > bottomLine) {
        return true;
    }

    if (val < topLine) {
        return true;
    }

    return false;
};