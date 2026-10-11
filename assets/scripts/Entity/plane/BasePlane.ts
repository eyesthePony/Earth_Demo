import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BasePlane')
export class BasePlane extends Component {

    @property
    hp: number = 100;
    @property
    moveSpeed: number = 200;
    @property
    fireCd: number = 0.2;

    protected _fireTimer: number = 0;
    protected _invincibleTimer: number = 0;

    // 对外受伤接口，GameManager调用
    takeDamage(damage: number) {
        if (this._invincibleTimer > 0) return;

        this.hp -= damage;
        this._invincibleTimer = 1; // 默认1秒无敌，子类可以覆盖

        if (this.hp <= 0) {
            this.onDeath();
        }
    }

    // 虚方法，子类重写
    protected onDeath() {}

    protected fireBullet() {}

    update(deltaTime: number) {
        // 无敌倒计时，基类统一处理
        if (this._invincibleTimer > 0) {
            this._invincibleTimer -= deltaTime;
        }
        this._fireTimer -= deltaTime;
    }
}


