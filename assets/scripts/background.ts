import { _decorator, Component, Node, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('background')
export class background extends Component {

    @property speed = 200;

    private bgs: Node[] = [];
    private bgHeight = 0;
    private screenHeight = 0;

    onLoad() {
        // 用逻辑单位
        const size = view.getVisibleSize();
        this.screenHeight = size.height;

        this.bgs = this.node.children;

        if (this.bgs.length < 2) {
            console.error('背景需要至少两张图');
            return;
        }

        // 两张图首尾相接
        // 假设锚点在中心，bg1 在 0，bg2 在 bgHeight
        this.bgHeight = this.bgs[0].getComponent(UITransform).height;

        this.bgs[0].setPosition(0, 0);
        this.bgs[1].setPosition(0, this.bgHeight);
    }

    update(dt: number) {
        const dy = this.speed * dt;
        const pos1 = this.bgs[0].position;
        const pos2 = this.bgs[1].position;
        this.bgs[0].setPosition(pos1.x, pos1.y - dy, pos1.z);
        this.bgs[1].setPosition(pos2.x, pos2.y - dy, pos2.z);  
        // 移出屏幕底部，挪到另一张上面
        if (this.bgs[0].position.y <= -this.bgHeight) {
            this.bgs[0].setPosition(pos1.x, this.bgs[1].position.y + this.bgHeight, pos1.z);
        }else if (this.bgs[1].position.y <= -this.bgHeight) {
            this.bgs[1].setPosition(pos2.x, this.bgs[0].position.y + this.bgHeight, pos2.z);
        }
    }
}