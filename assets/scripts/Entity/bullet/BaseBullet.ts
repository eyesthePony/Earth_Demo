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

    private _isDead: boolean = false;   // 防止重复回收

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onEnable() {
        this._isDead = false;
        // 1. 记录起始位置
        this._startPos.set(this.node.position);

        // 2. 根据阵营设方向
        if(this.playerBullet){
            this._direction.set(0, 1, 0);
        } else {
            this._direction.set(0, -1, 0);
        }
    }

    update(deltaTime: number) {
        if(this._isDead) return;
        const pos = this.node.position;
        this.node.setPosition(
            pos.x + this._direction.x * this.speed * deltaTime,
            pos.y + this._direction.y * this.speed * deltaTime,
            pos.z
        );

        // 超出射程，通知回收
        if (Vec3.distance(this._startPos, this.node.position) >= this.maxDistance) {
            this._isDead = true;
            EventBus.dispatchEvent(GameConstants.EVENT_TYPE.BULLET_KILLED, this.node);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if(this._isDead) return;
        
        const isSelf = selfCollider.group === GameConstants.ITEM_GROUP.SELF_BULLET
                    && otherCollider.group === GameConstants.ITEM_GROUP.ENEMY_PLANE;
        const isEnemy = selfCollider.group === GameConstants.ITEM_GROUP.ENEMY_BULLET
                     && otherCollider.group === GameConstants.ITEM_GROUP.SELF_PLANE;

        if (!isSelf && !isEnemy) return;
        this._isDead = true;
        // 1. 先发战斗事件（GameManager 用）
        if (isSelf) {
            EventBus.dispatchEvent(GameConstants.EVENT_TYPE.PLAYER_BULLET_HIT, otherCollider.node, this.damage);
        } else {
            EventBus.dispatchEvent(GameConstants.EVENT_TYPE.ENEMY_BULLET_HIT, otherCollider.node, this.damage);
        }
 
         EventBus.dispatchEvent(GameConstants.EVENT_TYPE.BULLET_KILLED, this.node);
    }

    public setDirection(dir: Vec3) {
        this._direction.set(dir);
    }


}