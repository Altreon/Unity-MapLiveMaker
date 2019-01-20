#pragma strict
import System.Collections.Generic;
import System.IO;

var fileO:GameObject[];

private var path:DirectoryInfo;
private var file:String;
private var files:DirectoryInfo[];
 
function Start () {
	path = new DirectoryInfo(Application.dataPath + "/" + "Levels");
	files = path.GetDirectories();
	
	for(var i:int;i < files.length; i++){
		fileO[i].SetActive(true);
		fileO[i].transform.FindChild("Text").GetComponent(UI.Text).text = " " + files[i].Name;
	}
}

function LevelSelect (num:int) {
	stats.map = files[num].Name;
	Application.LoadLevel("soloMap");
}