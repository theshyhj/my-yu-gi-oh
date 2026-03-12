<template>
  <div
    class="ygo-card"
    @click="$emit('click', card)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <img
      v-if="card.image"
      :src="cardImageUrl"
      :alt="card.name"
      class="card-image"
      @error="handleImageError"
    />
    <div v-else class="card-placeholder">
      <span class="placeholder-text">{{ card.name?.charAt(0) }}</span>
    </div>

    <!-- 稀有度光效 -->
    <div v-if="card.rarity !== 'N'" class="rare-shine" :class="`rare-${card.rarity?.toLowerCase()}`"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  card: { type: Object, required: true }
})

defineEmits(['click'])

const isHovered = ref(false)

// 卡图URL
const cardImageUrl = computed(() => {
  const img = props.card.image
  if (!img) return ''
  if (img.startsWith('http')) return img
  return `/img/${img}`
})

function handleImageError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.ygo-card {
  position: relative;
  width: 180px;
  aspect-ratio: 0.686;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.ygo-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.3);
  z-index: 10;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  border-radius: 8px;
}

.placeholder-text {
  font-size: 3rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

/* ========== 稀有度光效 ========== */

.rare-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border-radius: 8px;
}

.rare-r {
  background: linear-gradient(135deg, transparent 40%, rgba(100,180,255,0.3) 50%, transparent 60%);
  animation: shine 3s infinite;
}

.rare-sr {
  background: linear-gradient(135deg, transparent 40%, rgba(180,130,255,0.4) 50%, transparent 60%);
  animation: shine 2.5s infinite;
}

.rare-ur {
  background: linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.5) 50%, transparent 70%);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(45deg); }
}
</style>
