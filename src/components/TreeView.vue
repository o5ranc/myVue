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

<script setup lang="ts">
// <script setup> 컴포넌트는 파일 이름(TreeView)으로 자기 자신을 참조할 수 있어서
// 템플릿의 <tree-view>가 재귀적으로 동작합니다.
export interface TreeItem {
  name: string
  type: 'folder' | 'file'
  isOpen?: boolean
  children?: TreeItem[]
}

defineProps<{
  items: TreeItem[]
}>()

function toggleItem(index: number) {
  // Vue 3에서는 this.$set 없이 직접 대입하면 반응형으로 동작합니다.
  // const item = props.items[index]
  // if (item.children) {
  //   item.isOpen = !item.isOpen
  // }
  console.log('### ran toggleItem : ', index)
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
