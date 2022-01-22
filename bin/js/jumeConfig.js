window["jume"] = {
    //up 向上的力，left 向前的力
    0:1,//点击次数 0
    1:2,//点击次数 1 
    2:2,//点击次数 1 
    3:2,//点击次数 1 
    4:3,//点击次数 1 
    5:3,//点击次数 1 
    6:3,//点击次数 1 
    7:4,//点击次数 1 
    8:4,//点击次数 1 
    9:4,//点击次数 1 
    10:5,//点击次数 1 
    11:5,//点击次数 1 
    12:5,//点击次数 1 
    13:6,//点击次数 1 
    /**聚气时间 */
    time:2000,
    /**跳跃累计次数进行超级跳跃 */
    jumeNum:7,
    /**跳板飞行点 */
    jumeBoxNum:2//不能为0，否则会出现错误
    //注意限制跳跃炒过8个点，防止穿帮
}
//场景资源名称
window['res'] = {
    //初始场景
    "start":[
        // "scene-easy-0",
        "scene-start-1",
        "scene-start-2",
        "scene-start-3",
        // "scene-easy-3",
    ],
    //简单场景
    "easy":[
        "scene-easy-1",
        "scene-easy-2",
        "scene-easy-3",
        "scene-easy-4",
        "scene-easy-5",
        "scene-easy-6",
        "scene-easy-7",
        "scene-easy-8",
        "scene-easy-9",
    ],
    //正常场景
    "normal":[
        "scene-normal-1",
        "scene-normal-2",
        "scene-normal-3",
        "scene-normal-4",
        "scene-normal-5",
        "scene-normal-6",
        "scene-normal-7",
        "scene-normal-8",
        "scene-normal-9",
        "scene-normal-10",
        "scene-normal-11",
   
    ],
    //困难场景
    "hard":[
        "scene-hard-1",
        "scene-hard-2",
        "scene-hard-3",
        "scene-hard-4",
        "scene-hard-5",
        "scene-hard-6",
        "scene-hard-7",
        "scene-hard-8",
        "scene-hard-9",
        "scene-hard-10",
        "scene-hard-11",
        "scene-hard-12",
        "scene-hard-13",
        "scene-hard-14",
        "scene-hard-15",
    ]
}