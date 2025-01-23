<template>
  <div class="container">
    <div class="leftmenu">
    </div>
    <div class="rightcontent">
      <div class="top"></div>
      <div class="bottom">
        <div class="card-container">
          <div v-for="list in cardColumns" :key="list.id" class="card-column">
            <div class="column-title">{{ list.title }}</div>
            <div v-for="card in list.items" :key="card.id" class="card">
              {{ card.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: '',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
      cards: [
        {
          id: 1,
          title: 'List 1',
          items: [
            { id: 11, title: 'Card 1-1' },
            { id: 12, title: 'Card 1-2' },
            { id: 13, title: 'Card 1-3' },
            { id: 14, title: 'Card 1-4' },
          ]
        },
        {
          id: 2,
          title: 'List 2',
          items: [
            { id: 21, title: 'Card 2-1' },
            { id: 22, title: 'Card 2-2' },
            { id: 23, title: 'Card 2-3' },
          ]
        },
        {
          id: 3,
          title: 'List 3',
          items: [
            { id: 31, title: 'Card 3-1' },
            { id: 32, title: 'Card 3-2' },
            { id: 33, title: 'Card 3-3' },
            { id: 34, title: 'Card 3-4' },
            { id: 35, title: 'Card 3-5' },
          ]
        },
        {
          id: 4,
          title: 'List 4',
          items: [
            { id: 41, title: 'Card 4-1' },
            { id: 42, title: 'Card 4-2' },
          ]
        }
      ]
    };
  },
  computed: {
    cardColumns() {
      // cards 배열을 그대로 사용 (이미 원하는 구조로 되어있음)
      return this.cards;
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: columns;
}
.leftmenu {
  background-color: aquamarine;
  width: 200px;
  height: 100vh;
}
.rightcontent {

}
.rightcontent .top {
  border: 1px solid black;
  padding: 20px;
}
.rightcontent .bottom {

}
.column-title {
  font-weight: bold;
  font-size: 1.1em;
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.card-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: auto;
  min-width: 250px;
  background-color: #f8f8f8;
  padding: 10px;
}
.card{
  width: 40%;
  height: 30%;
}
</style>
