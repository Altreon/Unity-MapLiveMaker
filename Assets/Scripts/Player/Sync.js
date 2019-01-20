#pragma strict

var anim:Animator;

@RPC
function Attack () {
	anim.SetBool("attack", true);
	yield WaitForSeconds(0.2);
	anim.SetBool("attack", false);
}