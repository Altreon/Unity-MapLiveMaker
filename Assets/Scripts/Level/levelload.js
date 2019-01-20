#pragma strict
import System.IO;

var tileT:GameObject[];
var tileTBack:GameObject[];
var number:GameObject;
var photonView:PhotonView;

private var text:String[];
private var textBack:String[];

private var i:int = 3;
 
function Start () {
	if(network.player == 1){
		var sr = new StreamReader(Application.dataPath + "/" + "Levels" + "/" + network.map + "/" + "level.txt");
		var srBack = new StreamReader(Application.dataPath + "/" + "Levels" + "/" + network.map + "/" + "levelBack.txt");
		var fileContents = sr.ReadToEnd();
		var fileContentsBack = srBack.ReadToEnd();
		sr.Close();
		srBack.Close();
		text = fileContents.Split("\n"[0]);
		textBack = fileContentsBack.Split("\n"[0]);
		photonView.RPC("LoadBack", PhotonTargets.All, textBack);
		photonView.RPC("Load", PhotonTargets.All, text);
		photonView.RPC("Num", PhotonTargets.All, true);
		while(i > 0){
			yield WaitForSeconds(1);
			photonView.RPC("C", PhotonTargets.All);
		}
		photonView.RPC("Num", PhotonTargets.All, false);
		photonView.RPC("Spawn", PhotonTargets.All, text);
	}
}

@RPC
function LoadBack (textBack:String[]) {
	for(var ib:int = 1;ib < textBack.length; ib+=4) {
		Instantiate(tileTBack[parseInt(textBack[ib])], Vector3(parseFloat(textBack[ib+1]), parseFloat(textBack[ib+2]), 1), transform.rotation);
	}
}

@RPC
function Load (text:String[]) {
	for(var i:int = 10;i < text.length; i+=4) {
		Instantiate(tileT[parseInt(text[i])], Vector3(parseFloat(text[i+1]), parseFloat(text[i+2]), 0), transform.rotation);
	}
}

@RPC
function Spawn (text:String[]) {
	Debug.Log("ok");
	if(network.player == 1) {
		PhotonNetwork.Instantiate("Mega1", Vector3(parseFloat(text[1]), parseFloat(text[2]), 0), transform.rotation,0);
	}else{
		PhotonNetwork.Instantiate("Mega2", Vector3(parseFloat(text[4]), parseFloat(text[5]), 0), transform.rotation,0);
	}
}

@RPC
function C () {
	i--;
	number.GetComponent(UI.Text).text = i.ToString();;
}

@RPC
function Num (t:boolean) {
	number.SetActive(t);
}