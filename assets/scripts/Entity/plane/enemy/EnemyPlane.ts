import { _decorator, Component, Node, UITransform, Vec3, view } from 'cc';
import { BasePlane } from '../BasePlane';
import { BulletManager } from '../../../Manager/BulletManager';
import { EventBus } from '../../../Core/EventBus';
import { GameConstants } from '../../../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('EnemyPlane')
export class EnemyPlane extends BasePlane  {
    
    private scrHeight = 0;
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

    // 新增：显式初始化
    public init(position: Vec3) {
        this.node.setPosition(position);
        this._invincibleTimer = 0; 
        this.hp = 100;
        this._isDead = false;
        this._fireTimer = 0;  
        this.fireCd = 1;
    }

    update(deltaTime: number) {
        if(this._isDead) return;
        // 执行基类update：无敌计时、开火计时、死亡判断
        super.update(deltaTime);

        const cur = this.node.position;
        const newY = cur.y - this.moveSpeed * deltaTime;
        this.node.setPosition(cur.x, newY, cur.z);

        if (newY - this.halfH < this.bottomY) {
            this._isDead = true;
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

    // 对外受伤接口，GameManager调用
    takeDamage(damage: number) {
        if (this.hp <= 0) return; 
        this.hp -= damage;
        if (this.hp <= 0) {
            this.onDeath();
        }
    }

    protected onDeath(): void {
        if(this._isDead) return;
        this._isDead = true;
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.ENEMY_KILLED, this.node);
    }

    
}


