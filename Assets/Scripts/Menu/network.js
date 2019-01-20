#pragma strict

static var master:boolean = false;
static var pseudo:String;
static var player:int;

static var id:boolean = false;
static var map:String;

private var search:boolean = true;
private var player1:GameObject;
private var player2:GameObject;

function Awake () {
	DontDestroyOnLoad(gameObject);
}

function Update () {
	if(search){
		//player1 = GameObject.Find("Mega1(Clone)");
		//player2 = GameObject.Find("Mega2(Clone)");
		if(player1 && player2){
			search = false;
		}
	}else{
		Debug.Log("ok");
	}
}


function ID () {
	GetComponent(PhotonView).viewID ++;
}