import { _decorator, Component, view, UITransform, Collider2D, Contact2DType, IPhysics2DContact, Animation } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 敌机脚本
 * 挂在敌机 Prefab 的根节点上
 * 物理系统：Builtin（只需要 Collider2D，不需要 RigidBody2D）
 * 职责：
 *   1. 从屏幕顶外随机 X 生成
 *   2. 匀速往下飞
 *   3. 飞出屏幕底部自动销毁
 *   4. 被子弹打中扣血，血量归零播爆炸动画再销毁
 */
@ccclass('enemy')
export class enemy extends Component {

    // ==================== 编辑器可调参数 ====================

    /** 下落速度（逻辑单位/秒） */
    @property speed = 300;

    /** 动画组件；未在 Inspector 指定时使用当前节点上的 Animation */
    @property(Animation)
    private anim: Animation | null = null;

    // ==================== 运行时内部变量 ====================

    /** 自己的碰撞体组件 */
    private collider: Collider2D = null!;

    /** 屏幕高度（逻辑单位） */
    private scrHeight = 0;

    /** 屏幕宽度（逻辑单位） */
    private scrWidth = 0;

    /** 自己高度的一半 */
    private halfH = 0;

    /** 屏幕底部的 Y 坐标（相对 Canvas 中心） */
    private bottomY = 0;

    /** 血量 */
    private hp = 1;

    /** 是否已经死亡，防止重复触发 */
    private isDead = false;

    // ==================== 生命周期 ====================

    /**
     * onLoad：节点第一次加载时调用，只执行一次
     */
    onLoad() {
        // --- 1. 拿屏幕逻辑尺寸 ---
        const size = view.getVisibleSize();
        this.scrHeight = size.height;
        this.scrWidth = size.width;

        // --- 2. 算屏幕底部边界（Canvas 中心为原点，所以是 -height/2）---
        this.bottomY = -this.scrHeight / 2;

        // --- 3. 拿自己的尺寸（尺寸在 UITransform 上，不在 Node 上）---
        const ut = this.getComponent(UITransform)!;
        this.halfH = ut.height / 2;

        // --- 4. 拿碰撞体引用 ---
        this.collider = this.getComponent(Collider2D)!;

        // --- 5. 拿动画组件引用 ---
        if (!this.anim) this.anim = this.getComponent(Animation);

        // --- 6. 校验关键组件 ---
        if (!this.collider) console.error('enemy: 缺少 Collider2D 组件');
        
    }

    /**
     * start：第一次 update 之前调用，只执行一次
     * 播放常态动画
     */
    start() {
        if (this.anim?.clips.some(clip => clip.name === 'idle')) {
            this.anim.play('idle');
        }
    }

    /**
     * onEnable：节点每次被启用时调用
     * 碰撞回调在这里注册，配合 onDisable 成对出现
     */
    onEnable() {
   
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    /**
     * onDisable：节点每次被禁用时调用
     * 解绑碰撞回调
     */
    onDisable() {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    // ==================== 每帧更新 ====================

    /**
     * update：每帧调用
     * 职责：往下移动 + 出界销毁
     */
    update(dt: number) {
      
        // 死亡后停止移动，等爆炸动画播完
        if (this.isDead) return;

        // --- 1. 往下移动 ---
        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * dt, pos.z);

        // --- 2. 完全飞出屏幕底部就销毁 ---
        // 下边缘 = 中心 y - halfH
        if (pos.y - this.halfH < this.bottomY) {
            this.node.destroy();
        }
    }

    // ==================== 碰撞处理 ====================

    /**
     * 碰撞开始回调
     * 先判断是否撞击的是子弹
     * 如果是再判断自己是否早已死亡，是就不管子弹
     * 不是就销毁子弹并且自己扣除血量
     * 
     */
    private onBeginContact(
        self: Collider2D,
        other: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        // 判断撞到的是不是子弹
       
        if (!other.node.name.startsWith('Bullet')) return;

        // 已经死了就不再扣血
        if (this.isDead) return;

        // 子弹碰到敌机就销毁
        other.node.destroy();

        this.hp -= 1;
        

        if (this.hp <= 0) {
            this.die();
        }
    }

    // ==================== 死亡处理 ====================

    /**
     * 死亡：播放爆炸动画，动画播完销毁自己
     */
    private die() {
        if (this.isDead) return;
        this.isDead = true;

        // 关键：关掉碰撞体，死了就不再接收碰撞
        if (this.collider) this.collider.enabled = false;

        // --- 1. 没有动画组件就直接销毁 ---
        if (!this.anim || !this.anim.clips.some(clip => clip.name === 'explosion')) {
            this.node.destroy();
            return;
        }

        // --- 2. 停掉 idle，播 explosion ---
        this.anim.stop();
        this.anim.play('explosion');

        // --- 3. 动画播完，销毁节点 ---
        this.anim.once(Animation.EventType.FINISHED, () => {
            this.node.destroy();
        });
    }
}