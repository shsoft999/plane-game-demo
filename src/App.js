import { defineComponent, h, ref, computed } from "@vue/runtime-core";
import StartPage from '../src/components/StartPage';
import GamePage from '../src/components/GamePage';

export default defineComponent({
    setup() {
        const currentPageName = ref("StartPage");
        // const currentPageName = ref("GamePage");

        const currentPage = computed(() => {
            if (currentPageName.value === "StartPage") {
                return StartPage;
            } else if (currentPageName.value === "GamePage") {
                return GamePage;
            }
        });

        return {
            currentPageName,
            currentPage,
        };
    },
    render(ctx) {
        return h("Container", [
            h(ctx.currentPage, {
                onChangePage(page) {
                    ctx.currentPageName = page;
                },
            }),
        ]);
    },
})