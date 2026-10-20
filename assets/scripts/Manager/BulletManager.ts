import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BaseBullet } from '../Entity/bullet/BaseBullet';
import{PoolManager} from '../Core/PoolManager';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {

    static instance: BulletManager = null!;   

    @property(Prefab)
    playerBulletPrefab: Prefab = null;

    @property(Prefab)
    enemyBulletPrefab: Prefab = null;

    

    onLoad() {
        BulletManager.instance = this; 
        EventBus.on(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this.onStateChanged,this);
        EventBus.on(GameConstants.EVENT_TYPE.BULLET_KILLED, this.onBulletRecycle, this);
    }

    onStateChanged(state:string){
         // 游戏开始，启动定时器
        if(state === GameConstants.GAME_STATE.PLAYING){
            this.setBulletsEnabled(true);
        }else{
            this.setBulletsEnabled(false);
        }
    }

    private setBulletsEnabled(isEnabled:boolean){
        const bullets = this.node.children;
        const length = bullets.length;
        for(let i=length-1;i>=0;--i){
            const bullet = bullets[i].getComponent(BaseBullet);
            if(bullet){
                bullet.enabled = isEnabled;
            }
        }

    }

    
    public spawnBullet(isPlayerBullet: boolean, spawnPos: Vec3, dir: Vec3, damage: number, speed: number): void {
        const prefab = isPlayerBullet ? this.playerBulletPrefab : this.enemyBulletPrefab;
        
        // 从 PoolManager 取，没有就新建
        let bulletNode = PoolManager.instance.getNode(prefab, this.node);

        const bulletComp = bulletNode.getComponent(BaseBullet);
        
        if (!bulletComp) return;
        // 一行搞定所有初始化
        bulletComp.init(isPlayerBullet, dir, damage, speed, spawnPos);

    }

    // 收到BULLET_KILLED事件，回收子弹
    private onBulletRecycle(bulletNode: Node): void {
        const bulletComp = bulletNode.getComponent(BaseBullet);
        if (!bulletComp) return;
        // 放回对应池子
        PoolManager.instance.putNode(bulletNode);

    }

   

    onDestroy() {
        // EventBus是全局事件，不是节点组件事件，必须手动解绑！
        EventBus.off(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this.onStateChanged,this);
        EventBus.off(GameConstants.EVENT_TYPE.BULLET_KILLED, this.onBulletRecycle, this);
    }


}


