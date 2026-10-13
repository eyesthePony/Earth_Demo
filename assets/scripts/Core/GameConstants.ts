import { Vec3 } from "cc";

export class GameConstants {

    // ========== 事件名称 ==========
    public static EVENT_TYPE = {
        // 子弹相关
        BULLET_KILLED: "bulletKilled",           // 子弹节点回收
        REMOVE_BULLET: "removeBullet",           // 从数组移除子弹
        PLAYER_BULLET_HIT: "playerBulletHit",    // 我方子弹击中
        ENEMY_BULLET_HIT: "enemyBulletHit",      // 敌方子弹击中
        ENEMY_KILLED: "enemyKilled",

        // 游戏流程
        ON_GAME_START: "onGameStart",
        ON_GAME_STOP: "onGameStop",
        ON_GAME_CONTINUE: "onGameContinue",
        ON_GAME_RESTART: "onGameRestart",

        // 玩家
        GAME_PLANE_BLOOD: 20,          // 玩家血量总量
        GAME_PLANE_BLOOD_WARN: 6,      // 低血量警告值

        // 背景
        GAME_DISTANCE: "gameDistance", // 背景移动计时
    };

    // ========== 子弹阵营/分组 ==========
    public static ITEM_GROUP = {
        ENEMY_BULLET: 8,     // 敌方子弹组
        SELF_BULLET: 16,      // 我方子弹组
        ENEMY_PLANE: 4,      // 敌机组
        SELF_PLANE: 2,       // 我方机组
    };

    // ========== 子弹类型（用于BulletALL的switch） ==========
    public static BULLET_ALL_TYPE = {
        BULLET1: "Bullet1",              // 玩家普通子弹
        BULLET2: "Bullet2",              // 玩家激光子弹
        ENEMY_BULLET1: "EnemyBullet1",   // 敌机普通子弹
    };

    // ========== 子弹速度 ==========
    public static BULLET_SPEED = {
        NORMAL: 1,           // 普通子弹速度（基准）
        PLAYER: 800,         // 玩家子弹速度
        ENEMY: 300,          // 敌方子弹速度
    };

    // ========== 子弹发射间隔（帧） ==========
    public static BULLET_INTERVAL = {
        NORMAL: 12,      // 普通间隔12帧
        FAST: 8,         // 快速间隔8帧
    };

    // ========== 游戏数值 ==========
    public static GAME_VALUE = {
        PLAYER_MOVING_VALUE: 0.07,   // 玩家移动衰减
        ENEMY_TIME: 180,             // 敌机出现间隔（帧）
        BG_MOVE_TIME: 179,           // 背景移动时间
        ENEMYBULLET_SPEED: 60,       // 敌机开炮间隔
        PLAYER_ADSORB: 7,            // 玩家吸附道具范围
        COLLISION_RADIUS: 80,        // 碰撞判定半径
    };

    // ========== 屏幕边界 ==========
    public static SCREEN = {
        TOP: 700,
        BOTTOM: -700,
        LEFT: -360,
        RIGHT: 360,
        SPAWN_Y: 700,       // 敌机从上方生成
        DESTROY_Y: -700,    // 飞出屏幕底部销毁
    };

    // ========== 动态加载路径 ==========
    public static LOADING_PATH = {
        PLAYER_PLANE: "player/player",
        ENEMY_PLANE: "enemy/enemy",
        SELF_BULLET: "bullet/playerBullet",
        ENEMY_BULLET: "bullet/enemyBullet",
        EXPLODE: "explode/explode",
    };

    // ========== 对象池Key ==========
    public static POOL_KEY = {
        PLAYER_BULLET: "playerBullet",
        ENEMY_BULLET: "enemyBullet",
        ENEMY_PLANE: "enemyPlane",
        EFFECT: "effect",
    };

    // ========== 音频 ==========
    public static AUDIO_SOUND = {
        CLICK: "click",
        BOOM: "boom",
        BULLET1: "bullet1",
    };
}