import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BaseBullet } from './BaseBullet';
import{PoolManager} from '../../Core/PoolManager';
import { EventBus } from '../../Core/EventBus';
import { GameConstants } from '../../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {

    @property(Prefab)
    playerBulletPrefab: Prefab = null;

    @property(Prefab)
    enemyBulletPrefab: Prefab = null;

    

    onLoad() {
        
        EventBus.on(GameConstants.EVENT_TYPE.BULLET_KILLED, this.onBulletRecycle, this);
    
    }

   public spawnBullet(isPlayerBullet: boolean, spawnPos: Vec3, dir: Vec3, damage: number, speed: number): void {
        const prefab = isPlayerBullet ? this.playerBulletPrefab : this.enemyBulletPrefab;

        // 从 PoolManager 取，没有就新建
        let bulletNode = PoolManager.instance.getNode(prefab, this.node);

        const bulletComp = bulletNode.getComponent(BaseBullet);
        if (!bulletComp) return;

        // 再设置参数
        bulletComp.playerBullet = isPlayerBullet;
        bulletComp.damage = damage;
        bulletComp.speed = speed;
        bulletComp.setDirection(dir);
        bulletNode.setWorldPosition(spawnPos);
    
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
        EventBus.off(GameConstants.EVENT_TYPE.BULLET_KILLED, this.onBulletRecycle, this);
    }


}


