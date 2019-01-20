#pragma strict

var isConnected:boolean;
var script:mega;
var scriptE:ennemie;
private var canHit:boolean = true;

function Start () {
	if(PhotonNetwork.connected){
		isConnected = true;
	}else{
		isConnected = false;
	}
	script = transform.parent.GetComponent.<mega>();
	scriptE = transform.parent.GetComponent.<ennemie>();
}

function OnTriggerEnter2D (col:Collider2D) {
	//if(mega.turn){
		//col.GetComponent.<Rigidbody2D>().AddForce(Vector2(1000,1000));
	//}else{
		//col.GetComponent.<Rigidbody2D>().AddForce(Vector2(-1000,1000));
	//}
	if(canHit){
		if(isConnected){
			var sendMessage:PhotonView = col.gameObject.GetComponent.<PhotonView>();
			sendMessage.RPC("Hit", PhotonTargets.All, script.turn);
		}else{
			if(script){
				col.gameObject.SendMessage("Hit", script.turn);
			}else{
				col.gameObject.SendMessage("Hit", scriptE.turn);
			}
		}
		canHit = false;
	}
}

function OnTriggerExit2D (col:Collider2D) {
	canHit = true;
}