<template>
  <div class="footer q-mx-sm q-my-md">
    <div class="separator"></div>
    <div class="footer-content">
      <div class="footer-text text-bold text-black">
        2024 - Todos los Derechos Reservados
      </div>
    </div>
  </div>
</template>

<style scoped>
.separator {
  width: 100%;
  height: 5px;
  background-color: rgb(245, 242, 242);
  margin: 20px 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  flex: 1;
}

.footer-icons a {
  text-decoration: none;
}

.footer-icons q-icon {
  transition: transform 0.3s ease;
}

.footer-icons q-icon:hover {
  transform: scale(1.2);
}
</style>
