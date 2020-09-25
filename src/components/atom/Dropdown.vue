<template>
  <div class="p-w-xs">
    <button class="btn btn-default dropdown-toggle" @click="chDrop">
      <strong>{{ checkedValue }}</strong
      ><span class="caret" />
    </button>
    <div class="drop-item" v-show="drop">
      <button
        v-for="(item, index) in itemList"
        class="btn"
        @click="[chDrop(item), itemClick(index)]"
        :key="`dropItem-${index}`"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defaultValue: {
      type: String,
      required: true,
    },
    itemList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      drop: false,
      checkedValue: this.defaultValue,
    };
  },
  watch: {
    defaultValue: function(val) {
      this.checkedValue = val;
    },
  },
  methods: {
    chDrop: function(item) {
      this.drop = !this.drop;
      if (typeof item !== "object") this.checkedValue = item;
    },
    itemClick: function(index) {
      this.$emit("dropItemClick", index);
    },
  },
};
</script>

<style>
.p-w-xs {
  position: relative;
  padding: 0px;
  margin: auto 8px;
}
.drop-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 40px;
  z-index: 3;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.drop-item button {
  background-color: #fff;
  text-align: left;
}
.btn-group > * {
  margin: 0px;
}
.dropdown-toggle {
  display: flex;
  flex: 1;
  justify-content: space-between;
  width: 100%;
}
.btn .caret {
  margin: 8px 0px 8px 8px;
}
</style>
