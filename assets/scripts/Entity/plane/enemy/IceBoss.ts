import { _decorator,Vec3 } from 'cc';
import { BulletManager } from '../../../Manager/BulletManager';
import { GameConstants } from '../../../Core/GameConstants';
import { BaseBoss } from './BaseBoss';
const { ccclass, property } = _decorator;

@ccclass('IceBoss')
export class IceBoss extends BaseBoss {

    
    //控制左右移动，使用sin，patrolTime根据时间周期来回移动，
    private _patrolTime = 0;
    //控制移动速度
    private _patrolSpeed = 1;
    //控制移动范围
    private _patrolRange = 250;

     //螺旋弹的角度累加器
    private _spiralAngle = 0; 


    onLoad(): void {
        this._shootDir = new Vec3(0,-1,0);
    }


    public init(pos: Vec3) {
        super.init(pos);

        this._maxHp = 1000;          //设置血量上限
        this.hp = 1000;              //设置血量
        this._fireTimer = 0;          //开火时间
        this.fireCd = 2;         //开火间隔
        this._shootDir.y = -1;
        this._patrolSpeed = 1;  //重置移速
        this._patrolTime = 0;  //重置时间   
    }

 

    update(deltaTime: number) {
        if(this.isDead) return;
        if(this._isEntering){  //入场中，不发射子弹
            return;
        }else if(this._phase === 3){

        }else{
             this._patrolTime += deltaTime * this._patrolSpeed;  //根据时间和速度来移动
             this._patrolTime %= (Math.PI * 2); //取余防止溢出，由于sin的周期是2pi，所以取余2pi
            // 用正弦波算出一个 -1 到 1 的值，乘以范围，加到中心点上，speed控制移动速度，_patrolRange移动的左右区间
            const offsetX = Math.sin(this._patrolTime) * this._patrolRange;
            
            // 更新位置（Y 轴保持在 原来位置，X 轴进行偏移）
            this.node.setPosition(offsetX, this.node.position.y, 0);
        }
        // 执行基类update：无敌计时、开火计时、死亡判断
        super.update(deltaTime);//判断是否在无敌状态，判断是否到了开火时间

    }


     // 留给子类重写：血量低于阈值时干嘛？
    protected checkPhase() {
        // 血量阶段切换
        if (this.hp < this._maxHp * 0.66 && this._phase === 1) {
            this._phase = 2;
            this.fireCd = 0.7;
            this._patrolSpeed = 2;
        }else if (this.hp < this._maxHp * 0.33 && this._phase === 2) {
            this._phase = 3;
            this.fireCd = 0.1;
            this._patrolSpeed = 3;
        }
    }


    protected shoot(): void {
          // 获取当前 Boss 的世界坐标
    const spawnPos = this.node.worldPosition;

    switch (this._phase) {
         case 1: 
                // ================= 第一阶段：冥想冰环（360度全屏） =================
                const ringCount = 16;
                for (let i = 0; i < ringCount; i++) {
                    // 均匀分布 360 度
                    const angle = (360 / ringCount) * i; 
                    const rad = angle * Math.PI / 180;
                    this._shootDir.set(Math.sin(rad), -Math.cos(rad), 0);
                    
                    BulletManager.instance.spawnBullet(
                        GameConstants.BULLET_TYPE.NORMAL, 
                        false, spawnPos, this._shootDir, 10, 150 // 慢速
                    );
                }
                break;

            case 2: 
                // ================= 第二阶段：苏醒扇形弹（瞄准玩家附近） =================
                const fanCount = 7;
                const totalAngle = 60; // 扇形总角度 60 度
                const startAngle = -totalAngle / 2; 
                const angleStep = totalAngle / (fanCount - 1); 

                for (let i = 0; i < fanCount; i++) {
                    // ✅ 修复：根据步长算出每一发的角度
                    const angle = startAngle + i * angleStep;
                    const rad = angle * Math.PI / 180;
                    this._shootDir.set(Math.sin(rad), -Math.cos(rad), 0);
                    
                    BulletManager.instance.spawnBullet(
                        GameConstants.BULLET_TYPE.NORMAL, 
                        false, spawnPos, this._shootDir, 15, 300 // 中速
                    );
                }
                break;

            case 3: 
                // ================= 第三阶段：暴怒双螺旋 =================
                // ✅ 修复：每次开火，角度递增，形成旋转
                this._spiralAngle += 15; 
                this._spiralAngle %= 360;

                // 双臂螺旋（相差 180 度）
                for (let i = 0; i < 2; i++) {
                    const angle = this._spiralAngle + (i * 180);
                    const rad = angle * Math.PI / 180;
                    this._shootDir.set(Math.sin(rad), -Math.cos(rad), 0);
                    
                    BulletManager.instance.spawnBullet(
                        GameConstants.BULLET_TYPE.NORMAL, 
                        false, spawnPos, this._shootDir, 20, 400 // 高速
                    );
                }
                break;
        }
    }
    

    

}


