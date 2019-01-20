#pragma strict

var photonView:PhotonView;
var networkObj:GameObject;
var fileO:GameObject;

var lobbyObj:GameObject[];
var roomObj:GameObject[];
var noRoomObj:GameObject;
var inRoomObj:GameObject[];

private var online:boolean = false;
private var inLobby:boolean = false;
private var inRoom:boolean = false;

private var nameRoom:String = "RoomName";
private var publicRoom:boolean;

private var master:boolean = false;
private var pseudo:String = "Default";

private var path:DirectoryInfo;
private var files:DirectoryInfo[];
private var file:String;
private var f:int = 1;

function Start () {
	if(!Directory.Exists(Application.dataPath + "/" + "Levels")){    
		Directory.CreateDirectory(Application.dataPath + "/" + "Levels");
	}
	path = new DirectoryInfo(Application.dataPath + "/" + "Levels");
}

function Solo () {
	PhotonNetwork.LoadLevel("solo");
}

function Online () {
	PhotonNetwork.ConnectUsingSettings("0.1");
	online = true;
}

function Edit () {
	PhotonNetwork.LoadLevel("editor");
}

function OnGUI () {
	if(online){
		GUILayout.Label(PhotonNetwork.connectionStateDetailed.ToString());
	}
	if(inLobby && PhotonNetwork.GetRoomList().length == 0){
		noRoomObj.SetActive(true);
		for(room in roomObj){
			room.SetActive(false);
		}
	}else if(inLobby){
		noRoomObj.SetActive(false);
		var i:int = 0;
		for(var room:RoomInfo in PhotonNetwork.GetRoomList()){
			if(room.open){
				roomObj[i].SetActive(true);
				roomObj[i].transform.FindChild("Text").GetComponent(UI.Text).text = room.name;
				i++;
			}
		}
		while(i <= 4){
			roomObj[i].SetActive(false);
			i++;
		}
	}
}

function Room (i:int) {
	PhotonNetwork.JoinRoom(PhotonNetwork.GetRoomList()[i].name);
}

function ExitRoom () {
	PhotonNetwork.LeaveRoom();
}



function NamePseudo (n:String) {
	pseudo = n;
}

function NameRoom (n:String) {
	nameRoom = n;
}

function PublicRoom (n:boolean) {
	publicRoom = n;
}

function CreateRoom () {
	master = true;
	var roomOptions:RoomOptions = new RoomOptions();
	roomOptions.isOpen = true;
	roomOptions.isVisible = true;
	roomOptions.maxPlayers = 2;
	var room = PhotonNetwork.CreateRoom(nameRoom, roomOptions, TypedLobby.Default);
}

function ChooseMap (next:boolean) {
	if(next){
		f++;
		inRoomObj[6].SetActive(true);
		if(f == files.length){
			inRoomObj[5].SetActive(false);
		}
	}else{
		f--;
		inRoomObj[5].SetActive(true);
		if(f == 1){
			inRoomObj[6].SetActive(false);
		}
	}
	file = files[f-1].Name;
	fileO.transform.FindChild("Text").GetComponent(UI.Text).text = files[f-1].Name;
}

function Go () {
	PhotonNetwork.room.open = false;
    PhotonNetwork.room.visible = false;
	photonView.RPC("GO", PhotonTargets.All);
}

function OnJoinedLobby () {
	for(lobby in lobbyObj){
		lobby.SetActive(true);
	}
	inLobby = true;
}

function OnLeftLobby () {
	for(lobby in lobbyObj){
		lobby.SetActive(false);
	}
	for(room in roomObj){
		room.SetActive(false);
	}
	noRoomObj.SetActive(false);
    inLobby = false;
}

function OnJoinedRoom () {
	for(obj in inRoomObj){
		obj.SetActive(true);
	}
	if(master){
		inRoomObj[0].GetComponent(UI.Text).text = pseudo;
		files = path.GetDirectories();
		if(files.length > 0){
			fileO.transform.FindChild("Text").GetComponent(UI.Text).text = files[0].Name;
			file = files[0].Name;
		}else{
			fileO.transform.FindChild("Text").GetComponent(UI.Text).text = "None map found";
			inRoomObj[5].SetActive(false);
		}
		f = 1;
	}else{
		Debug.Log("ok");
		inRoomObj[4].SetActive(false);
		inRoomObj[5].SetActive(false);
		photonView.RPC("UpdatePlayer2", PhotonTargets.All, pseudo);
	}
	inRoomObj[2].SetActive(false);
	inRoomObj[6].SetActive(false);
	inRoom = true;
}

function OnLeftRoom () {
    for(obj in inRoomObj){
		obj.SetActive(false);
	}
	master = false;
	inRoom = false;
}

function OnPhotonPlayerConnected () {
	if(master){
		inRoomObj[2].SetActive(true);
		photonView.RPC("UpdatePlayer1", PhotonTargets.All, pseudo);
		
	}
}

function OnPhotonPlayerDisconnected () {
    inRoomObj[1].GetComponent(UI.Text).text = "Player 2";
    if(!master){
    	PhotonNetwork.LeaveRoom();
    }else{
    	inRoomObj[2].SetActive(false);
    }
}

@RPC
function UpdatePlayer1 (name:String) {
	inRoomObj[0].GetComponent(UI.Text).text = name;
}

@RPC
function UpdatePlayer2 (name:String) {
	inRoomObj[1].GetComponent(UI.Text).text = name;
}

@RPC
function GO () {
	networkObj.SetActive(true);
	inRoom = false;
	//photonView.RPC("TESTTEST", PhotonTargets.All);
	network.master = master;
	network.pseudo = pseudo;
	if(master){
		network.player = 1;
		network.map = file;
	}else{
		network.player = 2;
		//networkObj.GetComponent(network).ID();
	}
    PhotonNetwork.LoadLevel("onlineMap");
}

@RPC
function TESTTEST () {
	Debug.Log("test");
}