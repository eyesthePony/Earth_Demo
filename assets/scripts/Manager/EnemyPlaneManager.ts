import { _decorator, Component, Node, Prefab, view, math, Vec3 } from 'cc';
import { PoolManager } from '../Core/PoolManager';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
import { EnemyPlane } from '../Entity/plane/enemy/EnemyPlane';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property(Prefab)
    enemyPrefab: Prefab = null!;

    @property({ tooltip: "生成间隔（秒）" })
    spawnRate = 1;

    private scrWidth = 0;
    private topY = 0;
    private spawnTimer = 0;

    onLoad() {
        const size = view.getVisibleSize();
        this.scrWidth = size.width;
        this.topY = size.height / 2;
        EventBus.on(GameConstants.EVENT_TYPE.GAME_RESET,this.onGameReset,this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this.onStateChanged,this);
        EventBus.on(GameConstants.EVENT_TYPE.ENEMY_KILLED, this.onEnemyRecycle, this);
        EventBus.on(GameConstants.EVENT_TYPE.ENEMY_ESCAPED,this.onEnemyRecycle,this);
        EventBus.on(GameConstants.EVENT_TYPE.PLAYER_BULLET_HIT, this.onHit, this);
    }

    private onGameReset(){
        const enemies = this.node.children;  
        for(let i = enemies.length - 1;i >= 0;--i){
            PoolManager.instance.putNode(enemies[i]);
        }
    }

    private onStateChanged(state:string){
        // 游戏开始，启动定时器
        this.unschedule(this.spawnEnemy);
        if(state === GameConstants.GAME_STATE.PLAYING){
            this.setEnemiesEabled(true);
            this.schedule(this.spawnEnemy, this.spawnRate);
        }else{//游戏暂停，关闭定时器。
            this.setEnemiesEabled(false);
        }
    }

    private setEnemiesEabled(isEnabled:boolean){
        const enemies = this.node.children;

        for(let i = enemies.length - 1;i >= 0;--i){
            const enemy = enemies[i].getComponent(EnemyPlane);
            if(enemy){
                enemy.enabled = isEnabled;
            }   
        }
    }

    private onEnemyRecycle(enemyNode: Node) {
        PoolManager.instance.putNode(enemyNode);
    }
    
   

    private onHit(enemyNode: Node, damage:number){
       const plane =  enemyNode.getComponent(EnemyPlane);
       if (!plane) return;
       plane.takeDamage(damage);
    }

    private spawnEnemy() {
        if (!this.enemyPrefab) return;

        const enemy = PoolManager.instance.getNode(this.enemyPrefab, this.node);
        const plane = enemy.getComponent(EnemyPlane);

        // 随机 X，范围在屏幕内缩一点
        const halfW = 50;
        const minX = -this.scrWidth / 2 + halfW;
        const maxX = this.scrWidth / 2 - halfW;
        const randomX = minX + Math.random() * (maxX - minX);
        const position = new Vec3(randomX, this.topY + 100, 0);
        // 从屏幕顶外面生成
        plane.init(position);
    }

    onDestroy() {
        this.unschedule(this.spawnEnemy);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_RESET,this.onGameReset,this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this.onStateChanged,this);
        EventBus.off(GameConstants.EVENT_TYPE.ENEMY_KILLED, this.onEnemyRecycle, this);
        EventBus.off(GameConstants.EVENT_TYPE.ENEMY_ESCAPED,this.onEnemyRecycle,this);
        EventBus.off(GameConstants.EVENT_TYPE.PLAYER_BULLET_HIT, this.onHit, this);
    }
}