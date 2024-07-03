<template>
  <div id="example-5" class="demo">
    v-model select -
    <select v-model="selected">
      <option v-for="(item, index) in options" :key="index" :value="item.value">{{ item.label }}</option>
    </select>
    <br />
    -------------------------------------
    <br />
    <span>선택 value: {{ selected }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "",
      options: [
        { value: "option1", label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
        // Add more options as needed
      ]
    }
  }
}
const a = () => {}
</script>

<style scoped>
/* Add any custom styles here */
</style>
