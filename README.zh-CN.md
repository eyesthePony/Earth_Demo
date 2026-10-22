[English](README.md) | [简体中文](README.zh-CN.md)

**Earth_Demo** 是一款基于 Cocos Creator 开发的 **Roguelike 自动开火弹幕射击游戏 (Auto-fire Bullet-hell)**。

在游戏中，玩家专注于操控战机移动以躲避密集的弹幕，而战机会自动锁定并攻击敌人。目前项目正处于早期核心玩法开发阶段，底层架构已搭建完毕，并实现了完整的波次刷怪与 Boss 战机制。

---

## 📂 目录结构 (Directory Structure)

项目的 TypeScript 源码均位于 `assets/scripts` 目录下，整体架构遵循**高内聚、低耦合**的原则进行模块划分：

```text
assets/scripts/
├── Core/           # 核心底层系统
├── UI/             # 用户界面组件与面板
├── Manager/        # 游戏全局管理器
└── Entity/         # 游戏实体（飞机、子弹等）
🏗️ 核心模块解析 (Core Systems)
1. Manager (管理器层)
负责全局资源的调度与游戏流程控制。

BulletManager: 统一管理子弹的对象池生成与回收，支持不同阵营（敌我）的子弹分发。

EnemyManager: 负责各类敌机（普通怪、Boss）的生成、初始化及对象池回收。

GameManager: 控制游戏的核心状态机（如：准备、进行中、暂停、失败、胜利），协调各系统联动。

WaveManager: 解析关卡配置文件 (LevelConfig)，控制敌人的刷新节奏、波次间隔与关底 Boss 出现。

2. Entity (实体层)
游戏中的具体表现对象，采用面向对象与多态设计。

BasePlane: 飞机基类，封装了通用属性（血量、无敌帧、移动、基础开火计时）。

BaseBullet: 子弹基类，处理基于方向与速度的位移、屏幕边界检测及碰撞回调。

PlayerPlane: 玩家专属战机（自动开火、受击逻辑）。

EnemyPlane: 普通敌机逻辑（如直线移动、出界回收）。

PurpleBoss: 精英 Boss 实体，包含复杂的状态机（入场无敌、正弦波左右巡逻、多阶段狂暴机制）。

3. Core (基础设施层)
提供支撑游戏运行的基础服务。

EventBus: 全局事件总线，用于解耦各个 Manager 与 Entity 之间的通信（如：敌人死亡、玩家受击、游戏重置）。

PoolManager: 通用节点对象池，极大减少实例化（Instantiate）与销毁（Destroy）带来的性能开销。

AudioManager / EffectManager: 封装音频播放与视觉特效。

GameConstants / GameData / LevelConfig: 常量枚举、全局数据与关卡波次配置表。

4. UI (界面层)
包含游戏内的各种交互面板与按钮（如：开始面板、暂停面板、结算面板）。

🎮 技术特点 (Technical Highlights)
对象池驱动 (Object Pooling): 高频刷新的子弹与敌机全面接入对象池，确保游戏长时间运行下帧率稳定。

数据驱动波次 (Data-Driven Waves): 通过 LevelConfig 配置文件灵活定制关卡的刷怪序列、延迟与类型，无需修改核心逻辑。

基于事件驱动 (Event-Driven): 碰撞检测不直接修改血量，而是发出事件交由 Manager 统一调度，彻底分离战斗表现与核心逻辑。

🚀 未来规划 (Planned Features)
Earth_Demo 正在向一个完整的 Roguelike 太空生存游戏迈进，接下来计划开发的功能包括：

□ 专属弹幕模式 (Unique Bullet Patterns): 为不同敌机与 Boss 设计专属弹幕（如扇形散射、螺旋激光、追踪导弹）。
□ 生命与研发资源系统 (Life & Research Resource Systems): 引入局外的永久成长线。
□ 星球开发 (Planet Development): 建立基地，升级科技树。
□ 飞船探索与资源采集 (Spaceship Exploration & Gathering): 在大地图中探索星系，采集稀有矿物。
□ 抵御海盗袭击 (Defense Against Pirate Attacks): 除了主动出击，还要面对随机到来的太空海盗袭击，保护星球资源。

🛠️ 开发环境 (Development Setup)
安装 Cocos Creator 3.8 或更高版本。

克隆本项目并导入 Cocos Dashboard。

打开 Scenes/HallScene.scene 或相关主场景。

点击编辑器顶部的 Play 按钮即可预览游戏。