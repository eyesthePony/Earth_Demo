import { _decorator, Component, Node, Prefab, view, Vec3 } from 'cc';
import { PoolManager } from '../Core/PoolManager';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
import { BasePlane } from '../Entity/plane/BasePlane';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    private static _instance:EnemyManager = null;

    @property(Prefab)
    normalEnemyPrefab: Prefab = null!;

    @property(Prefab)
    bossPrefab: Prefab = null!;

    @property({ tooltip: "生成间隔（秒）" })
    spawnRate = 1;

    private scrWidth = 0;
    private topY = 0;
   

    onLoad() {
        EnemyManager._instance = this;
        const size = view.getVisibleSize();
        this.scrWidth = size.width;
        this.topY = size.height / 2;
        EventBus.on(GameConstants.EVENT_TYPE.GAME_RESET,this.onGameReset,this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this.onStateChanged,this);
        EventBus.on(GameConstants.EVENT_TYPE.ENEMY_KILLED, this.onEnemyRecycle, this);
        EventBus.on(GameConstants.EVENT_TYPE.ENEMY_ESCAPED,this.onEnemyRecycle,this);
        EventBus.on(GameConstants.EVENT_TYPE.PLAYER_BULLET_HIT, this.onHit, this);
    }

    static get instance():EnemyManager{
        if(!this._instance){
            this._instance = new EnemyManager();
        }
        return this._instance;
    }

    private onGameReset(){
        const enemies = this.node.children;  
        for(let i = enemies.length - 1;i >= 0;--i){
            PoolManager.instance.putNode(enemies[i]);
        }
    }

    private onStateChanged(state:string){
        // 游戏开始，启动飞机
        if(state === GameConstants.GAME_STATE.PLAYING){
            this.setEnemiesEabled(true);
        }else{//游戏暂停，关闭飞机。
            this.setEnemiesEabled(false);
        }
    }

    private setEnemiesEabled(isEnabled:boolean){
        const enemies = this.node.children;

        for(let i = enemies.length - 1;i >= 0;--i){
            const enemy = enemies[i].getComponent(BasePlane);
            if(enemy){
                enemy.enabled = isEnabled;
            }   
        }
    }

    private onEnemyRecycle(enemyNode: Node) {
        PoolManager.instance.putNode(enemyNode);
    }
    
   

    private onHit(enemyNode: Node, damage:number){
       const plane =  enemyNode.getComponent(BasePlane);
       if (!plane) return;
       plane.takeDamage(damage);
    }

    public spawnEnemy(enemyType:string) {
        let prefabToSpawn:Prefab = null;
        let spawnX = 0; // 默认 X 坐标为 0（屏幕中间）

        //生成不同类型敌机
        switch(enemyType){
            case GameConstants.ENEMY_TYPE.BOSS:
                prefabToSpawn = this.bossPrefab;
                break;
            case GameConstants.ENEMY_TYPE.NORMAL:
            default: // 防止配表写错导致崩溃，默认按普通怪处理
                prefabToSpawn = this.normalEnemyPrefab;
                // 普通怪：随机 X，范围在屏幕内缩一点
                const halfW = 50;
                const minX = -this.scrWidth / 2 + halfW;
                const maxX = this.scrWidth / 2 - halfW;
                spawnX = minX + Math.random() * (maxX - minX);
        }

        if (!prefabToSpawn) return;

        const enemy = PoolManager.instance.getNode(prefabToSpawn, this.node);
        const plane = enemy.getComponent(BasePlane);

        const position = new Vec3(spawnX, this.topY + 100, 0);
        // 从屏幕顶外面生成
        plane.init(position);
    }

    

    onDestroy() {
        EventBus.off(GameConstants.EVENT_TYPE.GAME_RESET,this.onGameReset,this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this.onStateChanged,this);
        EventBus.off(GameConstants.EVENT_TYPE.ENEMY_KILLED, this.onEnemyRecycle, this);
        EventBus.off(GameConstants.EVENT_TYPE.ENEMY_ESCAPED,this.onEnemyRecycle,this);
        EventBus.off(GameConstants.EVENT_TYPE.PLAYER_BULLET_HIT, this.onHit, this);
    }
}