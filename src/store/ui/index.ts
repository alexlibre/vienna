import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore('uiStore', () => {
    const sidebarOpened = ref(false)
    const defaultPageSize = ref(25)

    const toggleSidebarOpen = () => {
        sidebarOpened.value = !sidebarOpened.value
    }
    const setDefaultPageSize = (newPageSize: string) => {
        defaultPageSize.value = +newPageSize
    }

    return {
        sidebarOpened,
        defaultPageSize,
        toggleSidebarOpen,
        setDefaultPageSize
    }
}, {
    persist: true
}) 