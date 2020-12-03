<template>
  <transition name="modal">
    <div class="modal-mask" v-show="show" @mousedown="close">
      <div class="modal-wrapper">
        <div class="modal-container" @mousedown.stop>
          <button class="modal-button" @click="close">X</button>
          <div class="modal-header">
            <slot name="header"></slot>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  created() {
    const onEscape = e => {
      if (this.open && e.keyCode === 27) {
        this.close();
      }
    };
    document.addEventListener("keydown", onEscape);
  },
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
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: top;
}
.modal-container {
  position: relative;
  width: 450px;
  padding: 10px 10px;
  margin: 100px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
.modal-button {
  position: absolute;
  right: 10px;
  border: none;
  background-color: transparent;
}
.modal-header,
.modal-body,
.modal-footer {
  border: none;
}
.modal-header div,
.modal-body div {
  margin-top: 0;
  display: flex;
  flex-direction: column;
}
.modal-header div {
  align-items: center;
}
.modal-body div {
  align-items: flex-start;
}
.modal-footer div {
  display: flex;
  justify-content: space-between;
}
.modal-body span {
  padding-bottom: 4px;
  font-size: 13px;
}
.modal-header h1 {
  color: #666;
  font-weight: 600;
  margin-bottom: 4px;
}
.modal-header p {
  font-size: 12px;
}
.modal-body table {
  margin: 0;
}
.modal-body td {
  padding-bottom: 8px;
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>
