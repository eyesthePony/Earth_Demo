
import { _decorator, Component, Node, view, EventTouch, UITransform, Vec3, Prefab, instantiate, director, PhysicsSystem2D, Collider2D } from 'cc';
import { BasePlane } from './BasePlane';
import{BulletManager} from '../bullet/BulletManager';
const { ccclass, property } = _decorator;

@ccclass('player')
export class player extends  BasePlane {

    @property(BulletManager)
    bulletManager: BulletManager = null!;

    private scrWidth = 0;
    private scrHeight = 0;
    private halfW = 0;      // 飞机半宽
    private halfH = 0;      // 飞机半高
    private isSelected = false;
    private _shootDir = new Vec3(0, 1, 0);


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

    }

    update(deltaTime: number) {
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
        this.bulletManager.spawnBullet(true, this.node.worldPosition, this._shootDir, 10, 500);
    }
}