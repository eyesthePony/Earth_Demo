
import { _decorator, Component, Node, view, EventTouch, UITransform, Vec3, Prefab, instantiate, director, PhysicsSystem2D, Collider2D } from 'cc';
import { BasePlane } from './BasePlane';
import{BulletManager} from '../bullet/BulletManager';
import { EventBus } from '../../Core/EventBus';
import { GameConstants } from '../../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('player')
export class player extends  BasePlane {

   

    private scrWidth = 0;
    private scrHeight = 0;
    private halfW = 0;      // 飞机半宽
    private halfH = 0;      // 飞机半高
    private isSelected = false;
    private _shootDir = new Vec3(0, 1, 0);
    private _isDead: boolean = false;


    onLoad() {
        const size = view.getVisibleSize();
        this.scrWidth = size.width;
        this.scrHeight = size.height;

        // 拿飞机自身的尺寸
        const ut = this.getComponent(UITransform)!;
        this.halfW = ut.width * ut.anchorX;         // 锚点左侧宽度
        this.halfH = ut.height * ut.anchorY;        // 锚点下侧高度

        // 注册触摸【补上！】
        this.addTouchListeners();

        // PlayerPlane.onLoad
        EventBus.on(GameConstants.EVENT_TYPE.ENEMY_BULLET_HIT, this.onHit, this);

    }

    update(deltaTime: number) {
        if(this._isDead) return;
        // 执行基类update：无敌计时、开火计时、死亡判断
        super.update(deltaTime);

        // CD冷却完毕发射子弹
        if (this._fireTimer <= 0) {
            this.shoot();
            this._fireTimer += this.fireCd;
        }
    }


    addTouchListeners(){
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        // PlayerPlane.onDestroy
        EventBus.off(GameConstants.EVENT_TYPE.ENEMY_BULLET_HIT, this.onHit, this);
    }

    private onTouchStart(e: EventTouch) {
        this.isSelected = true;
    }

    private onTouchMove(e: EventTouch) {
        if (!this.isSelected) return;

        // 直接拿本次触摸相对上次的位移（UI 坐标）
        const delta = e.getUIDelta();

        const pos = this.node.position;
        let newX = pos.x + delta.x;
        let newY = pos.y + delta.y;

        // 边界钳制
        const maxX = this.scrWidth / 2 - this.halfW;
        const maxY = this.scrHeight / 2 - this.halfH;
        newX = Math.max(-maxX, Math.min(maxX, newX));
        newY = Math.max(-maxY, Math.min(maxY, newY));

        this.node.setPosition(newX, newY, pos.z);
    }

    private onTouchEnd() {
        this.isSelected = false;
    }

    shoot(){
        BulletManager.instance.spawnBullet(true, this.node.position, this._shootDir, 10, 500);
    }

    onHit(playerNode: Node, damage:number){
        // 事件里传的 otherCollider.node 就是玩家节点，判断一下是不是自己
        if (playerNode !== this.node) return;
        this.takeDamage(damage);
    }

       // 虚方法，子类重写
    protected onDeath() {
        console.log('[Player] dead');
        this._isDead = true;  // 如果你加了 _isDead 字段的话，用来阻止 update 继续 shoot
        this.node.destroy(); 
    }
}