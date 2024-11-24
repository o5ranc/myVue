<template>
  <div class="source-tree-view">
    <tree-view :items="treeData" />
  </div>
</template>

<script>
import TreeView from '@/components/TreeView.vue'

export default {
  name: 'SourceTreeView',
  components: {
    TreeView,
  },
  data() {
    return {
      treeData: [
        {
          name: '.idea',
          type: 'folder',
          isOpen: false,
          children: [],
        },
        {
          name: '.vscode',
          type: 'folder',
          isOpen: false,
          children: [],
        },
        {
          name: 'public',
          type: 'folder',
          isOpen: true,
          children: [
            {
              name: 'img',
              type: 'folder',
              isOpen: false,
              children: [],
            },
            {
              name: 'workers',
              type: 'folder',
              isOpen: false,
              children: [],
            },
            {
              name: 'favicon.ico',
              type: 'file',
            },
            {
              name: 'index.html',
              type: 'file',
            },
            {
              name: 'logo192.png',
              type: 'file',
            },
            {
              name: 'logo512.png',
              type: 'file',
            },
            {
              name: 'manifest.json',
              type: 'file',
            },
            {
              name: 'robots.txt',
              type: 'file',
            },
          ],
        },
        {
          name: 'src',
          type: 'folder',
          isOpen: false,
          children: [],
        },
        {
          name: '.gitignore',
          type: 'file',
        },
        {
          name: 'README.md',
          type: 'file',
        },
        {
          name: 'package.json',
          type: 'file',
        },
        {
          name: 'yarn.lock',
          type: 'file',
        },
      ],
    }
  },
}
</script>

<style scoped>
.source-tree-view {
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
