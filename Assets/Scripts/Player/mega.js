#pragma strict

var turn:boolean = false;

var perso:int;
var anim:Animator;
var attack:BoxCollider2D;
var Sync:MonoBehaviour;
var photonView:PhotonView;

private var canAttack:boolean = true;
private var canJump:boolean = false;

private var isDomage:boolean = false;
private var isGround;

private var text:GameObject;

function Awake () {
	if(network.player && network.player != perso){
		Debug.Log(network.player);
		Destroy(this);
	}
	//if(PhotonNetwork.isMasterClient) {
		//Destroy(GetComponent(PhotonView));
		//Destroy(Sync);
	//}
	text = GameObject.Find("/Main Camera/CanvasText");
}

function Update () {
	anim.SetFloat("walk", Input.GetAxis("Horizontal"));
	if(Input.GetAxis("Horizontal") > 0.1 && !anim.GetCurrentAnimatorStateInfo(0).IsName("attack")){
		anim.speed = Input.GetAxis("Horizontal");
		transform.rotation.y = 180;
		turn = true;
	}else if(Input.GetAxis("Horizontal") < -0.1 && !anim.GetCurrentAnimatorStateInfo(0).IsName("attack")){
		anim.speed = -Input.GetAxis("Horizontal");
		transform.rotation.y = 0;
		turn = false;
	}else{
		anim.speed = 1;
	}
	
	if(Input.GetKeyDown("space") && canAttack){
		if(PhotonNetwork.connected){
			photonView.RPC("Attack", PhotonTargets.All);
		}else{
			SendMessage("Attack");
		}
		AtCharge();
		canAttack = false;
	}
}

@RPC
function Hit (rot:boolean)	{
	isDomage = true;
	if(rot){
		GetComponent.<Rigidbody2D>().AddForce(Vector2(1000,1000));
	}else{
		GetComponent.<Rigidbody2D>().AddForce(Vector2(-1000,1000));
	}
}

function FixedUpdate () {
	if(!anim.GetCurrentAnimatorStateInfo(0).IsName("attack")){
		attack.enabled = false;
		var move:float;
		move = Input.GetAxis("Horizontal");
		if(!isDomage){
			GetComponent.<Rigidbody2D>().velocity.x = (move * 700) * Time.deltaTime;
		}
	}else{
		attack.enabled = true;
	}
	
	if(Input.GetKeyDown("up") && canJump){
		GetComponent.<Rigidbody2D>().velocity.y = 1700 * Time.deltaTime;
	}
}

function AtCharge () {
	yield WaitForSeconds(0.5);
	canAttack = true;
}

function OnTriggerEnter2D (col:Collider2D) {
	if(col.gameObject.layer == 16){
		//Debug.Log(col.GetComponent.<text>().text);
		text.GetComponentInChildren.<UI.Text>().text = col.GetComponent.<text>().text;
		text.GetComponentInChildren.<UI.Text>().color.a = 225;
		//Destroy(gameObject);
	}
}

function OnCollisionStay2D (col:Collision2D) {
	if(isDomage && !isGround){
		isDomage = false;
	}
	canJump = true;
	isGround = true;
}

function OnCollisionExit2D (col:Collision2D) {
	isGround = false;
	canJump = false;
}