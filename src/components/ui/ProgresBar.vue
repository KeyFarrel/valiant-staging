<template>
    <div class="progress-bar">
        <div class="bar" :style="{ width: percentage + '%', backgroundColor: color }"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        max: {
            type: Number,
            default: 100
        },
        current: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: '#4caf50'
        }
    },
    computed: {
        percentage() {
            if (this.current === 0) {
                return 0;
            }
            return (this.current / this.max) * 100;
        }
    }
});
</script>

<style scoped>
.progress-bar {
    @apply bg-gray-200 rounded-lg h-2 w-9/12;
}

.bar {
    @apply h-full rounded-lg;
}
</style>
