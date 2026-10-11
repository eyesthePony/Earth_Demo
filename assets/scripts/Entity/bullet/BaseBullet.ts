import { EventBus } from '../../Core/EventBus';
import { GameConstants } from '../../Core/GameConstants';
import { _decorator, Collider2D, Component, Contact2DType, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseBullet')
export class BaseBullet extends Component {
    @property({ tooltip: "子弹速度" })
    public speed: number = 200;

    @property({ tooltip: "子弹伤害" })
    public damage: number = 10;

    @property({ tooltip: "最大射程" })
    public maxDistance: number = 900;

    @property({ tooltip: "是否是玩家子弹" })
    public playerBullet: boolean = true;

    private _direction: Vec3 = new Vec3(0, 1, 0);
    private _startPos: Vec3 = new Vec3();

    start() {
        // 1. 记录起始位置
        this._startPos.set(this.node.position);

        // 2. 根据阵营设方向
        this._direction = this.playerBullet
            ? new Vec3(0, 1, 0)    // 玩家子弹向上
            : new Vec3(0, -1, 0);  // 敌人子弹向下

        // 3. 注册碰撞
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number) {
        const pos = this.node.position;
        this.node.setPosition(
            pos.x + this._direction.x * this.speed * deltaTime,
            pos.y + this._direction.y * this.speed * deltaTime,
            pos.z
        );

        // 超出射程，通知回收
        if (Vec3.distance(this._startPos, this.node.position) >= this.maxDistance) {
            EventBus.dispatchEvent(GameConstants.EVENT_TYPE.BULLET_KILLED, this.node);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        const isSelf = selfCollider.group === GameConstants.ITEM_GROUP.SELF_BULLET
                    && otherCollider.group === GameConstants.ITEM_GROUP.ENEMY_PLANE;
        const isEnemy = selfCollider.group === GameConstants.ITEM_GROUP.ENEMY_BULLET
                     && otherCollider.group === GameConstants.ITEM_GROUP.SELF_PLANE;

        if (!isSelf && !isEnemy) return;

        selfCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        // 1. 先发战斗事件（GameManager 用）
        if (isSelf) {
            EventBus.dispatchEvent("PLAYER_BULLET_HIT", otherCollider.node, this.damage);
        } else {
            EventBus.dispatchEvent("ENEMY_BULLET_HIT", otherCollider.node, this.damage);
        }
 
        // 2. 再发回收事件（BulletManager 用）
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.BULLET_KILLED, this.node);
    }
}