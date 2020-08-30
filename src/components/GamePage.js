import { defineComponent, h } from '@vue/runtime-core';
import mapImg from "../../assets/map.jpg";

export default defineComponent({
    render() {
        return h("Container", [
            h("Sprite", { imgPath: mapImg })
        ]);
    },
});
