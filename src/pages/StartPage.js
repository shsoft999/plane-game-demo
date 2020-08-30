import { defineComponent, h } from '@vue/runtime-core';
import startPageImg from "../../assets/startPage.jpg";
import startBtn from '../../assets/startBtn.png'

export default defineComponent({
    setup(props, { emit }) {
        const onClick = () => {
            //通知父组件更换页面
            emit("changePage", "GamePage");
        };

        return {
            onClick,
        }
    },
    render(ctx) {
        return h("Container", [
            h("Sprite", { imgPath: startPageImg }),
            h("Sprite", { imgPath: startBtn, x: 150, y: 150, interactive: true, onClick: ctx.onClick }),
        ]);
    },
});
