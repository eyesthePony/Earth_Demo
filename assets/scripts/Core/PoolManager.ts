import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;


export class PoolManager {

    private _dictPool: any = {};
   

    static _instance:PoolManager = null;

    static get instance():PoolManager{
        if(!this._instance){
            this._instance = new PoolManager();
        }
        return this._instance;
    }


    public getNode(prefab:Prefab, parent:Node){
        let name = prefab.name;
 
        let pool = null;
        let node = null;
        if(this._dictPool.hasOwnProperty(name)){
            pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(prefab);
            }
        }else{
            let pool = new NodePool();
            this._dictPool[name] = pool;
            node = instantiate(prefab);
        }

        node.parent = parent;
        node.active = true;
        return node;

    }


    public putNode(node:Node){
        if(!node)   return;

        let name = node.name;
   
        let pool = null;
        if(this._dictPool.hasOwnProperty(name)){
            pool = this._dictPool[name];
        }else{
            pool = new NodePool();
            this._dictPool[name] = pool;
        }

        pool.put(node);
    }

    public clearPool(name:string){
        if(this._dictPool.hasOwnProperty(name)){
            let pool = this._dictPool[name];
            pool.clear();
        }
    }

    public preLoadPrefab(prefab:Prefab, count:number){
        let name = prefab.name;
        let pool = new NodePool();
        this._dictPool[name] = pool;
        for(let i = 0; i < count; i++){
            let node = instantiate(prefab);
            pool.put(node);
        }
    }

    public destroyNode(node:Node){
        if(!node)   return;
        node.destroy();
    }
    
   
    
}


