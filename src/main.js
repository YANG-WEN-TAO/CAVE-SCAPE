/**
 * 敦煌 3DShow 数字展馆 - 主入口
 * 负责：场景初始化、模块协调、渲染循环、UI 交互
 * 升级：WASD 自由漫游、洞窟导航、多预设机位、缩略导览地图、导览指引弹窗
 */
import { initScene, getScene, getCamera, getRenderer, onWindowResize } from './scene.js'
import { setupLighting, getLights } from './lighting.js'
import { loadModel, getLoadedModel } from './modelLoader.js'
import { enhancePBRMaterials } from './materials.js'
import {
  initControls, getControls,
  updateWASDMove, flyToCave,
  getCurrentCave, getCavePositions, updateScrollOrbit,
} from './controls.js'
import { initRaycaster, bindRaycastToScene } from './raycaster.js'
import { initParticles, updateParticles } from './particles.js'

// 全局状态
const state = {
  isLoaded: false,
  model: null,
  clock: null,
  minimapVisible: false,
}

/**
 * 应用主入口
 */
async function main() {
  console.log('[窟·境 CAVE·SCAPE] 开始初始化...')

  // 1. 初始化 Three.js 基础场景（Scene + Camera + Renderer）
  const { scene, camera, renderer, clock } = initScene()
  state.clock = clock

  // 2. 配置三层光照系统（AmbientLight + DirectionalLight + HemisphereLight）
  setupLighting(scene)

  // 3. 初始化 OrbitControls 轨道控制器
  const controls = initControls(camera, renderer.domElement)

  // 4. 异步加载 glb 洞窟模型
  try {
    const model = await loadModel('/models/dunhuang_museum.glb', (progress) => {
      updateLoadingBar(progress)
    })

    state.model = model
    state.isLoaded = true

    // 5. 增强 PBR 材质（调整粗糙度、金属度、凹凸强度）
    enhancePBRMaterials(model)

    // 模型添加到场景
    scene.add(model)

    // 6. 绑定 Raycaster 射线拾取交互
    bindRaycastToScene(camera, renderer.domElement, model)

    // 7. 初始化粒子特效（花瓣飘落 + 佛像光晕）
    initParticles(scene)

    // 隐藏加载界面，显示 UI
    hideLoading()
    showUI()

    console.log('[窟·境 CAVE·SCAPE] 初始化完成')
  } catch (err) {
    console.error('[窟·境 CAVE·SCAPE] 模型加载失败:', err)
    document.getElementById('loading-text').textContent = '加载失败: ' + err.message
  }

  // 启动渲染循环
  animate()
}

/**
 * 渲染循环
 */
function animate() {
  requestAnimationFrame(animate)

  const delta = state.clock.getDelta()
  const elapsed = state.clock.getElapsedTime()

  // 更新 OrbitControls
  const controls = getControls()
  if (controls) controls.update()

  // 更新 WASD 自由移动（键盘漫游）
  updateWASDMove()

  // 更新滚轮多维视角环绕
  updateScrollOrbit()

  // 更新粒子特效
  updateParticles(delta, elapsed)

  // 更新模型动画（如果 glb 模型自带动画）
  const model = getLoadedModel()
  if (model && model.animations && model.mixer) {
    model.mixer.update(delta)
  }

  // 更新缩略导览地图（相机位置标记）
  if (state.minimapVisible) {
    updateMinimap()
  }

  // 渲染场景
  const renderer = getRenderer()
  const scene = getScene()
  const camera = getCamera()
  renderer.render(scene, camera)
}

// ============================================================
// UI 辅助函数
// ============================================================

/**
 * 更新加载进度条
 */
function updateLoadingBar(progress) {
  const bar = document.getElementById('loading-bar')
  const text = document.getElementById('loading-text')
  if (bar) bar.style.width = (progress * 100).toFixed(1) + '%'
  if (text) text.textContent = '正在加载洞窟模型... ' + (progress * 100).toFixed(0) + '%'
}

/**
 * 隐藏加载界面
 */
function hideLoading() {
  const loading = document.getElementById('loading')
  if (loading) {
    loading.style.opacity = '0'
    setTimeout(() => { loading.style.display = 'none' }, 800)
  }
}

/**
 * 显示 UI 界面
 */
function showUI() {
  document.getElementById('top-bar').style.display = 'flex'
  document.getElementById('bottom-hint').style.display = 'block'
  document.getElementById('cave-nav').style.display = 'flex'

  // 绑定按钮事件
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  })

  // === 导览指引弹窗 ===
  document.getElementById('btn-guide').addEventListener('click', () => {
    document.getElementById('guide-modal').style.display = 'flex'
  })

  // === 缩略导览地图 ===
  document.getElementById('btn-minimap').addEventListener('click', () => {
    const minimap = document.getElementById('minimap')
    state.minimapVisible = !state.minimapVisible
    minimap.style.display = state.minimapVisible ? 'block' : 'none'
    document.getElementById('btn-minimap').classList.toggle('active', state.minimapVisible)
    if (state.minimapVisible) {
      drawMinimap()
    }
  })

  // === 洞窟导航按钮 ===
  document.querySelectorAll('#cave-nav .cave-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const caveNumber = btn.getAttribute('data-cave')
      flyToCave(caveNumber)
      // 高亮当前选中洞窟
      document.querySelectorAll('#cave-nav .cave-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })
}

// ============================================================
// 缩略导览地图
// ============================================================

/**
 * 绘制缩略导览地图（静态部分：洞窟点位、廊道连线）
 */
function drawMinimap() {
  const canvas = document.getElementById('minimap-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // 清空画布
  ctx.clearRect(0, 0, w, h)

  // 背景渐变（赭石色调）
  const bgGradient = ctx.createLinearGradient(0, 0, w, h)
  bgGradient.addColorStop(0, '#2a1e14')
  bgGradient.addColorStop(1, '#1a1410')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, w, h)

  // 廊道连线（横贯展馆的参观动线）
  const cavePositions = getCavePositions()
  const caveKeys = Object.keys(cavePositions)

  // 计算 3D 坐标到 2D 画布坐标的映射
  // X 轴范围：6 ~ 44 -> 画布 20 ~ w-20
  const xMin = 6, xMax = 44
  const mapXMin = 20, mapXMax = w - 20
  const mapY = h / 2  // 洞窟都在 y=0 平面，映射到画布中线

  // 绘制廊道连线
  ctx.strokeStyle = '#5a4a32'
  ctx.lineWidth = 2
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(mapXMin, mapY)
  ctx.lineTo(mapXMax, mapY)
  ctx.stroke()
  ctx.setLineDash([])

  // 绘制每个洞窟点位
  caveKeys.forEach(key => {
    const cave = cavePositions[key]
    const x = mapXMin + ((cave.x - xMin) / (xMax - xMin)) * (mapXMax - mapXMin)

    // 洞窟圆点
    ctx.fillStyle = '#c4a668'
    ctx.beginPath()
    ctx.arc(x, mapY, 5, 0, Math.PI * 2)
    ctx.fill()

    // 外圈光晕
    ctx.strokeStyle = 'rgba(196, 166, 104, 0.4)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x, mapY, 8, 0, Math.PI * 2)
    ctx.stroke()

    // 洞窟编号文字
    ctx.fillStyle = '#8a7a5a'
    ctx.font = '9px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText(key + '窟', x, mapY - 12)
  })

  // 标题
  ctx.fillStyle = '#c4a668'
  ctx.font = 'bold 10px Microsoft YaHei'
  ctx.textAlign = 'left'
  ctx.fillText('展馆导览图', 8, 14)
}

/**
 * 更新缩略导览地图（动态部分：相机位置标记）
 */
function updateMinimap() {
  const canvas = document.getElementById('minimap-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // 先重绘静态地图
  drawMinimap()

  // 获取相机当前位置
  const camera = getCamera()
  if (!camera) return

  // 计算 3D 坐标到 2D 画布坐标的映射
  const xMin = 6, xMax = 44
  const mapXMin = 20, mapXMax = w - 20
  const mapY = h / 2

  // 相机 X 坐标映射到画布
  const camX = camera.position.x
  const dotX = mapXMin + ((camX - xMin) / (xMax - xMin)) * (mapXMax - mapXMin)
  const clampedX = Math.max(mapXMin - 10, Math.min(mapXMax + 10, dotX))

  // 绘制相机位置标记（红色脉冲圆点）
  const time = performance.now() * 0.003
  const pulseRadius = 4 + Math.sin(time) * 2

  // 外圈脉冲
  ctx.strokeStyle = 'rgba(196, 69, 54, 0.5)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(clampedX, mapY, pulseRadius + 4, 0, Math.PI * 2)
  ctx.stroke()

  // 内圈实心点（朱砂色）
  ctx.fillStyle = '#C44536'
  ctx.beginPath()
  ctx.arc(clampedX, mapY, 4, 0, Math.PI * 2)
  ctx.fill()

  // 高亮当前洞窟
  const currentCave = getCurrentCave()
  if (currentCave) {
    const cavePositions = getCavePositions()
    const cave = cavePositions[currentCave]
    if (cave) {
      const caveX = mapXMin + ((cave.x - xMin) / (xMax - xMin)) * (mapXMax - mapXMin)
      ctx.strokeStyle = '#C44536'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(caveX, mapY, 9, 0, Math.PI * 2)
      ctx.stroke()
    }
  }
}

// 窗口大小变化时自适应
window.addEventListener('resize', onWindowResize)

// 启动应用
main()
