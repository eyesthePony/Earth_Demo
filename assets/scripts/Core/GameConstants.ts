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

        // 游戏流程 状态切换
        GAME_START: 'GAME_START',           // 开始游戏
        GAME_PAUSE: 'GAME_PAUSE',           // 暂停
        GAME_RESUME: 'GAME_RESUME',         // 继续
        GAME_OVER: 'GAME_OVER',             // 玩家死
        GAME_VICTORY: 'GAME_VICTORY',       // 胜利
        GAME_RESTART: 'GAME_RESTART',       // 重开
        GAME_QUIT: 'GAME_QUIT',             // 退出
        GAME_REVIVE: 'GAME_REVIVE',         // 复活
        GAME_SETTLE: 'GAME_SETTLE',         // 结算

    };

    // ========== 子弹阵营/分组 ==========
    public static ITEM_GROUP = {
        ENEMY_BULLET: 8,     // 敌方子弹组
        SELF_BULLET: 16,      // 我方子弹组
        ENEMY_PLANE: 4,      // 敌机组
        SELF_PLANE: 2,       // 我方机组
    };

 

}