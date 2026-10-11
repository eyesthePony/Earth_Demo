import { PoolManager } from './Core/PoolManager';
import { _decorator, Component, Node, view, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bullet')
export class bullet extends Component {

    @property speed = 500;
    @property destroyMargin = 100;   // 出屏后额外余量

    private topY = 0;
    private _tmpPos = new Vec3();

    onLoad() {
        const size = view.getVisibleSize();
        // 屏幕顶 = 屏幕中心 + 半高
        this.topY = size.height / 2;
   
        
    }

    update(dt: number) {
        this.node.getPosition(this._tmpPos);
        this._tmpPos.y += this.speed * dt;
        this.node.setPosition(this._tmpPos);

        // 子弹完全飞出屏幕顶再销毁
        if (this._tmpPos.y > this.topY + this.destroyMargin) {
            PoolManager.instance.putNode(this.node);
        }
    }
}