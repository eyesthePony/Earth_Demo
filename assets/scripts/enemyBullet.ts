import { _decorator, Component, Node, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('enemyBullet')
export class enemyBullet extends Component {

    @property
    private speed:number = 100;
    @property
    private playerNode:Node = null;
    @property destroyMargin = 100;  

    private bottomY = 0;
    private _tmpPos = new Vec3();

    onLoad(){
         const size = view.getVisibleSize();
        // 屏幕顶 = 屏幕中心 + 半高
        this.bottomY = -size.height / 2;
    }


    start() {

    }

    update(deltaTime: number) {
        this.node.getPosition(this._tmpPos);
        this._tmpPos.y -= this.speed * deltaTime;
        this.node.setPosition(this._tmpPos);

        // 子弹完全飞出屏幕顶再销毁
        if (this._tmpPos.y < this.bottomY + this.destroyMargin) {
            this.node.destroy();
        }
    }
}


