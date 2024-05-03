<template>
  <Teleport :to="props.teleportTo">
    <Transition name="modal">
      <div tabindex="0" ref="modal-backdrop" class="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50"
        v-if="props.showModal" @keydown.esc="emit('onEscape')">
        <div :class="`min-h-screen flex ${props.itemsPosition} ${props.justify} ${props.marginTop}`">
          <div
            :class="`flex flex-col p-6 rounded-md ${props.width} ${props.height} bg-white pb-5 relative drop-shadow-xl`"
            role="dialog" aria-modal="true">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  width: any,
  height: any,
  showModal: boolean,
  teleportTo?: string,
  justify?: any,
  itemsPosition?: any,
  marginTop?: any
}

const props = withDefaults(defineProps<Props>(), {
  teleportTo: 'body',
  justify: 'justify-center',
  itemsPosition: 'items-center',
  marginTop: ''
})

const emit = defineEmits(['onEscape'])
</script>

<style lang="scss" scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.30s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>