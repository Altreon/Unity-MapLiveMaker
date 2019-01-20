#pragma strict
//0.45
//-0.28
import System.Collections.Generic;
import System.IO;

var tile:RectTransform[];
var tileBack:RectTransform[];
var fileO:GameObject[];
var playerO:GameObject[];
var ExitO:GameObject;
var toolT:GameObject[];
var tileT:GameObject[];
var tileTBack:GameObject[];
var IAT:GameObject[];
var selectObj:GameObject[];
var editorObj:GameObject[];
var paramText:GameObject[];
var gridObj:GameObject;
var lineObj:GameObject;
var nameFile:UI.InputField;

private var edit:boolean = false;
private var pos:Vector3;
private var onUI:boolean = false;
private var sizeX:int = 50;
private var sizeY:int = 20;
private var ifPairX:int;
private var ifPairY:int;

private var tileH:float;
private var tileBackH:float;
private var toolList:GameObject[] = new GameObject[1000000];
private var tileList:GameObject[] = new GameObject[1000000];
private var tileListBack:GameObject[] = new GameObject[1000000];
private var IAList:GameObject[] = new GameObject[1000000];
private var player:GameObject[] = new GameObject[2];
private var tileType:int;
private var rankTool:int = 0;
private var rank:int = 0;
private var rankBack:int = 0;
private var rankIA:int = 0;
private var tileA:GameObject;
private var tileNum:int;

private var path:DirectoryInfo;
private var file:String;
private var files:DirectoryInfo[];
private var textTool:String[];
private var text:String[];
private var textBack:String[];
private var textIA:String[];

private var w:boolean = true;
private var wType:int;
private var wTile:int;

private var t:String;
private var tx:float;
private var ty:float;
 
function Start () {
	path = new DirectoryInfo(Application.dataPath + "/" + "Levels");
	files = path.GetDirectories();
	
	for(var i:int;i < files.length; i++){
		fileO[i].SetActive(true);
		fileO[i].transform.FindChild("Text").GetComponent(UI.Text).text = " " + files[i].Name;
	}
}

function Update () {
	if(edit){
		if(Input.GetAxis("Mouse ScrollWheel") > 0 && Camera.main.orthographicSize > 4.276){
			Camera.main.orthographicSize -= 0.8;
		}else if(Input.GetAxis("Mouse ScrollWheel") < 0 && Camera.main.orthographicSize < 30){
			Camera.main.orthographicSize += 0.8;
		}
		
		var mx:float = 0;
		var mx2:float = 0;
		var my:float = 0;
		var my2:float = 0;
		if(ifPairX != sizeX){
			mx = 0.4;
		}else{
			mx2 = 0.4;
		}
		if(ifPairY != sizeY){
			my = 0.4;
		}else{
			my2 = 0.4;
		}
		
		var mousePos:Vector3 = Camera.main.ScreenToWorldPoint(Input.mousePosition);
		var camSize:float = Camera.main.orthographicSize*(16.0/9);
		if(mousePos.x > Camera.main.transform.position.x + camSize && Camera.main.transform.position.x + camSize < mx + ((parseFloat(sizeX)/2)*0.8)){
			Camera.main.transform.position.x += 0.8;
		}else if(mousePos.x < Camera.main.transform.position.x - camSize && Camera.main.transform.position.x - camSize > mx2 + ((parseFloat(sizeX)/2)*-0.8)){
			Camera.main.transform.position.x -= 0.8;
		}
		if(mousePos.y > Camera.main.transform.position.y + (camSize/(16.0/9)) && Camera.main.transform.position.y + (camSize/(16.0/9)) < my + ((parseFloat(sizeY)/2)*0.8) + ((sizeY/2)*0.8)-(4.8-(my*2))){
			Camera.main.transform.position.y += 0.8;
		}else if(mousePos.y < Camera.main.transform.position.y - (camSize/(16.0/9)) && Camera.main.transform.position.y - (camSize/(16.0/9)) > 1.6 - my2 + ((parseFloat(sizeY)/2)*-0.8) + ((sizeY/2)*0.8)-(4.8-(my*2))){
			Camera.main.transform.position.y -= 0.8;
		}
		//Camera.main.transform.position.x = Mathf.Floor(Camera.main.transform.position.x * 10 + 0.5) / 10;
		//Camera.main.transform.position.y = Mathf.Floor(Camera.main.transform.position.y * 10 + 0.5) / 10;
	}
	
	if(edit && tileA){
		if(mousePos.x > pos.x + 0.8 && pos.x + 0.4 + mx < (parseFloat(sizeX)/2)*0.8){
			tileA.transform.position.x += 0.8;
			pos.x += 0.8;
		}
		if(mousePos.x < pos.x - 0.8 && pos.x - 0.8 - mx2 > (parseFloat(sizeX)/2)*-0.8){
			tileA.transform.position.x -= 0.8;
			pos.x -= 0.8;
		}
		if(mousePos.y > pos.y + 0.8 && pos.y + 0.4 + my < ((parseFloat(sizeY)/2)*0.8) + ((sizeY/2)*0.8)-(4.8-(my*2))){
			tileA.transform.position.y += 0.8;
			pos.y += 0.8;
		}
		if(mousePos.y < pos.y - 0.8 && pos.y - 0.8 - my2  > ((parseFloat(sizeY)/2)*-0.8) + ((sizeY/2)*0.8)-(4.8-(my*2))){
			tileA.transform.position.y -= 0.8;
			pos.y -= 0.8;
		}
		tileA.transform.position.x = Mathf.Floor(tileA.transform.position.x * 10 + 0.5) / 10;
		tileA.transform.position.y = Mathf.Floor(tileA.transform.position.y * 10 + 0.5) / 10;
		pos.x = Mathf.Floor(pos.x * 10 + 0.5) / 10;
		pos.y = Mathf.Floor(pos.y * 10 + 0.5) / 10;
		
		if(Input.GetMouseButton(0) && !onUI){
			var type:int = 0;
			var num:int = 0;
			var S:boolean = true;
			
			if(tileType == 0 && tileNum == 1){
				w = false;
			}
			for(var it:int = 0;it < rankTool; it++) {
    			if(S && toolList[it].transform.position == pos){
    				if(w){
    					Destroy(toolList[it]);
   						rankTool--;
   						S = false;
   					}else{
   						wTile = it;
   						wType = 0;
   						w = true;
   					}
   				}
   				if(!S){
  					toolList[it] = toolList[it+1];
   				}
   			}
   			S = true;
    			
			if(tileType != 0){
				for(var ip:int = 0;ip < player.length; ip++) {
    				if(player[ip] && player[ip].transform.position == pos){
    					Destroy(player[ip]);
    				}
    			}
				for(var i:int = 0;i < rank; i++) {
    				if(S && tileList[i].transform.position == pos){
    					Destroy(tileList[i]);
    					rank--;
    					S = false;
    				}
    				if(!S){
    					tileList[i] = tileList[i+1];
    				}
    			}
    			S = true;
    		
    			for(var ib:int = 0;ib < rankBack; ib++) {
    				if(S && tileListBack[ib].transform.position == pos){
    					Destroy(tileListBack[ib]);
    					rankBack--;
    					S = false;
    				}
    				if(!S){
    					tileListBack[ib] = tileListBack[ib+1];
    				}
    			}
    			S = true;
    		
    			for(var ia:int = 0;ia < rankIA; ia++) {
    				if(S && IAList[ia].transform.position == pos){
    					Destroy(IAList[ia]);
    					rankIA--;
    					S = false;
    				}
    				if(!S){
    					IAList[ia] = IAList[ia+1];
    				}
    			}
    		}
    		if(tileType == 0){
    			if(tileNum == 0){
    				toolList[rankTool] = Instantiate(toolT[tileNum], pos, transform.rotation);
					toolList[rankTool].name = toolT[tileNum].name;
					rankTool++;
				}else if(w){
					paramText[0].SetActive(true);
					paramText[1].SetActive(true);
					paramText[2].SetActive(true);
					paramText[3].SetActive(true);
					edit = false;
				}
    		}else if(tileType == 1){
				if(player[tileNum]){
					Destroy(player[tileNum]);
				}
				player[tileNum] = Instantiate(playerO[tileNum], pos, transform.rotation);
			}else if(tileType == 2){
				tileList[rank] = Instantiate(tileT[tileNum], pos, transform.rotation);
				tileList[rank].name = tileT[tileNum].name;
				rank++;
			}else if(tileType == 3){
				tileListBack[rankBack] = Instantiate(tileTBack[tileNum], pos, transform.rotation);
				tileListBack[rankBack].name = tileTBack[tileNum].name;
				rankBack++;
			}else if(tileType == 4){
				IAList[rankIA] = Instantiate(IAT[tileNum], pos, transform.rotation);
				IAList[rankIA].name = IAT[tileNum].name;
				rankIA++;
			}
		}
	}
}

function Text (tt:String) {
	t = tt;
}

function TextX (tt:float) {
	tx = tt;
}

function TextY (tt:float) {
	ty = tt;
}

function Apply (i:boolean) {
	if(i){
		if(wType == 0){
			Debug.Log(t);
			toolList[wTile].GetComponent.<text>().text = t;
			//toolList[wTile].GetComponent.<text>().x = tx;
			//toolList[wTile].GetComponent.<text>().y = ty;
		}		
	}
	paramText[0].SetActive(false);
	paramText[1].SetActive(false);
	paramText[2].SetActive(false);
	paramText[3].SetActive(false);
	edit = true;
}

function LevelSelect (num:int) {
	if(num == -1){
		if(nameFile.text){
			file = ("/" + "Levels" + "/" + nameFile.text + "/");
		}else{
			file = ("/" + "Levels" + "/" + "noname" + "/");
		}
	}else{
		file = ("/" + "Levels" + "/" + files[num].Name + "/");
	}
	var srTool = new StreamReader(Application.dataPath + file + "levelTool.txt");
	var fileContentsTool = srTool.ReadToEnd();
	srTool.Close();
	textTool = fileContentsTool.Split("\n"[0]);
	var sr = new StreamReader(Application.dataPath + file + "level.txt");
	var fileContents = sr.ReadToEnd();
	sr.Close();
	text = fileContents.Split("\n"[0]);
	var srBack = new StreamReader(Application.dataPath + file + "levelBack.txt");
	var fileContentsBack = srBack.ReadToEnd();
	srBack.Close();
	textBack = fileContentsBack.Split("\n"[0]);
	var srIA = new StreamReader(Application.dataPath + file + "levelIA.txt");
	var fileContentsIA = srIA.ReadToEnd();
	srIA.Close();
	textIA = fileContentsIA.Split("\n"[0]);
	for(obj in selectObj){
		obj.SetActive(false);
	}
	for(obj in fileO){
		obj.SetActive(false);
	}
	for(obj in editorObj){
		obj.SetActive(true);
	}
	for(obj in tile){
		obj.gameObject.SetActive(true);
	}
	player[0] = Instantiate(playerO[0], Vector3(parseFloat(text[1]), parseFloat(text[2]), 0), transform.rotation);
	player[1] = Instantiate(playerO[1], Vector3(parseFloat(text[4]), parseFloat(text[5]), 0), transform.rotation);
	sizeX = parseInt(text[7]);
	sizeY = parseInt(text[8]);
	for(var it:int = 1;it < textTool.length; it+=5) {
		toolList[rankTool] = Instantiate(toolT[parseInt(textTool[it])], Vector3(parseFloat(textTool[it+1]), parseFloat(textTool[it+2]), 0), transform.rotation);
		toolList[rankTool].name = textTool[it];
		toolList[rankTool].GetComponent.<text>().text = textTool[it+3];
		//toolList[rankTool].GetComponent.<text>().text = textTool[it+4];
		//toolList[rankTool].GetComponent.<text>().text = textTool[it+5];
		rankTool++;
	}
	for(var i:int = 10;i < text.length; i+=4) {
		tileList[rank] = Instantiate(tileT[parseInt(text[i])], Vector3(parseFloat(text[i+1]), parseFloat(text[i+2]), 0), transform.rotation);
		tileList[rank].name = text[i];
		rank++;
	}
	for(var ib:int = 1;ib < textBack.length; ib+=4) {
		tileListBack[rankBack] = Instantiate(tileTBack[parseInt(textBack[ib])], Vector3(parseFloat(textBack[ib+1]), parseFloat(textBack[ib+2]), 0), transform.rotation);
		tileListBack[rankBack].name = textBack[ib];
		rankBack++;
	}
	for(var ia:int = 1;ia < textIA.length; ia+=4) {
		IAList[rankIA] = Instantiate(IAT[parseInt(textIA[ia])], Vector3(parseFloat(textIA[ia+1]), parseFloat(textIA[ia+2]), 0), transform.rotation);
		IAList[rankIA].name = textIA[ia];
		rankIA++;
	}
	
	ifPairX = (sizeX/2)*2;
	ifPairY = (sizeY/2)*2;
	var sizex:float;
	var sizey:float;
	if(ifPairX == sizeX){
		sizex = (0.8*((sizeX/2)+0.1))-0.4;
	}else{
		sizex = (0.8*((sizeX/2)+0.1))+0.4;
	}
	if(ifPairY == sizeY){	
		sizey = (0.8*((sizeY/2)+0.1))-0.4;
	}else{
		sizey = (0.8*((sizeY/2)+0.1))+0.4;
	}
	for(var ix:float = 0.4;ix < sizex; ix+=0.8) {
		var x1:GameObject = Instantiate(lineObj, Vector3(ix,0,0.1), transform.rotation);
		var x2:GameObject = Instantiate(lineObj, Vector3(-ix,0,0.1), transform.rotation);
		if(ifPairX == sizeX && ifPairY == sizeY){
			x1.transform.position.y += 0.4;
			x2.transform.position.y += 0.4;
		}else if(ifPairX != sizeX && ifPairY == sizeY){
			x1.transform.position.y += 0.4;
			x2.transform.position.y += 0.4;
		}
		x1.transform.localScale.y = (sizeY) * 0.8;
		x2.transform.localScale.y = (sizeY) * 0.8;
		x1.transform.parent = gridObj.transform;
		x2.transform.parent = gridObj.transform;
	}
	if(ifPairX == sizeX){
		var x3:GameObject = Instantiate(lineObj, Vector3(ix,0,0.1), transform.rotation);
		x3.transform.localScale.y = (sizeY) * 0.8;
		if(ifPairY == sizeY){
			x3.transform.position.y += 0.4;
		}
		x3.transform.parent = gridObj.transform;
	}
	for(var iy:float = 0.4;iy < sizey; iy+=0.8) {
		var y1:GameObject = Instantiate(lineObj, Vector3(0,iy,0.1), Quaternion.Euler(0,0,90));
		var y2:GameObject = Instantiate(lineObj, Vector3(0,-iy,0.1), Quaternion.Euler(0,0,90));
		y1.transform.localScale.y = (sizeX-1) * 0.8;
		y2.transform.localScale.y = (sizeX-1) * 0.8;
		if(ifPairY == sizeY && ifPairX == sizeX){
			y1.transform.position.x += 0.4;
			y2.transform.position.x += 0.4;
		}else if(ifPairX == sizeX){
			y1.transform.position.x += 0.4;
			y2.transform.position.x += 0.4;
		}
		y1.transform.localScale.y = (sizeX) * 0.8;
		y2.transform.localScale.y = (sizeX) * 0.8;
		y1.transform.parent = gridObj.transform;
		y2.transform.parent = gridObj.transform;
	}
	if(ifPairY == sizeY){
		var y3:GameObject = Instantiate(lineObj, Vector3(0,iy,0.1), Quaternion.Euler(0,0,90));
		y3.transform.localScale.y = (sizeX) * 0.8;
		if(ifPairX == sizeX){
			y3.transform.position.x += 0.4;
		}
		y3.transform.parent = gridObj.transform;
	}
	if(ifPairY == sizeY){
		gridObj.transform.position.y += ((sizeY/2)*0.8)-4.8;
	}else{
		gridObj.transform.position.y += ((sizeY/2)*0.8)-4;
	}
	
	tileH = 30 * (tile.length/2);
	tileBackH = 30 * (tileBack.length/2);
	editorObj[0].GetComponent(UI.Slider).minValue = -tileH;
	editorObj[0].GetComponent(UI.Slider).maxValue = tileH;
	editorObj[0].GetComponent(UI.Slider).value = tileH;
	editorObj[9].GetComponent(UI.Slider).minValue = -tileBackH;
	editorObj[9].GetComponent(UI.Slider).maxValue = tileBackH;
	editorObj[9].GetComponent(UI.Slider).value = tileBackH;
	Move(tileH);
	MoveBack(tileBackH);
	tile[0].gameObject.SetActive(true);
	tileBack[0].gameObject.SetActive(true);
	edit = true;
}

function LevelCreate () {
	var sw:StreamWriter;
	if(nameFile.text){
		Directory.CreateDirectory(Application.dataPath + "/" + "Levels" + "/" + nameFile.text);
		File.WriteAllText(Application.dataPath + "/" + "Levels" + "/" + nameFile.text + "/" + "levelTool.txt", "");
		File.WriteAllText(Application.dataPath + "/" + "Levels" + "/" + nameFile.text + "/" + "level.txt", "");
		File.WriteAllText(Application.dataPath + "/" + "Levels" + "/" + nameFile.text + "/" + "levelBack.txt", "");
		File.WriteAllText(Application.dataPath + "/" + "Levels" + "/" + nameFile.text + "/" + "levelIA.txt", "");
		sw = new StreamWriter(Application.dataPath + "/" + "Levels" + "/" + nameFile.text + "/" + "level.txt");
	}else{
		Directory.CreateDirectory(Application.dataPath + "/" + "Levels" + "/" + "noname");
		File.WriteAllText(Application.dataPath + "/" + "Levels" + "/" + "noname" + "/" + "levelTool.txt", "");
		File.WriteAllText(Application.dataPath + "/" + "Levels" + "/" + "noname" + "/" + "level.txt", "");
		File.WriteAllText(Application.dataPath + "/" + "Levels" + "/" + "noname" + "/" + "levelBack.txt", "");
		File.WriteAllText(Application.dataPath + "/" + "Levels" + "/" + "noname" + "/" + "levelIA.txt", "");
		sw = new StreamWriter(Application.dataPath + "/" + "Levels" + "/" + "noname" + "/" + "level.txt");
	}
	sw.WriteLine("player1");
	sw.WriteLine("5.6");
	sw.WriteLine("-2.4");
	sw.WriteLine("player2");
	sw.WriteLine("-5.6");
	sw.WriteLine("-2.4");
	sw.WriteLine("Size");
	sw.WriteLine(sizeX.ToString());
	sw.WriteLine(sizeY.ToString());
	sw.Flush();
    sw.Close();
    LevelSelect(-1);
}

function SizeX (n:float) {
	sizeX = n;
	selectObj[11].GetComponent(UI.InputField).text = n.ToString();
}

function SizeY (n:float) {
	sizeY = n;
	selectObj[12].GetComponent(UI.InputField).text = n.ToString();
}

function SizeXText (n:String) {
	if(parseInt(n) < 19 || n == ""){
		selectObj[11].GetComponent(UI.InputField).text = "19";
		sizeX = 19;
		selectObj[10].GetComponent(UI.Slider).value = 19;
	}else if(parseInt(n) > 500){
		selectObj[11].GetComponent(UI.InputField).text = "500";
		sizeX = 500;
		selectObj[10].GetComponent(UI.Slider).value = 500;
	}else{
		sizeX = parseInt(n);
		selectObj[10].GetComponent(UI.Slider).value = parseInt(n);
	}
}

function SizeYText (n:String) {
	if(parseInt(n) < 19 || n == ""){
		selectObj[12].GetComponent(UI.InputField).text = "19";
		sizeY = 19;
		selectObj[9].GetComponent(UI.Slider).value = 19;
	}else if(parseInt(n) > 500){
		selectObj[12].GetComponent(UI.InputField).text = "500";
		sizeY = 500;
		selectObj[9].GetComponent(UI.Slider).value = 500;
	}else{
		sizeY = parseInt(n);
		selectObj[9].GetComponent(UI.Slider).value = parseInt(n);
	}
}

function Move (m:float) {
	for(var i:int = 0;i < tile.length; i++){
		tile[i].anchoredPosition.y = -m + tileH -(i*30);
		if(tile[i].anchoredPosition.y > 0 && tile[i].anchoredPosition.y <= 75){
			tile[i].gameObject.GetComponent(UI.Image).color = Color(1, 1, 1, 1-(tile[i].anchoredPosition.y*0.013333333333333334));
			tile[i].gameObject.SetActive(true);
		}else if(tile[i].anchoredPosition.y < 0 && tile[i].anchoredPosition.y >= -75){
			tile[i].gameObject.GetComponent(UI.Image).color = Color(1, 1, 1, 1-(tile[i].anchoredPosition.y*-0.013333333333333334));
			tile[i].gameObject.SetActive(true);
		}else if(tile[i].anchoredPosition.y < -75 || tile[i].anchoredPosition.y > 75){
			tile[i].gameObject.GetComponent(UI.Image).color = Color(1, 1, 1, 0);
			tile[i].gameObject.SetActive(false);
		}else{
			tile[i].gameObject.GetComponent(UI.Image).color = Color(1, 1, 1, 1);
		}
	}
}

function MoveBack (m:float) {
	for(var i:int = 0;i < tileBack.length; i++){
		tileBack[i].anchoredPosition.y = -m + tileBackH -(i*30);
		if(tileBack[i].anchoredPosition.y > 0 && tileBack[i].anchoredPosition.y <= 75){
			tileBack[i].gameObject.GetComponent(UI.Image).color = Color(1, 1, 1, 1-(tileBack[i].anchoredPosition.y*0.013333333333333334));
			tileBack[i].gameObject.SetActive(true);
		}else if(tileBack[i].anchoredPosition.y < 0 && tileBack[i].anchoredPosition.y >= -75){
			tileBack[i].gameObject.GetComponent(UI.Image).color = Color(1, 1, 1, 1-(tileBack[i].anchoredPosition.y*-0.013333333333333334));
			tileBack[i].gameObject.SetActive(true);
		}else if(tileBack[i].anchoredPosition.y < -75 || tileBack[i].anchoredPosition.y > 75){
			tileBack[i].gameObject.GetComponent(UI.Image).color = Color(1, 1, 1, 0);
			tileBack[i].gameObject.SetActive(false);
		}else{
			tileBack[i].gameObject.GetComponent(UI.Image).color = Color(1, 1, 1, 1);
		}
	}
}

function OnEnter () {
	onUI = true;
}

function OnExit () {
	onUI = false;
}

function ToolBar (num:int) {
	if(tileA){
		Destroy(tileA);
	}
	tileA = Instantiate(toolT[num], Vector3(0, 0, 0), transform.rotation);
	pos = Vector3(0, 0, 0);
	tileNum = num;
	tileType = 0;
}

function Player (num:int) {
	if(tileA){
		Destroy(tileA);
	}
	tileA = Instantiate(playerO[num], Vector3(0, 0, 0), transform.rotation);
	pos = Vector3(0, 0, 0);
	tileNum = num;
	tileType = 1;
}

function Tile (num:int) {
	if(tileA){
		Destroy(tileA);
	}
	tileA = Instantiate(tileT[num], Vector3(0, 0, 0), transform.rotation);
	pos = Vector3(0, 0, 0);
	tileNum = num;
	tileType = 2;
}

function TileBack (num:int) {
	if(tileA){
		Destroy(tileA);
	}
	tileA = Instantiate(tileTBack[num], Vector3(0, 0, 0), transform.rotation);
	pos = Vector3(0, 0, 0);
	tileNum = num;
	tileType = 3;
}

function IAF (num:int) {
	if(tileA){
		Destroy(tileA);
	}
	tileA = Instantiate(IAT[num], Vector3(0, 0, 0), transform.rotation);
	pos = Vector3(0, 0, 0);
	tileNum = num;
	tileType = 4;
}

function Exit () {
	if(tileA){
		Destroy(tileA);
	}
	tileA = Instantiate(ExitO, Vector3(0, 0, 0), transform.rotation);
	pos = Vector3(0, 0, 0);
	tileType = 5;
}

function Save () {
	var swTool : StreamWriter = new StreamWriter(Application.dataPath + file + "levelTool.txt");
	var sw : StreamWriter = new StreamWriter(Application.dataPath + file + "level.txt");
	var swBack : StreamWriter = new StreamWriter(Application.dataPath + file + "levelBack.txt");
	var swIA : StreamWriter = new StreamWriter(Application.dataPath + file + "levelIA.txt");
	sw.WriteLine("player1");
	sw.WriteLine(player[0].transform.position.x);
	sw.WriteLine(player[0].transform.position.y);
	sw.WriteLine("player2");
	sw.WriteLine(player[1].transform.position.x);
	sw.WriteLine(player[1].transform.position.y);
	sw.WriteLine("Size");
	sw.WriteLine(sizeX.ToString());
	sw.WriteLine(sizeY.ToString());
	
	var it:int = 0;
    for(tileTool in toolList) {
		if(!toolList[it]){
    		break;
    	}
    	swTool.WriteLine("Tile"+it);
 		swTool.WriteLine(tileTool.name);
    	swTool.WriteLine(tileTool.transform.position.x);
    	swTool.WriteLine(tileTool.transform.position.y);
    	swTool.WriteLine(tileTool.GetComponent.<text>().text);
    	//swTool.WriteLine(tileTool.GetComponent.<text>().x);
    	//swTool.WriteLine(tileTool.GetComponent.<text>().y);
    	it++;
    }
    swTool.Flush();
    swTool.Close();
	
	var i:int = 0;
	for(tile in tileList) {
		if(!tileList[i]){
    		break;
    	}
    	sw.WriteLine("Tile"+i);
 		sw.WriteLine(tile.name);
    	sw.WriteLine(tile.transform.position.x);
    	sw.WriteLine(tile.transform.position.y);
    	i++;
    }
    sw.Flush();
    sw.Close();
    
    var ib:int = 0;
    for(tileBack in tileListBack) {
		if(!tileListBack[ib]){
    		break;
    	}
    	swBack.WriteLine("Tile"+ib);
 		swBack.WriteLine(tileBack.name);
    	swBack.WriteLine(tileBack.transform.position.x);
    	swBack.WriteLine(tileBack.transform.position.y);
    	ib++;
    }
    swBack.Flush();
    swBack.Close();
    
    var ia:int = 0;
    for(tileIA in IAList) {
		if(!IAList[ia]){
    		break;
    	}
    	swIA.WriteLine("Tile"+ia);
 		swIA.WriteLine("0");
    	swIA.WriteLine(tileIA.transform.position.x);
    	swIA.WriteLine(tileIA.transform.position.y);
    	ia++;
    }
    swIA.Flush();
    swIA.Close();
}