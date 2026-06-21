# 窟·境 CAVE·SCAPE

> **敦煌数字洞窟沉浸式漫游系统**  
> Immersive Dunhuang Digital Cave Exhibition

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Three.js](https://img.shields.io/badge/Three.js-r169-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)

---

## 🏆 项目概述

**窟·境（CAVE·SCAPE）** 是一套面向文化遗产数字化的 **Web 端三维沉浸式洞窟漫游系统**。基于 Three.js 构建，以高精度 1:1 真实洞窟尺寸重建敦煌莫高窟五大代表性洞窟，融合 PBR 物理材质、三层光照系统、空间音频、粒子特效与自然交互，在浏览器中还原洞窟现场观赏体验。

> **"窟"** —— 莫高窟，千年文明的空间载体  
> **"境"** —— 数字境界 · 沉浸场境 · 佛法妙境

---

## 🎯 核心亮点

### 1. 高精度三维重建
- 基于 Blender 1:1 真实洞窟尺寸精细建模
- 单文件 196MB glTF Binary（glb），含完整几何、材质、纹理
- Draco 压缩传输，兼顾精度与加载性能

### 2. PBR 敦煌矿物色彩体系
- 深度还原敦煌传统矿物颜料：**石青、石绿、朱砂、土黄、赭石**
- 物理材质模拟壁画风化、彩塑剥蚀、崖壁粗糙质感
- ACES Filmic 电影级色调映射

### 3. 三层光照系统
- **AmbientLight** — 全局漫反射，模拟洞窟暗光环境
- **HemisphereLight** — 天光+地表反射双色光
- **DirectionalLight** × 3 + **PointLight** × 10 — 模拟入口自然光、顶部射灯、佛龛双侧 45° 柔光
- 3000K 暖黄色温，PCF 柔和阴影

### 4. 自由漫游交互
| 交互方式 | 功能 |
|----------|------|
| 鼠标左键拖拽 | 旋转视角 |
| 滚轮 | 拉近/拉远 |
| Shift + 滚轮 | 多维环绕观赏（水平+垂直） |
| 右键拖拽 | 平移视角 |
| WASD | 第一人称自由漫游 |
| Q / E | 上升 / 下降 |
| 点击展品 | 文物解说弹窗 |

### 5. 洞窟导航系统
一键飞行切换五大洞窟，每个洞窟配有：
- 独立文物解说数据库（壁画、彩塑、洞窟构件）
- 缩略导览地图（实时相机位置追踪）
- 导览指引弹窗

### 6. 粒子特效系统
- **花瓣飘落**（400 粒子）— 敦煌暖色调花瓣
- **佛像光晕**（100 粒子）— 金色呼吸光晕
- **金沙漂浮**（300 粒子）— 环绕镇馆文物与窟顶藻井

### 7. 空间音频
- Web Audio API 程序化五声音阶古乐
- 五窟独立旋律风格：西魏清雅、盛唐华美、晚唐沉郁、元代神秘
- 音源跟随相机距离自动调节音量
- 驼铃环境音定点播放

---

## 🏛️ 展馆洞窟

| 编号 | 名称 | 朝代 | 年代 | 核心文物 |
|------|------|------|------|----------|
| 285 | 西魏第285窟 | 西魏 | 公元538年 | 最早纪年洞窟、伏羲女娲飞天 |
| 45 | 盛唐第45窟 | 盛唐 | 公元8世纪 | 七身完整彩塑、观无量寿经变 |
| 217 | 盛唐第217窟 | 盛唐 | 公元8世纪初 | 法华经变化城喻品、青绿山水 |
| 17 | 晚唐第17窟 | 晚唐 | 公元862年 | 藏经洞、洪辩法师影窟 |
| 3 | 元代第3窟 | 元代 | 公元14世纪 | 千手千眼观音、密宗壁画 |

---

## 🛠️ 技术架构

```
窟·境 CAVE·SCAPE
├── src/
│   ├── main.js          # 主入口：场景初始化 + 渲染循环 + UI
│   ├── scene.js         # Three.js Scene/Camera/Renderer 搭建
│   ├── lighting.js      # 三层光照系统（3000K 暖黄）
│   ├── modelLoader.js   # glTF/glb 异步加载 + Draco 解码
│   ├── materials.js     # PBR 材质增强 + 敦煌矿物色彩预设
│   ├── controls.js      # OrbitControls + WASD + 滚轮多维环绕 + 洞窟飞行
│   ├── raycaster.js     # 射线拾取 + 文物解说数据库
│   ├── particles.js     # 花瓣/光晕/金沙三重粒子系统
│   ├── audio.js         # Web Audio API 空间音频 + 五声音阶古乐
│   └── vr.js            # WebXR VR 模式适配
├── public/
│   ├── models/
│   │   └── dunhuang_museum.glb   # 196MB 洞窟模型
│   └── draco/                     # Draco 解码器（本地部署）
├── index.html            # 敦煌复古中式 UI
├── vite.config.js        # Vite 构建配置 + Gzip 压缩
└── package.json
```

### 技术栈

| 层级 | 技术 |
|------|------|
| 3D 引擎 | Three.js r169 |
| 构建工具 | Vite 5.4 |
| 模型格式 | glTF 2.0 Binary (.glb) + Draco 压缩 |
| 建模工具 | Blender |
| 音频引擎 | Web Audio API（程序化合成） |
| VR 支持 | WebXR Device API |
| 手势交互 | MediaPipe Hands（可选） |
| 部署 | GitHub Pages + GitHub Actions |

---

## 🚀 快速开始

### 环境要求
- **Node.js** ≥ 18
- **npm** ≥ 9

### 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/YANG-WEN-TAO/CAVE-SCAPE.git
cd CAVE-SCAPE

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开
# http://localhost:3000
```

### 生产构建

```bash
npm run build
npm run preview   # 预览构建结果
```

---

## 📡 在线演示

🔗 **评委在线评审地址：** [https://yang-wen-tao.github.io/CAVE-SCAPE/](https://yang-wen-tao.github.io/CAVE-SCAPE/)

> 首次加载需要下载模型资源（~196MB），建议在稳定网络环境下等待加载进度条完成。

---

## 📁 项目文件说明

| 文件/目录 | 说明 |
|-----------|------|
| `src/main.js` | 应用主入口，初始化流程与渲染循环 |
| `src/scene.js` | 场景、相机、渲染器初始化 |
| `src/lighting.js` | 敦煌暖黄光三层光照系统 |
| `src/modelLoader.js` | glb 模型异步加载与 Draco 解码 |
| `src/materials.js` | PBR 材质 + 矿物色彩体系 |
| `src/controls.js` | 完整交互控制系统 |
| `src/raycaster.js` | 展品点击交互与文物数据库 |
| `src/particles.js` | 三重粒子特效 |
| `src/audio.js` | 空间音频引擎 |
| `src/vr.js` | WebXR VR 适配 |
| `public/models/` | 3D 模型文件 |
| `public/draco/` | Draco 解码器本地部署 |
| `index.html` | 主页面与 UI 样式 |
| `vite.config.js` | Vite 构建配置 |

---

## 🎨 设计理念

### 色彩体系
严格遵循敦煌莫高窟传统矿物颜料色谱：
- **石青** `#4A7C8C` — 壁画底色，源自青金石粉末
- **石绿** `#5B8C6A` — 植物纹样，源自孔雀石
- **朱砂** `#C44536` — 装饰边框，源自辰砂矿物
- **土黄** `#C4A668` — 墙面基底，源自黄赭石
- **赭石** `#8B5A3C` — 木质构件，源自赤铁矿

### 空间设计
- 展馆廊道贯穿五窟，模拟真实参观动线
- 洞窟内部 1:1 尺寸还原，适配人眼高度 1.6m
- 雾效增强洞窟空间纵深感
- 最小观赏距离限制（1.2m），模拟玻璃护栏规则

### 音效设计
- 中国传统五声音阶（宫商角徵羽）
- 四朝风格：西魏清雅 / 盛唐华美 / 晚唐沉郁 / 元代神秘
- 空间声像 HRTF 定位
- 音量随相机距离平滑衰减

---

## 🔮 未来规划

- [ ] WebXR 完整 VR 漫游支持（Meta Quest / Pico）
- [ ] MediaPipe 手势隔空交互完整体验
- [ ] AI 生成壁画风化贴图（GAN 修复补全）
- [ ] 多人在线协同参观
- [ ] 移动端触屏手势适配
- [ ] 更多洞窟扩展（如 220 窟、320 窟）

---

## 👥 团队

| 角色 | 姓名 |
|------|------|
| 项目负责人 | YANG WEN TAO |
| 三维建模 | — |
| 前端开发 | — |
| 技术美术 | — |

---

## 📄 许可证

本项目代码采用 [MIT License](LICENSE) 开源。

3D 模型与文物数据版权归敦煌研究院及相关学术机构所有，仅供学术研究与文化交流使用。

---

<p align="center">
  <b>窟·境 CAVE·SCAPE</b><br/>
  <i>以数字之力，续千年之约</i><br/>
  <sub>Made with ❤️ for Dunhuang</sub>
</p>
