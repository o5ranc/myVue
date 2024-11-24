<template>
  <div class="tree-view">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="tree-item"
    >
      <div
        class="tree-content"
        @click="toggleItem(index)"
      >
        <span
          class="toggle-icon"
          :class="{ 'is-open': item.children && item.isOpen }"
        >
          <span
            v-if="item.children"
            class="wa-arrow"
          >
            <span class="line-1"></span>
            <span class="line-2"></span>
          </span>
          <span v-else></span>
        </span>
        <span class="item-icon">{{ item.type === 'folder' ? '📁' : '📄' }}</span>
        <span class="item-name">{{ item.name }}</span>
      </div>
      <div
        v-if="item.children && item.isOpen"
        class="tree-children"
      >
        <tree-view :items="item.children" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeView',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    toggleItem(index) {
      // if (this.items[index].children) {
      //   this.$set(this.items[index], 'isOpen', !this.items[index].isOpen)
      // }
      console.log('### ran toggleItem : ', index)
    },
  },
}
</script>

<style scoped>
.tree-view {
  font-family: Arial, sans-serif;
  padding-left: 20px;
}

.tree-item {
  margin: 4px 0;
}

.tree-content {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.toggle-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 4px;
}

.wa-arrow {
  position: relative;
  width: 12px;
  height: 12px;
}

.wa-arrow .line-1,
.wa-arrow .line-2 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 1px;
  background-color: #666;
  transition: transform 0.2s ease;
}

.wa-arrow .line-1 {
  transform: translate(-50%, -50%) rotate(90deg);
}

.wa-arrow .line-2 {
  transform: translate(-50%, -50%);
}

.toggle-icon.is-open .wa-arrow .line-1 {
  transform: translate(-50%, -50%) rotate(180deg);
  opacity: 0;
}

.dot {
  width: 3px;
  height: 3px;
  background-color: #666;
  border-radius: 50%;
}

.item-icon {
  margin-right: 4px;
}

.tree-children {
  margin-left: 20px;
}
</style>
