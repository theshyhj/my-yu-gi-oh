<template>
  <div class="card-form-page">
    <div class="container">
      <div class="page-header">
        <router-link to="/admin/cards" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          返回卡牌列表
        </router-link>
        <h1 class="page-title">{{ isEdit ? '编辑卡牌' : '添加卡牌' }}</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="card-form">
        <div class="form-grid">
          <div class="form-section">
            <h3 class="section-label">基本信息</h3>
            <div class="form-group">
              <label class="form-label">卡牌ID *</label>
              <input v-model="form.id" type="text" class="input-field" required :disabled="isEdit" />
            </div>
            <div class="form-group">
              <label class="form-label">卡牌名称 *</label>
              <input v-model="form.name" type="text" class="input-field" required />
            </div>
            <div class="form-group">
              <label class="form-label">卡牌类型 *</label>
              <select v-model="form.type" class="select-field" required>
                <option value="">请选择</option>
                <option value="monster">怪兽卡</option>
                <option value="spell">魔法卡</option>
                <option value="trap">陷阱卡</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">稀有度 *</label>
              <select v-model="form.rarity" class="select-field" required>
                <option value="">请选择</option>
                <option value="N">N - 普通</option>
                <option value="R">R - 稀有</option>
                <option value="SR">SR - 超稀有</option>
                <option value="UR">UR - 极稀有</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">卡牌图片</label>
              <input v-model="form.image" type="text" class="input-field" placeholder="图片文件名，如: 001.jpg" />
              <input type="file" @change="handleFileUpload" accept="image/*" class="file-input" />
            </div>
          </div>

          <div class="form-section" v-if="form.type === 'monster'">
            <h3 class="section-label">怪兽属性</h3>
            <div class="form-group">
              <label class="form-label">属性</label>
              <select v-model="form.attribute" class="select-field">
                <option value="">请选择</option>
                <option value="暗">暗</option><option value="光">光</option>
                <option value="地">地</option><option value="水">水</option>
                <option value="火">火</option><option value="风">风</option>
                <option value="神">神</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">等级/阶级</label>
              <input v-model.number="form.level" type="number" class="input-field" min="1" max="12" />
            </div>
            <div class="form-group">
              <label class="form-label">怪兽类型</label>
              <select v-model="form.monsterType" class="select-field">
                <option value="">请选择</option>
                <option value="通常">通常</option><option value="效果">效果</option>
                <option value="融合">融合</option><option value="仪式">仪式</option>
                <option value="同调">同调</option><option value="超量">超量</option>
                <option value="链接">链接</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">种族</label>
              <select v-model="form.race" class="select-field">
                <option value="">请选择</option>
                <option v-for="race in races" :key="race" :value="race">{{ race }}</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">攻击力</label>
                <input v-model.number="form.atk" type="number" class="input-field" min="0" />
              </div>
              <div class="form-group">
                <label class="form-label">防御力</label>
                <input v-model.number="form.def" type="number" class="input-field" min="0" :disabled="form.monsterType === '链接'" />
              </div>
            </div>
          </div>

          <div class="form-section full-width">
            <h3 class="section-label">效果描述</h3>
            <div class="form-group">
              <textarea v-model="form.effect" class="input-field textarea" rows="4" placeholder="输入卡牌效果描述..."></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/admin/cards" class="btn btn-secondary">取消</router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? '保存中...' : '保存' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const races = [
  '龙族', '魔法使族', '战士族', '恶魔族', '天使族', '机械族',
  '水族', '炎族', '岩石族', '鸟兽族', '植物族', '昆虫族',
  '雷族', '恐龙族', '兽族', '兽战士族', '鱼族', '海龙族',
  '爬虫类族', '念动力族', '不死族', '幻龙族', '电子界族', '创造神族'
]

const form = ref({
  id: '', name: '', type: '', rarity: '', image: '',
  attribute: '', level: null, monsterType: '', race: '',
  atk: null, def: null, effect: ''
})

async function fetchCard() {
  if (!isEdit.value) return
  const res = await api.get(`/cards/${route.params.id}`)
  Object.assign(form.value, res.data)
}

async function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('image', file)
  try {
    const res = await api.post('/admin/upload', formData)
    form.value.image = res.data.filename
  } catch (err) {
    alert('上传失败: ' + (err.response?.data?.message || err.message))
  }
}

async function handleSubmit() {
  saving.value = true
  try {
    if (isEdit.value) await api.put(`/admin/cards/${route.params.id}`, form.value)
    else await api.post('/admin/cards', form.value)
    router.push('/admin/cards')
  } catch (e) {
    alert('保存失败: ' + (e.response?.data?.message || e.message))
  } finally {
    saving.value = false
  }
}

onMounted(fetchCard)
</script>

<style scoped>
.card-form-page { padding: 40px 0 80px; }
.page-header { margin-bottom: 28px; }
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--color-text-secondary); font-size: 0.88rem;
  margin-bottom: 16px; text-decoration: none; transition: color 0.2s ease;
}
.back-link:hover { color: var(--color-gold); }
.page-header .page-title { text-align: left; margin-bottom: 0; }
.page-header .page-title::after { left: 0; transform: none; }

.card-form {
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
  padding: 28px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
.form-section {
  display: flex; flex-direction: column; gap: 18px;
}
.form-section.full-width { grid-column: 1 / -1; }
.section-label {
  font-size: 1rem; font-weight: 600; color: var(--color-gold);
  padding-bottom: 10px; border-bottom: 1px solid rgba(212,175,55,0.15);
}
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-label { font-size: 0.85rem; font-weight: 500; color: var(--color-text-secondary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.textarea { resize: vertical; min-height: 100px; font-family: var(--font-body); }
.file-input { margin-top: 6px; font-size: 0.85rem; color: var(--color-text-secondary); }
.file-input::file-selector-button {
  padding: 7px 14px; background: var(--color-bg-tertiary);
  border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-sm);
  color: var(--color-text-primary); cursor: pointer; margin-right: 12px;
  transition: all 0.2s ease;
}
.file-input::file-selector-button:hover {
  background: rgba(212,175,55,0.1); border-color: rgba(212,175,55,0.2);
}
.form-actions {
  display: flex; justify-content: flex-end; gap: 14px;
  margin-top: 28px; padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.04);
}
@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>