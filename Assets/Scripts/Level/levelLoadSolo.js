#pragma strict
import System.IO;

var toolT:GameObject[];
var tileT:GameObject[];
var tileTBack:GameObject[];
var IAT:GameObject[];
var number:GameObject;
var playerO:GameObject;

private var textTool:String[];
private var text:String[];
private var textBack:String[];
private var textIA:String[];
private var player:Transform;

private var i:int = 3;
 
function Start () {
	var srTool = new StreamReader(Application.dataPath + "/" + "Levels" + "/" + stats.map + "/" + "levelTool.txt");
	var sr = new StreamReader(Application.dataPath + "/" + "Levels" + "/" + stats.map + "/" + "level.txt");
	var srBack = new StreamReader(Application.dataPath + "/" + "Levels" + "/" + stats.map + "/" + "levelBack.txt");
	var srIA = new StreamReader(Application.dataPath + "/" + "Levels" + "/" + stats.map + "/" + "levelIA.txt");
	var fileContentsTool = srTool.ReadToEnd();
	var fileContents = sr.ReadToEnd();
	var fileContentsBack = srBack.ReadToEnd();
	var fileContentsIA = srIA.ReadToEnd();
	srTool.Close();
	sr.Close();
	srBack.Close();
	srIA.Close();
	textTool = fileContentsTool.Split("\n"[0]);
	text = fileContents.Split("\n"[0]);
	textBack = fileContentsBack.Split("\n"[0]);
	textIA = fileContentsIA.Split("\n"[0]);
	LoadTool(textTool);
	Load(text);
	LoadBack(textBack);
	LoadIA(textIA);
	Num(true);
	while(i > 0){
		yield WaitForSeconds(1);
		C();
	}
	Num(false);
	Spawn(text);
}

function LoadTool (textTool:String[]) {
	for(var it:int = 1;it < textTool.length; it+=5) {
		var T:GameObject = Instantiate(toolT[parseInt(textTool[it])], Vector3(parseFloat(textTool[it+1]), parseFloat(textTool[it+2]), 1), transform.rotation);
		T.GetComponent.<text>().text = textTool[it+3];
		T.GetComponent.<Renderer>().enabled = false;
	}
}

function Load (text:String[]) {
	for(var i:int = 10;i < text.length; i+=4) {
		Instantiate(tileT[parseInt(text[i])], Vector3(parseFloat(text[i+1]), parseFloat(text[i+2]), 0), transform.rotation);
	}
}

function LoadBack (textBack:String[]) {
	for(var ib:int = 1;ib < textBack.length; ib+=4) {
		Instantiate(tileTBack[parseInt(textBack[ib])], Vector3(parseFloat(textBack[ib+1]), parseFloat(textBack[ib+2]), 1), transform.rotation);
	}
}

function LoadIA (textIA:String[]) {
	for(var ia:int = 1;ia < textIA.length; ia+=4) {
		Instantiate(IAT[parseInt(textIA[ia])], Vector3(parseFloat(textIA[ia+1]), parseFloat(textIA[ia+2]), 1), transform.rotation);
	}
}

function Spawn (text:String[]) {
	var P:GameObject = Instantiate(playerO, Vector3(parseFloat(text[1]), parseFloat(text[2]), 0), transform.rotation);
	player = P.transform;
}

function C () {
	i--;
	number.GetComponent(UI.Text).text = i.ToString();;
}

function Num (t:boolean) {
	number.SetActive(t);
}

function Update () {
	if(player){
		transform.position.x = player.position.x;
		transform.position.y = player.position.y;
	}
}