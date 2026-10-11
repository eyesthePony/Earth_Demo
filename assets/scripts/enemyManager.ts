import { _decorator, Component, Prefab, instantiate, view, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property(Prefab) enemyPrefab: Prefab = null!;
    @property spawnRate = 1;

    private scrWidth = 0;
    private scrHeight = 0;

    onLoad() {
        const size = view.getVisibleSize();
        this.scrWidth = size.width;
        this.scrHeight = size.height;

    }

    start() {
        this.schedule(this.spawnEnemy, this.spawnRate);
    }

    private spawnEnemy() {
        const enemy = instantiate(this.enemyPrefab);
        const enemyHalfW = enemy.getComponent(UITransform)!.width / 2;

        const minX = -this.scrWidth / 2 + enemyHalfW;
        const maxX = this.scrWidth / 2 - enemyHalfW;
        const randomX = minX + Math.random() * (maxX - minX);
        const spawnY = this.scrHeight / 2 + 100;

        // Set the transform before the rigid body is added to the active scene.
        enemy.setPosition(randomX, spawnY, 0);
        this.node.addChild(enemy);
    }
}