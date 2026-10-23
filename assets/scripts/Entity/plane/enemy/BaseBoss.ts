import { _decorator, Component, Node, tween, UITransform, Vec3, view } from 'cc';
import { BasePlane } from '../BasePlane';
import { EventBus } from '../../../Core/EventBus';
import { GameConstants } from '../../../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('BaseBoss')
export class BaseBoss extends BasePlane{
    
    //boss阶段
    protected _phase:number = 1;

    //正在入场，boss无敌
    protected _isEntering = true;

    public init(pos: Vec3) {
        this.node.setPosition(pos);//设置初始位置
        this._invincibleTimer = 0; //设置被击中无敌时间倒计时
        this._isDead = false;      //死亡判断重置
        this.invincibiltyDuration = 0; //无敌时间
        this._phase = 1;       //重置阶段
        this._isEntering = true; //重置开场 
        this.enabled = true; 
         // 清空可能残留的 Tween 动画
        tween(this.node).stop();
        
        this.enterScreen();
    }

   
    protected enterScreen() {
        // 2秒慢慢飘进来
        const visibleSize = view.getVisibleSize();
        const ut = this.getComponent(UITransform)!;
        
        // ✅ 修正位置：停在距离屏幕顶端往下大约 200 像素的位置
        // 假设屏幕中心是 0，顶部就是 visibleSize.height / 2
        const targetY = visibleSize.height / 2 - ut.height / 2 - 150; 
        const targetPos = new Vec3(0, targetY, 0);
        tween(this.node)
        .to(2, { position: targetPos }, { easing: 'sineOut' })
        .call(() => {
            this._isEntering = false; //入场结束，可以射击和被伤害了
            this.onEnterComplete();
        })
        .start();
    }

    
    // 留给子类重写：入场结束后干嘛？
    protected onEnterComplete() {}

    
    // 掉血逻辑（通用）
    public takeDamage(damage: number) {
        if (this._isEntering || this.isDead) return;
        this.hp -= damage;
        if (this.hp <= 0) this.onDeath();
        else this.checkPhase();
    }

    // 留给子类重写：血量低于阈值时干嘛？
    protected checkPhase() {}

    protected onDeath(): void {
        if(this._isDead) return;
        this._isDead = true;
        tween(this.node).stop(); 
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.ENEMY_KILLED, this.node);
    }





}


