import { PoolManager } from './Core/PoolManager';
import { _decorator, Component, Node, view, EventTouch, UITransform, Vec3, Prefab, instantiate, director, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

PhysicsSystem2D.instance.enable = true;

@ccclass('player')
export class player extends Component {

    @property speed = 1;

    private scrWidth = 0;
    private scrHeight = 0;
    private halfW = 0;      // 飞机半宽
    private halfH = 0;      // 飞机半高
    private isSelected = false;


    @property(Node) bulletParent: Node = null!;
    @property(Prefab) bulletPrefab: Prefab  = null;
    private shootInterval = 0.2;

    onLoad() {
        const size = view.getVisibleSize();
        this.scrWidth = size.width;
        this.scrHeight = size.height;

        // 拿飞机自身的尺寸
        const ut = this.getComponent(UITransform)!;
        this.halfW = ut.width * ut.anchorX;         // 锚点左侧宽度
        this.halfH = ut.height * ut.anchorY;        // 锚点下侧高度
    }

    start() {
        this.addTouchListeners();
        this.schedule(this.shoot, this.shootInterval);

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
    let newX = pos.x + delta.x * this.speed;
    let newY = pos.y + delta.y * this.speed;

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
        const bullet = PoolManager.instance.getNode(this.bulletPrefab, this.bulletParent);
        // 位置用世界坐标，避免父节点偏移影响
        const worldPos = this.node.getWorldPosition();
        bullet.setWorldPosition(worldPos.x, worldPos.y + this.halfH, worldPos.z);
    }
}