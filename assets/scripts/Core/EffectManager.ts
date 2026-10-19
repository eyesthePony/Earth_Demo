import { _decorator, Component, Node, Prefab, Vec3,Animation} from 'cc';

import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('EffectManager')
export class EffectManager extends Component {

    static instance:EffectManager = null;

    @property({ type: [Prefab], tooltip: "把所有特效Prefab拖进来，代码里按文件名调用" })
    effectPrefabs: Prefab[] = [];

    private _map: Map<string, Prefab> = new Map();

    onLoad(){
        EffectManager.instance = this;
        for (const p of this.effectPrefabs) {
            this._map.set(p.name, p);
        }
       
    }


    play(name: string, pos: Vec3, scale: number = 1){

        const prefab = this._map.get(name);

        if (!prefab) {
            console.warn(`EffectManager 找不到名为 [${name}] 的特效 Prefab！`);
            return;
        }
   
        const effectNode = PoolManager.instance.getNode(prefab,this.node);
        effectNode.setWorldPosition(pos);
        effectNode.setScale(scale, scale, 1);

        const anim = effectNode.getComponent(Animation)!;
        if(!anim){
            console.warn(`anime  [${name}] 为空`);
            return;
        }
        
        // ==========================================
        // 2. 播放动画
        // ==========================================
        if (anim) {
            anim.stop(); // 防复用残留状态
            anim.play();
        }

        const waitTime = anim.defaultClip.duration;

        // ==========================================
        // 3. 定时回收（绝不用 anim.on 匿名函数，会内存泄漏）
        // ==========================================
        // 假设动画时长 0.6 秒，用 scheduleOnce 延迟回收
         this.scheduleOnce(() => {
            if (effectNode && effectNode.isValid) {
                PoolManager.instance.putNode(effectNode);
            }
        }, waitTime);

    }

}


