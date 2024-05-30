<template>
    <div><span>Pinia Test</span></div>    
    <div><span>count : {{ count }}</span></div>    
    <div><span>doubleCount : {{ doubleCount }}</span></div>    
    <div><span>result : {{ result }}</span></div>    
    <div><span>countStore : {{ countStore }}</span></div>    
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter' 

export default defineComponent({
    setup() {
        const countStore = useCounterStore()
        const { count, doubleCount } = storeToRefs(countStore)

        count.value++
        let result = countStore.increment()

        console.log('### ran doubleCount : ', doubleCount)

        return {
            count,
            doubleCount,
            result,
            countStore
        }
    },
})
</script>

