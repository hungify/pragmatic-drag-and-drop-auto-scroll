<script setup lang="ts">
import { ref } from "vue";
import ListCustom from "./components/custom-preview/ListCustom.vue";
import ListNative from "./components/native-preview/ListNative.vue";
import { getColumns } from "./utils";
import Header from "./components/Header.vue";

const nativeSymbol = Symbol("native");
const customSymbol = Symbol("custom");

const list = [
  {
    items: ref(getColumns({ count: 150, prefix: "Native" })),
    instanceId: nativeSymbol,
    title: "Native Preview",
  },
  {
    items: ref(getColumns({ count: 150, prefix: "Custom" })),
    instanceId: customSymbol,
    title: "Custom Preview",
  },
];

const scrollMode = ref<"window" | "list">("window");
const showImage = ref(false);
</script>

<template>
  <div>
    <Header v-model:scrollMode="scrollMode" v-model:showImage="showImage" />
    <div class="grid" :class="{ 'list-scroll': scrollMode === 'list' }">
      <div class="custom-preview" v-for="item in list" :key="item.instanceId">
        <h4 class="title">{{ item.title }}</h4>
        <Component
          :is="item.instanceId === customSymbol ? ListCustom : ListNative"
          v-model:items="item.items.value"
          :instanceId="item.instanceId"
          :scrollMode="scrollMode"
          :showImage="showImage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 8px;
}

.custom-preview {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}

.native-preview {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}

.title {
  color: #333;
  margin: 0 0 10px;
}
</style>
