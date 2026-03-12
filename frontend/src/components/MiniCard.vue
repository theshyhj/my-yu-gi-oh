<template>
  <div class="mini-card" :class="`rarity-${card.rarity?.toLowerCase()}`">
    <img v-if="card.image" :src="`/img/${card.image}`" :alt="card.name" />
    <div v-else class="mini-placeholder">{{ card.name?.charAt(0) }}</div>
  </div>
</template>

<script setup>
defineProps({
  card: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
.mini-card {
  width: 45px;
  height: 65px;
  border-radius: 4px;
  overflow: hidden;
  background: linear-gradient(145deg, #1a1a25, #12121a);
  border: 1px solid rgba(100,100,120,0.3);
}

.mini-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mini-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--color-gold);
  background: linear-gradient(135deg, var(--color-blue-dark), var(--color-bg-tertiary));
}

.rarity-ur {
  border-color: rgba(255,215,0,0.5);
  box-shadow: 0 0 8px rgba(255,215,0,0.3);
}

.rarity-sr {
  border-color: rgba(147,112,219,0.5);
}

.rarity-r {
  border-color: rgba(70,130,180,0.4);
}
</style>
