**English** | [简体中文](./README.zh-CN.md)

# ✈️ Earth_Demo

**Earth_Demo** is a game built with Cocos Creator that combines **Roguelike mechanics** with **auto-fire bullet-hell combat**. 

Players maneuver their ship to dodge complex bullet patterns while the system automatically targets and fires at enemies. Currently in early development, the project features a robust, decoupled architecture with complete wave-spawning and Boss battle mechanics.

---

## 📂 Directory Structure

All TypeScript source code is located in the `assets/scripts` directory. The architecture follows the **High Cohesion, Low Coupling** principle:

```text
assets/scripts/
├── Core/           # Core infrastructure systems
├── UI/             # User interface components and panels
├── Manager/        # Global game managers
└── Entity/         # Game entities (planes, bullets, etc.)
🏗️ Core Systems
1. Manager (Global Control)
Responsible for global resource scheduling and game flow control.

BulletManager: Manages the object pool generation and recycling for bullets, supporting different factions (player vs. enemy).

EnemyManager: Handles the generation, initialization, and pooling of various enemies (normal mobs, Bosses).

GameManager: Controls the core game state machine (e.g., Ready, Playing, Paused, GameOver, Victory) and coordinates interactions between systems.

WaveManager: Parses level configurations (LevelConfig) to control spawn intervals, wave timing, and Boss encounters.

2. Entity (Game Objects)
Concrete objects within the game, utilizing Object-Oriented and Polymorphic design.

BasePlane: Base class for planes, encapsulating common properties (HP, invincibility frames, movement, firing timers).

BaseBullet: Base class for bullets, handling movement based on direction/speed, screen bounds detection, and collision callbacks.

PlayerPlane: The player's exclusive ship (auto-fire, damage-taking logic).

EnemyPlane: Standard enemy logic (e.g., straight-line movement, recycling off-screen).

PurpleBoss: The elite Boss entity, featuring a complex state machine (invincible entry, sine-wave patrol, multi-phase enrage mechanics).

3. Core (Infrastructure)
Provides foundational services to support game operation.

EventBus: Global event bus for decoupling communication between Managers and Entities (e.g., EnemyKilled, PlayerHit, GameReset).

PoolManager: Generic node object pool, significantly reducing performance overhead caused by instantiation and destruction.

AudioManager / EffectManager: Encapsulates audio playback and visual effects .

GameConstants / GameData / LevelConfig: Constant enums, global data, and level wave configuration tables.

4. UI (Interface)
Contains interactive panels and buttons (e.g., Start Panel, Pause Panel, Result Panel). 

🎮 Technical Highlights
Object Pooling: High-frequency bullets and enemies fully utilize object pools to ensure stable framerates during long play sessions.

Data-Driven Waves: Level designs (spawn sequences, delays, types) are configured via LevelConfig without modifying core logic.

Event-Driven Architecture: Collision detection doesn't directly modify HP. Instead, it dispatches events handled by Managers, separating combat presentation from core logic.

🚀 Planned Features
Earth_Demo is progressing toward a complete Roguelike space survival game. Upcoming features include:

□ Unique Bullet Patterns: Exclusive bullet patterns for different enemies and Bosses (e.g., fan spread, spiral lasers, homing missiles).
□ Life & Research Resource Systems: Meta-progression systems outside of individual runs.
□ Planet Development: Establish bases and upgrade the tech tree.
□ Spaceship Exploration & Resource Gathering: Explore star systems on the world map and mine rare minerals.
□ Defense Against Pirate Attacks: Protect planetary resources from random space pirate invasions, in addition to proactive strikes.
🛠️ Development Setup
Install Cocos Creator 3.8 or higher.

Clone this project and import it into the Cocos Dashboard.

Open the Scenes/HallScene.scene or related main scene.

Click the Play button at the top of the editor to preview the game.