import { _decorator, Component, Node, UITransform, Vec3, view } from 'cc';
import { BasePlane } from './BasePlane';
import { BulletManager } from '../bullet/BulletManager';
import { EventBus } from '../../Core/EventBus';
import { GameConstants } from '../../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('EnemyPlane')
export class EnemyPlane extends BasePlane {
    

    private scrWidth = 0;
    private scrHeight = 0;
    private halfW = 0;      // 飞机半宽
    private halfH = 0;      // 飞机半高
    private bottomY = 0;
    private _shootDir = new Vec3(0, -1, 0);


    onLoad() {
        const size = view.getVisibleSize();
        this.scrHeight = size.height;
        this.bottomY = -this.scrHeight / 2;   // ← 补上

        const ut = this.getComponent(UITransform)!;
        this.halfH = ut.height / 2;
    }

    update(deltaTime: number) {
        // 执行基类update：无敌计时、开火计时、死亡判断
        super.update(deltaTime);

         // 往下飞
        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.moveSpeed * deltaTime, pos.z);

        // 完全飞出屏幕底部就销毁
        if (pos.y - this.halfH < this.bottomY) {
            EventBus.dispatchEvent(GameConstants.EVENT_TYPE.ENEMY_KILLED, this.node);
            return;
        }

        // CD冷却完毕发射子弹
        if (this._fireTimer <= 0) {
            this.shoot();
            this._fireTimer += this.fireCd;
        }
    }



    shoot(){
        BulletManager.instance.spawnBullet(false, this.node.position, this._shootDir, 10, 500);
    }
}


