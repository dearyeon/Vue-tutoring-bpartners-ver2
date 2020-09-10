<template>
  <div class="modal-mask" v-show="show" transition="modal">
    <div class="modal-wrapper">
      <div class="modal-container">
        <button class="modal-button" @click="close">X</button>
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>
        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    open: function() {
      this.show = true;
    },
    close: function() {
      this.show = false;
    },
  },
};
</script>

<style>
[v-cloak] {
  display: none;
}
.modal-mask {
  position: absolute;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition-duration: 5s;
  transition-timing-function: ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: top;
}
.modal-container {
  position: relative;
  width: 450px;
  margin: 100px auto;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header div {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-header h2 {
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
}
.modal-header p {
  font-size: 10px;
}
.modal-body div {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.modal-body .modal-enter,
.modal-leave {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave .modal-container {
  transform: scale(1.1);
}

.modal-button {
  position: absolute;
  right: 10px;
  border: none;
  background-color: transparent;
}
</style>
