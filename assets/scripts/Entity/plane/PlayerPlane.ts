import { _decorator, Component, Node, Vec3 } from 'cc';
import { BasePlane } from './BasePlane';
import { BulletManager } from '../bullet/BulletManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerPlane')
export class PlayerPlane extends BasePlane {
    @property(BulletManager)
    bulletMgr: BulletManager = null!;

    private _keyMap: Record<string, boolean> = {};
    private _moveDir: Vec3 = new Vec3();

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(e: EventKeyboard) {
        this._keyMap[e.keyCode] = true;
    }
    onKeyUp(e: EventKeyboard) {
        this._keyMap[e.keyCode] = false;
    }

    update(deltaTime: number) {
        // 先执行基类update（无敌、开火计时）
        super.update(deltaTime);

        // 玩家移动
        this._moveDir.set(0,0,0);
        if(this._keyMap[37]) this._moveDir.x -=1;
        if(this._keyMap[39]) this._moveDir.x +=1;
        if(this._keyMap[38]) this._moveDir.y +=1;
        if(this._keyMap[40]) this._moveDir.y -=1;
        this._moveDir.normalize();
        this.node.translate(this._moveDir.multiplyScalar(this.moveSpeed * deltaTime));

        // 空格发射子弹
        if(this._keyMap[32] && this._fireTimer <= 0) {
            this.fireBullet();
            this._fireTimer = this.fireCd;
        }
    }

    protected fireBullet() {
        const pos = this.node.worldPosition;
        this.bulletMgr.spawnBullet(true, pos, new Vec3(0,1,0), 10, 300);
    }

    protected onDeath() {
        // 玩家死亡事件
        director.getScene().emit(GameConstants.EVENT_TYPE.PLAYER_DEATH);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}


