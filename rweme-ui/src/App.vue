<template>
  <router-view />
</template>

<script setup lang="ts">
</script>
<style scoped lang="scss">
.background {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000;
}

.otherColor {
  background-color: #fff;
}

.g-flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.custom-primary-btn,
.custom-secondary-btn {
  height: 38px;
  padding: 0 20px;
  border-radius: 6px;
  border: 1px solid #058ece;
  font-size: 12px;
  min-width: 100px;
  cursor: pointer;
}

.custom-primary-btn {
  background: #058ece;
  color: #fff;
}

.custom-primary-btn:hover {
  color: #fff;
}

.custom-secondary-btn {
  color: #058ece;
  background: #fff;
}

@font-face {
  font-family: "light";
  src: url("../src/assets/font/Avenir/AvenirLight/AvenirLight.ttf");
}

@font-face {
  font-family: "avenir-heavy";
  src: url("../src/assets/font/Avenir/AvenirHeavy/AvenirHeavy.ttf");
}

@font-face {
  font-family: "avenir-book";
  src: url("../src/assets/font/Avenir/AvenirBook/AvenirBook.ttf");
}
</style>
