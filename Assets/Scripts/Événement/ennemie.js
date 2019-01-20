#pragma strict

static var turn:boolean = false;

var perso:int;
var anim:Animator;
var attack:BoxCollider2D;
var Sync:MonoBehaviour;
var photonView:PhotonView;

private var canAttack:boolean = true;
private var canJump:boolean = false;

private var isDomage:boolean = false;
private var isGround;

private var activ:boolean = false;
private var cible:Transform;

function Awake () {
	if(!PhotonNetwork.isMasterClient && PhotonNetwork.connected) {
		Destroy(this);
		anim.speed = 0.8;
	}
}

function Update () {
	if(!activ && GameObject.FindGameObjectWithTag("Player")){
		cible = GameObject.FindGameObjectWithTag("Player").transform;
		if(Vector3.Distance(cible.position, transform.position) <= 6){
			activ = true;
		}
	}else if(activ){
		anim.SetFloat("walk", 1);
		if((cible.position.x - transform.position.x) > 0.1 && !anim.GetCurrentAnimatorStateInfo(0).IsName("attack")){
			transform.rotation.y = 180;
			turn = true;
		}else if((cible.position.x - transform.position.x) < -0.1 && !anim.GetCurrentAnimatorStateInfo(0).IsName("attack")){
			transform.rotation.y = 0;
			turn = false;
		}else{
			anim.speed = 0.8;
		}
		
		if(canAttack && (cible.position.x - transform.position.x) > -2 && (cible.position.x - transform.position.x) < 2 && (cible.position.y - transform.position.y) > -0.7 && (cible.position.y - transform.position.y) < 0.7){
			SendMessage("Attack");
			AtCharge();
			canAttack = false;
		}
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
	if(activ && !anim.GetCurrentAnimatorStateInfo(0).IsName("attack")){
		attack.enabled = false;
		var move:float;
		if((cible.position.x - transform.position.x) > 0){
			move = 0.8;
		}else{
			move = -0.8;
		}
		if(!isDomage){
			GetComponent.<Rigidbody2D>().velocity.x = (move * 700) * Time.deltaTime;
		}
	}else{
		attack.enabled = true;
	}
}

function Jump () {
	if(Input.GetKeyDown("up") && canJump){
		//GetComponent.<Rigidbody2D>().velocity.y = 1700 * Time.deltaTime;
	}
}

function AtCharge () {
	yield WaitForSeconds(0.5);
	canAttack = true;
}

function OnCollisionEnter2D (col:Collision2D) {
	if(col.gameObject.layer == 14 && (transform.position.y - col.transform.position.y) < 1){
		Debug.Log("ok");
		GetComponent.<Rigidbody2D>().velocity.y = 1700 * Time.deltaTime;
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