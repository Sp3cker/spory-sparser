# 1 "data/maps/Route109/scripts.pory"

# 2 "data/maps/Route109/scripts.pory"
.set LOCALID_LITTLE_GIRL, 9
# 3 "data/maps/Route109/scripts.pory"
@ NOTE: Route 109's sail to Dewford script references local IDs from Dewford's map.
# 4 "data/maps/Route109/scripts.pory"
@  These are labeled in DewfordTown/scripts.inc
# 5 "data/maps/Route109/scripts.pory"

# 6 "data/maps/Route109/scripts.pory"
Route109_MapScripts::
# 7 "data/maps/Route109/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, Route109_OnTransition
# 8 "data/maps/Route109/scripts.pory"
	map_script MAP_SCRIPT_ON_LOAD, Route109_OnLoad
# 9 "data/maps/Route109/scripts.pory"
	map_script MAP_SCRIPT_ON_WARP_INTO_MAP_TABLE, Route109_OnWarp
# 10 "data/maps/Route109/scripts.pory"
	map_script MAP_SCRIPT_ON_FRAME_TABLE, Route109_OnFrame
# 11 "data/maps/Route109/scripts.pory"
	.byte 0
# 12 "data/maps/Route109/scripts.pory"

# 13 "data/maps/Route109/scripts.pory"
Route109_OnTransition:
# 14 "data/maps/Route109/scripts.pory"
	setflag FLAG_VISITED_SLATEPORT_CITY
# 15 "data/maps/Route109/scripts.pory"
	goto_if_set FLAG_DEFEATED_HOT_HOUSE, SetHotHouseGirlPermLoc
# 16 "data/maps/Route109/scripts.pory"
	end
# 17 "data/maps/Route109/scripts.pory"

# 18 "data/maps/Route109/scripts.pory"
Route109_OnLoad:
# 19 "data/maps/Route109/scripts.pory"
	goto_if_set FLAG_DEFEATED_HOT_HOUSE, SetHotHouseGirlPermLoc
# 20 "data/maps/Route109/scripts.pory"
	end
# 21 "data/maps/Route109/scripts.pory"

# 22 "data/maps/Route109/scripts.pory"
Route109_OnWarp:
# 23 "data/maps/Route109/scripts.pory"
	map_script_2 VAR_LEAVING_HOT_HOUSE, 1, Route109_EventScript_PlayerTurnNorth
# 24 "data/maps/Route109/scripts.pory"
	.2byte 0
# 25 "data/maps/Route109/scripts.pory"

# 26 "data/maps/Route109/scripts.pory"
Route109_EventScript_PlayerTurnNorth::
# 27 "data/maps/Route109/scripts.pory"
	turnobject OBJ_EVENT_ID_PLAYER, DIR_SOUTH
# 28 "data/maps/Route109/scripts.pory"
	end
# 29 "data/maps/Route109/scripts.pory"

# 30 "data/maps/Route109/scripts.pory"
Route109_OnFrame:
# 31 "data/maps/Route109/scripts.pory"
	map_script_2 VAR_LEAVING_HOT_HOUSE, 1, Route109_EventScript_ExitHotHouse
# 32 "data/maps/Route109/scripts.pory"
	.2byte 0
# 33 "data/maps/Route109/scripts.pory"

# 34 "data/maps/Route109/scripts.pory"
Route109_EventScript_ExitHotHouse::
# 35 "data/maps/Route109/scripts.pory"
	lockall
# 36 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_WalkDown2
# 37 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 38 "data/maps/Route109/scripts.pory"
	applymovement LOCALID_LITTLE_GIRL, Route109_EventScript_GirlWalkHotHouse
# 39 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 40 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_FaceUp
# 41 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 42 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_ThanksForPlaying, MSGBOX_DEFAULT
# 43 "data/maps/Route109/scripts.pory"
	closemessage
# 44 "data/maps/Route109/scripts.pory"
	cleartrainerflag TRAINER_JOHANNA
# 45 "data/maps/Route109/scripts.pory"
	cleartrainerflag TRAINER_BRIAN
# 46 "data/maps/Route109/scripts.pory"
	cleartrainerflag TRAINER_BRIAN_2
# 47 "data/maps/Route109/scripts.pory"
	cleartrainerflag TRAINER_DWAYNE
# 48 "data/maps/Route109/scripts.pory"
	clearflag FLAG_DEFEATED_HOT_HOUSE
# 49 "data/maps/Route109/scripts.pory"
	clearflag FLAG_RECEIVED_HOT_HOUSE_GIFT_MON
# 50 "data/maps/Route109/scripts.pory"
	setvar VAR_HOT_HOUSE_STATE, 0
# 51 "data/maps/Route109/scripts.pory"
	setvar VAR_ENTERING_HOT_HOUSE, 0
# 52 "data/maps/Route109/scripts.pory"
	setvar VAR_LEAVING_HOT_HOUSE, 0
# 53 "data/maps/Route109/scripts.pory"
	releaseall
# 54 "data/maps/Route109/scripts.pory"
	end
# 55 "data/maps/Route109/scripts.pory"

# 56 "data/maps/Route109/scripts.pory"
Route109_EventScript_GirlWalkHotHouse::
# 57 "data/maps/Route109/scripts.pory"
	walk_right
# 58 "data/maps/Route109/scripts.pory"
	walk_in_place_faster_down
# 59 "data/maps/Route109/scripts.pory"
	step_end
# 60 "data/maps/Route109/scripts.pory"

# 61 "data/maps/Route109/scripts.pory"
Route109_EventScript_StartDepartForDewford::
# 62 "data/maps/Route109/scripts.pory"
	call EventScript_BackupMrBrineyLocation
# 63 "data/maps/Route109/scripts.pory"
	setobjectsubpriority LOCALID_BRINEY_R109, MAP_ROUTE109, 0
# 64 "data/maps/Route109/scripts.pory"
	setobjectsubpriority OBJ_EVENT_ID_PLAYER, MAP_ROUTE109, 0
# 65 "data/maps/Route109/scripts.pory"
	applymovement LOCALID_BRINEY_R109, Route109_Movement_BrineyEnterBoat
# 66 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 67 "data/maps/Route109/scripts.pory"
	removeobject LOCALID_BRINEY_R109
# 68 "data/maps/Route109/scripts.pory"
	switch VAR_FACING
# 69 "data/maps/Route109/scripts.pory"
	case DIR_SOUTH, Route109_EventScript_EnterBoatSouth
# 70 "data/maps/Route109/scripts.pory"
	case DIR_WEST, Route109_EventScript_EnterBoatWest
# 71 "data/maps/Route109/scripts.pory"
	case DIR_EAST, Route109_EventScript_EnterBoatEast
# 72 "data/maps/Route109/scripts.pory"
	end
# 73 "data/maps/Route109/scripts.pory"

# 74 "data/maps/Route109/scripts.pory"
Route109_EventScript_EnterBoatSouth::
# 75 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Route109_Movement_PlayerEnterBoatSouth
# 76 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 77 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_DoSailToDewford
# 78 "data/maps/Route109/scripts.pory"
	end
# 79 "data/maps/Route109/scripts.pory"

# 80 "data/maps/Route109/scripts.pory"
Route109_EventScript_EnterBoatEast::
# 81 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Route109_Movement_PlayerEnterBoatEast
# 82 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 83 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_DoSailToDewford
# 84 "data/maps/Route109/scripts.pory"
	end
# 85 "data/maps/Route109/scripts.pory"

# 86 "data/maps/Route109/scripts.pory"
Route109_EventScript_EnterBoatWest::
# 87 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Route109_Movement_PlayerEnterBoatWest
# 88 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 89 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_DoSailToDewford
# 90 "data/maps/Route109/scripts.pory"
	end
# 91 "data/maps/Route109/scripts.pory"

# 92 "data/maps/Route109/scripts.pory"
Route109_EventScript_DoSailToDewford::
# 93 "data/maps/Route109/scripts.pory"
	hideobjectat OBJ_EVENT_ID_PLAYER, MAP_ROUTE109
# 94 "data/maps/Route109/scripts.pory"
	call Common_EventScript_PlayBrineysBoatMusic
# 95 "data/maps/Route109/scripts.pory"
	applymovement LOCALID_BOAT_R109, Route109_Movement_SailToDewford
# 96 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Route109_Movement_SailToDewford
# 97 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 98 "data/maps/Route109/scripts.pory"
	delay 50
# 99 "data/maps/Route109/scripts.pory"
	call Common_EventScript_StopBrineysBoatMusic
# 100 "data/maps/Route109/scripts.pory"
	showobjectat OBJ_EVENT_ID_PLAYER, MAP_DEWFORD_TOWN
# 101 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Route109_Movement_PlayerExitBoat
# 102 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 103 "data/maps/Route109/scripts.pory"
	addobject LOCALID_BOAT_DEWFORD
# 104 "data/maps/Route109/scripts.pory"
	clearflag FLAG_HIDE_MR_BRINEY_BOAT_DEWFORD_TOWN
# 105 "data/maps/Route109/scripts.pory"
	setobjectxyperm LOCALID_BRINEY_DEWFORD, 12, 8
# 106 "data/maps/Route109/scripts.pory"
	addobject LOCALID_BRINEY_DEWFORD
# 107 "data/maps/Route109/scripts.pory"
	setobjectsubpriority LOCALID_BRINEY_DEWFORD, MAP_DEWFORD_TOWN, 0
# 108 "data/maps/Route109/scripts.pory"
	applymovement LOCALID_BRINEY_DEWFORD, Route109_Movement_BrineyExitBoat
# 109 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 110 "data/maps/Route109/scripts.pory"
	clearflag FLAG_HIDE_MR_BRINEY_DEWFORD_TOWN
# 111 "data/maps/Route109/scripts.pory"
	setflag FLAG_HIDE_ROUTE_109_MR_BRINEY_BOAT
# 112 "data/maps/Route109/scripts.pory"
	hideobjectat LOCALID_BOAT_R109, MAP_ROUTE109
# 113 "data/maps/Route109/scripts.pory"
	msgbox DewfordTown_Text_BrineyLandedInDewford, MSGBOX_DEFAULT
# 114 "data/maps/Route109/scripts.pory"
	closemessage
# 115 "data/maps/Route109/scripts.pory"
	copyvar VAR_BRINEY_LOCATION, VAR_0x8008
# 116 "data/maps/Route109/scripts.pory"
	resetobjectsubpriority OBJ_EVENT_ID_PLAYER, MAP_ROUTE109
# 117 "data/maps/Route109/scripts.pory"
	resetobjectsubpriority LOCALID_BRINEY_DEWFORD, MAP_DEWFORD_TOWN
# 118 "data/maps/Route109/scripts.pory"
	copyobjectxytoperm LOCALID_BRINEY_DEWFORD
# 119 "data/maps/Route109/scripts.pory"
	release
# 120 "data/maps/Route109/scripts.pory"
	end
# 121 "data/maps/Route109/scripts.pory"

# 122 "data/maps/Route109/scripts.pory"
Route109_Movement_SailToDewford:
# 123 "data/maps/Route109/scripts.pory"
	walk_in_place_faster_down
# 124 "data/maps/Route109/scripts.pory"
	walk_down
# 125 "data/maps/Route109/scripts.pory"
	walk_down
# 126 "data/maps/Route109/scripts.pory"
	walk_fast_down
# 127 "data/maps/Route109/scripts.pory"
	walk_fast_down
# 128 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 129 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 130 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 131 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 132 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 133 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 134 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 135 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 136 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 137 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 138 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 139 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 140 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 141 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 142 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 143 "data/maps/Route109/scripts.pory"
	walk_faster_down
# 144 "data/maps/Route109/scripts.pory"
	walk_fast_down
# 145 "data/maps/Route109/scripts.pory"
	walk_fast_down
# 146 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 147 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 148 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 149 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 150 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 151 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 152 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 153 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 154 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 155 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 156 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 157 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 158 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 159 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 160 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 161 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 162 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 163 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 164 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 165 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 166 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 167 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 168 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 169 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 170 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 171 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 172 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 173 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 174 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 175 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 176 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 177 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 178 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 179 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 180 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 181 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 182 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 183 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 184 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 185 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 186 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 187 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 188 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 189 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 190 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 191 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 192 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 193 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 194 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 195 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 196 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 197 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 198 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 199 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 200 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 201 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 202 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 203 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 204 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 205 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 206 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 207 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 208 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 209 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 210 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 211 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 212 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 213 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 214 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 215 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 216 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 217 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 218 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 219 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 220 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 221 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 222 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 223 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 224 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 225 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 226 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 227 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 228 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 229 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 230 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 231 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 232 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 233 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 234 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 235 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 236 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 237 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 238 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 239 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 240 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 241 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 242 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 243 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 244 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 245 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 246 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 247 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 248 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 249 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 250 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 251 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 252 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 253 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 254 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 255 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 256 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 257 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 258 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 259 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 260 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 261 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 262 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 263 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 264 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 265 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 266 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 267 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 268 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 269 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 270 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 271 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 272 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 273 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 274 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 275 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 276 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 277 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 278 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 279 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 280 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 281 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 282 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 283 "data/maps/Route109/scripts.pory"
	walk_faster_left
# 284 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 285 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 286 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 287 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 288 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 289 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 290 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 291 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 292 "data/maps/Route109/scripts.pory"
	walk_fast_left
# 293 "data/maps/Route109/scripts.pory"
	walk_left
# 294 "data/maps/Route109/scripts.pory"
	walk_left
# 295 "data/maps/Route109/scripts.pory"
	walk_in_place_faster_down
# 296 "data/maps/Route109/scripts.pory"
	step_end
# 297 "data/maps/Route109/scripts.pory"

# 298 "data/maps/Route109/scripts.pory"
Route109_Movement_PlayerEnterBoatSouth:
# 299 "data/maps/Route109/scripts.pory"
	walk_down
# 300 "data/maps/Route109/scripts.pory"
	walk_down
# 301 "data/maps/Route109/scripts.pory"
	step_end
# 302 "data/maps/Route109/scripts.pory"

# 303 "data/maps/Route109/scripts.pory"
Route109_Movement_PlayerExitBoat:
# 304 "data/maps/Route109/scripts.pory"
	walk_down
# 305 "data/maps/Route109/scripts.pory"
	walk_down
# 306 "data/maps/Route109/scripts.pory"
	walk_left
# 307 "data/maps/Route109/scripts.pory"
	walk_in_place_faster_right
# 308 "data/maps/Route109/scripts.pory"
	step_end
# 309 "data/maps/Route109/scripts.pory"

# 310 "data/maps/Route109/scripts.pory"
Route109_Movement_PlayerEnterBoatEast:
# 311 "data/maps/Route109/scripts.pory"
	walk_right
# 312 "data/maps/Route109/scripts.pory"
	walk_down
# 313 "data/maps/Route109/scripts.pory"
	step_end
# 314 "data/maps/Route109/scripts.pory"

# 315 "data/maps/Route109/scripts.pory"
Route109_Movement_PlayerEnterBoatWest:
# 316 "data/maps/Route109/scripts.pory"
	walk_left
# 317 "data/maps/Route109/scripts.pory"
	walk_down
# 318 "data/maps/Route109/scripts.pory"
	step_end
# 319 "data/maps/Route109/scripts.pory"

# 320 "data/maps/Route109/scripts.pory"
Route109_Movement_BrineyEnterBoat:
# 321 "data/maps/Route109/scripts.pory"
	walk_down
# 322 "data/maps/Route109/scripts.pory"
	step_end
# 323 "data/maps/Route109/scripts.pory"

# 324 "data/maps/Route109/scripts.pory"
Route109_Movement_BrineyExitBoat:
# 325 "data/maps/Route109/scripts.pory"
	walk_down
# 326 "data/maps/Route109/scripts.pory"
	walk_in_place_faster_left
# 327 "data/maps/Route109/scripts.pory"
	step_end
# 328 "data/maps/Route109/scripts.pory"

# 329 "data/maps/Route109/scripts.pory"
Route109_EventScript_MrBriney::
# 330 "data/maps/Route109/scripts.pory"
	lock
# 331 "data/maps/Route109/scripts.pory"
	faceplayer
# 332 "data/maps/Route109/scripts.pory"
	goto_if_unset FLAG_DELIVERED_DEVON_GOODS, Route109_EventScript_HaveNotDeliveredDevonGood
# 333 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_DeliveredDevonGoods
# 334 "data/maps/Route109/scripts.pory"
	end
# 335 "data/maps/Route109/scripts.pory"

# 336 "data/maps/Route109/scripts.pory"
Route109_EventScript_HaveNotDeliveredDevonGood::
# 337 "data/maps/Route109/scripts.pory"
	message Route109_Text_BrineySailToDewfordQuestion
# 338 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BrineySailToDewfordQuestion, MSGBOX_YESNO
# 339 "data/maps/Route109/scripts.pory"
	goto_if_eq VAR_RESULT, NO, Route109_EventScript_StayHere
# 340 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_SailToDewford
# 341 "data/maps/Route109/scripts.pory"
	end
# 342 "data/maps/Route109/scripts.pory"

# 343 "data/maps/Route109/scripts.pory"
Route109_EventScript_DeliveredDevonGoods::
# 344 "data/maps/Route109/scripts.pory"
	message Route109_Text_BrineyWhereAreWeBound
# 345 "data/maps/Route109/scripts.pory"
	waitmessage
# 346 "data/maps/Route109/scripts.pory"
	multichoicedefault 21, 8, MULTI_BRINEY_OFF_DEWFORD, 1, FALSE
# 347 "data/maps/Route109/scripts.pory"
	switch VAR_RESULT
# 348 "data/maps/Route109/scripts.pory"
	case 0, Route109_EventScript_SailToDewford
# 349 "data/maps/Route109/scripts.pory"
	case 1, Route109_EventScript_ChoseNotToSail
# 350 "data/maps/Route109/scripts.pory"
	case MULTI_B_PRESSED, Route109_EventScript_ChoseNotToSail
# 351 "data/maps/Route109/scripts.pory"
	end
# 352 "data/maps/Route109/scripts.pory"

# 353 "data/maps/Route109/scripts.pory"
Route109_EventScript_SailToDewford::
# 354 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BrineyDewfordItIs, MSGBOX_DEFAULT
# 355 "data/maps/Route109/scripts.pory"
	closemessage
# 356 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_StartDepartForDewford
# 357 "data/maps/Route109/scripts.pory"
	end
# 358 "data/maps/Route109/scripts.pory"

# 359 "data/maps/Route109/scripts.pory"
Route109_EventScript_StayHere::
# 360 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BrineyDeliverDevonGoods, MSGBOX_DEFAULT
# 361 "data/maps/Route109/scripts.pory"
	release
# 362 "data/maps/Route109/scripts.pory"
	end
# 363 "data/maps/Route109/scripts.pory"

# 364 "data/maps/Route109/scripts.pory"
Route109_EventScript_ChoseNotToSail::
# 365 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BrineyTellMeWhenYouNeedToSail, MSGBOX_DEFAULT
# 366 "data/maps/Route109/scripts.pory"
	release
# 367 "data/maps/Route109/scripts.pory"
	end
# 368 "data/maps/Route109/scripts.pory"

# 369 "data/maps/Route109/scripts.pory"
Route109_EventScript_SandCastleBoy::
# 370 "data/maps/Route109/scripts.pory"
	lock
# 371 "data/maps/Route109/scripts.pory"
	faceplayer
# 372 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_SandCastleTakingLongTime, MSGBOX_DEFAULT
# 373 "data/maps/Route109/scripts.pory"
	closemessage
# 374 "data/maps/Route109/scripts.pory"
	applymovement VAR_LAST_TALKED, Common_Movement_FaceOriginalDirection
# 375 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 376 "data/maps/Route109/scripts.pory"
	release
# 377 "data/maps/Route109/scripts.pory"
	end
# 378 "data/maps/Route109/scripts.pory"

# 379 "data/maps/Route109/scripts.pory"
Route109_EventScript_SoftSandGirl::
@explanation Speak to girl on the beach
# 380 "data/maps/Route109/scripts.pory"
	lock
# 381 "data/maps/Route109/scripts.pory"
	faceplayer
# 382 "data/maps/Route109/scripts.pory"
	special GetPlayerBigGuyGirlString
# 383 "data/maps/Route109/scripts.pory"
	goto_if_set FLAG_RECEIVED_SOFT_SAND, Route109_EventScript_AlreadyReceivedSoftSand
# 384 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_YouCanHaveThis, MSGBOX_DEFAULT
# 385 "data/maps/Route109/scripts.pory"
	giveitem ITEM_SOFT_SAND
# 386 "data/maps/Route109/scripts.pory"
	goto_if_eq VAR_RESULT, 0, Common_EventScript_ShowBagIsFull
# 387 "data/maps/Route109/scripts.pory"
	closemessage
# 388 "data/maps/Route109/scripts.pory"
	applymovement VAR_LAST_TALKED, Common_Movement_FaceOriginalDirection
# 389 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 390 "data/maps/Route109/scripts.pory"
	setflag FLAG_RECEIVED_SOFT_SAND
# 391 "data/maps/Route109/scripts.pory"
	release
# 392 "data/maps/Route109/scripts.pory"
	end
# 393 "data/maps/Route109/scripts.pory"

# 394 "data/maps/Route109/scripts.pory"
Route109_EventScript_AlreadyReceivedSoftSand::
# 395 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_WereGoingToMakeBigCastle, MSGBOX_DEFAULT
# 396 "data/maps/Route109/scripts.pory"
	applymovement VAR_LAST_TALKED, Common_Movement_FaceOriginalDirection
# 397 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 398 "data/maps/Route109/scripts.pory"
	release
# 399 "data/maps/Route109/scripts.pory"
	end
# 400 "data/maps/Route109/scripts.pory"

# 401 "data/maps/Route109/scripts.pory"
Route109_EventScript_Woman::
# 402 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_LittleKidsDartAround, MSGBOX_NPC
# 403 "data/maps/Route109/scripts.pory"
	end
# 404 "data/maps/Route109/scripts.pory"

# 405 "data/maps/Route109/scripts.pory"
Route109_EventScript_OldMan::
# 406 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_ZigzagoonPicksUpLitter, MSGBOX_NPC
# 407 "data/maps/Route109/scripts.pory"
	end
# 408 "data/maps/Route109/scripts.pory"

# 409 "data/maps/Route109/scripts.pory"
Route109_EventScript_Zigzagoon::
# 410 "data/maps/Route109/scripts.pory"
	lock
# 411 "data/maps/Route109/scripts.pory"
	faceplayer
# 412 "data/maps/Route109/scripts.pory"
	waitse
# 413 "data/maps/Route109/scripts.pory"
	playmoncry SPECIES_ZIGZAGOON, CRY_MODE_NORMAL
# 414 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_ZigzagoonCry, MSGBOX_DEFAULT
# 415 "data/maps/Route109/scripts.pory"
	waitmoncry
# 416 "data/maps/Route109/scripts.pory"
	release
# 417 "data/maps/Route109/scripts.pory"
	end
# 418 "data/maps/Route109/scripts.pory"

# 419 "data/maps/Route109/scripts.pory"
Route109_EventScript_SeashoreHouseSign::
# 420 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_SeashoreHouseSign, MSGBOX_SIGN
# 421 "data/maps/Route109/scripts.pory"
	end
# 422 "data/maps/Route109/scripts.pory"

# 423 "data/maps/Route109/scripts.pory"
Route109_EventScript_TrainerTipsSign::
# 424 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_TrainerTipsSign, MSGBOX_SIGN
# 425 "data/maps/Route109/scripts.pory"
	end
# 426 "data/maps/Route109/scripts.pory"

# 427 "data/maps/Route109/scripts.pory"
Route109_EventScript_David::
# 428 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_DAVID, Route109_Text_DavidIntro, Route109_Text_DavidDefeated
# 429 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_DavidPostBattle, MSGBOX_AUTOCLOSE
# 430 "data/maps/Route109/scripts.pory"
	end
# 431 "data/maps/Route109/scripts.pory"

# 432 "data/maps/Route109/scripts.pory"
Route109_EventScript_Alice::
# 433 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_ALICE, Route109_Text_AliceIntro, Route109_Text_AliceDefeated
# 434 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_AlicePostBattle, MSGBOX_AUTOCLOSE
# 435 "data/maps/Route109/scripts.pory"
	end
# 436 "data/maps/Route109/scripts.pory"

# 437 "data/maps/Route109/scripts.pory"
Route109_EventScript_Huey::
# 438 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_HUEY, Route109_Text_HueyIntro, Route109_Text_HueyDefeated
# 439 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_HueyPostBattle, MSGBOX_AUTOCLOSE
# 440 "data/maps/Route109/scripts.pory"
	end
# 441 "data/maps/Route109/scripts.pory"

# 442 "data/maps/Route109/scripts.pory"
Route109_EventScript_Edmond::
# 443 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_EDMOND, Route109_Text_EdmondIntro, Route109_Text_EdmondDefeated
# 444 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_EdmondPostBattle, MSGBOX_AUTOCLOSE
# 445 "data/maps/Route109/scripts.pory"
	end
# 446 "data/maps/Route109/scripts.pory"

# 447 "data/maps/Route109/scripts.pory"
Route109_EventScript_Ricky::
# 448 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_RICKY_1, Route109_Text_RickyIntro, Route109_Text_RickyDefeated, Route109_EventScript_RickyRegisterMatchCallAfterBattle
# 449 "data/maps/Route109/scripts.pory"
	specialvar VAR_RESULT, ShouldTryRematchBattle
# 450 "data/maps/Route109/scripts.pory"
	goto_if_eq VAR_RESULT, TRUE, Route109_EventScript_RickyRematch
# 451 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_RickyPostBattle, MSGBOX_DEFAULT
# 452 "data/maps/Route109/scripts.pory"
	release
# 453 "data/maps/Route109/scripts.pory"
	end
# 454 "data/maps/Route109/scripts.pory"

# 455 "data/maps/Route109/scripts.pory"
Route109_EventScript_RickyRegisterMatchCallAfterBattle::
# 456 "data/maps/Route109/scripts.pory"
	special PlayerFaceTrainerAfterBattle
# 457 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 458 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_RickyRegister, MSGBOX_DEFAULT
# 459 "data/maps/Route109/scripts.pory"
	register_matchcall TRAINER_RICKY_1
# 460 "data/maps/Route109/scripts.pory"
	release
# 461 "data/maps/Route109/scripts.pory"
	end
# 462 "data/maps/Route109/scripts.pory"

# 463 "data/maps/Route109/scripts.pory"
Route109_EventScript_RickyRematch::
# 464 "data/maps/Route109/scripts.pory"
	trainerbattle_rematch TRAINER_RICKY_1, Route109_Text_RickyRematchIntro, Route109_Text_RickyRematchDefeated
# 465 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_RickyRematchPostBattle, MSGBOX_AUTOCLOSE
# 466 "data/maps/Route109/scripts.pory"
	end
# 467 "data/maps/Route109/scripts.pory"

# 468 "data/maps/Route109/scripts.pory"
Route109_EventScript_Lola::
# 469 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_LOLA_1, Route109_Text_LolaIntro, Route109_Text_LolaDefeated, Route109_EventScript_LolaRegisterMatchCallAfterBattle
# 470 "data/maps/Route109/scripts.pory"
	specialvar VAR_RESULT, ShouldTryRematchBattle
# 471 "data/maps/Route109/scripts.pory"
	goto_if_eq VAR_RESULT, TRUE, Route109_EventScript_LolaRematch
# 472 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_LolaPostBattle, MSGBOX_DEFAULT
# 473 "data/maps/Route109/scripts.pory"
	release
# 474 "data/maps/Route109/scripts.pory"
	end
# 475 "data/maps/Route109/scripts.pory"

# 476 "data/maps/Route109/scripts.pory"
Route109_EventScript_LolaRegisterMatchCallAfterBattle::
# 477 "data/maps/Route109/scripts.pory"
	special PlayerFaceTrainerAfterBattle
# 478 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 479 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_LolaRegister, MSGBOX_DEFAULT
# 480 "data/maps/Route109/scripts.pory"
	register_matchcall TRAINER_LOLA_1
# 481 "data/maps/Route109/scripts.pory"
	release
# 482 "data/maps/Route109/scripts.pory"
	end
# 483 "data/maps/Route109/scripts.pory"

# 484 "data/maps/Route109/scripts.pory"
Route109_EventScript_LolaRematch::
# 485 "data/maps/Route109/scripts.pory"
	trainerbattle_rematch TRAINER_LOLA_1, Route109_Text_LolaRematchIntro, Route109_Text_LolaRematchDefeated
# 486 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_LolaRematchPostBattle, MSGBOX_AUTOCLOSE
# 487 "data/maps/Route109/scripts.pory"
	end
# 488 "data/maps/Route109/scripts.pory"

# 489 "data/maps/Route109/scripts.pory"
Route109_EventScript_Austina::
# 490 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_AUSTINA, Route109_Text_AustinaIntro, Route109_Text_AustinaDefeated
# 491 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_AustinaPostBattle, MSGBOX_AUTOCLOSE
# 492 "data/maps/Route109/scripts.pory"
	end
# 493 "data/maps/Route109/scripts.pory"

# 494 "data/maps/Route109/scripts.pory"
Route109_EventScript_Gwen::
# 495 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_GWEN, Route109_Text_GwenIntro, Route109_Text_GwenDefeated
# 496 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_GwenPostBattle, MSGBOX_AUTOCLOSE
# 497 "data/maps/Route109/scripts.pory"
	end
# 498 "data/maps/Route109/scripts.pory"

# 499 "data/maps/Route109/scripts.pory"
Route109_EventScript_Carter::
# 500 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_CARTER, Route109_Text_CarterIntro, Route109_Text_CarterDefeated
# 501 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_CarterPostBattle, MSGBOX_AUTOCLOSE
# 502 "data/maps/Route109/scripts.pory"
	end
# 503 "data/maps/Route109/scripts.pory"

# 504 "data/maps/Route109/scripts.pory"
Route109_EventScript_Paul::
# 505 "data/maps/Route109/scripts.pory"
	trainerbattle_double TRAINER_MEL_AND_PAUL, Route109_Text_PaulIntro, Route109_Text_PaulDefeated, Route109_Text_PaulNotEnoughPokemon
# 506 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_PaulPostBattle, MSGBOX_AUTOCLOSE
# 507 "data/maps/Route109/scripts.pory"
	end
# 508 "data/maps/Route109/scripts.pory"

# 509 "data/maps/Route109/scripts.pory"
Route109_EventScript_Mel::
# 510 "data/maps/Route109/scripts.pory"
	trainerbattle_double TRAINER_MEL_AND_PAUL, Route109_Text_MelIntro, Route109_Text_MelDefeated, Route109_Text_MelNotEnoughPokemon
# 511 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_MelPostBattle, MSGBOX_AUTOCLOSE
# 512 "data/maps/Route109/scripts.pory"
	end
# 513 "data/maps/Route109/scripts.pory"

# 514 "data/maps/Route109/scripts.pory"
Route109_EventScript_Chandler::
# 515 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_CHANDLER, Route109_Text_ChandlerIntro, Route109_Text_ChandlerDefeated
# 516 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_ChandlerPostBattle, MSGBOX_AUTOCLOSE
# 517 "data/maps/Route109/scripts.pory"
	end
# 518 "data/maps/Route109/scripts.pory"

# 519 "data/maps/Route109/scripts.pory"
Route109_EventScript_Hailey::
# 520 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_HAILEY, Route109_Text_HaileyIntro, Route109_Text_HaileyDefeated
# 521 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_HaileyPostBattle, MSGBOX_AUTOCLOSE
# 522 "data/maps/Route109/scripts.pory"
	end
# 523 "data/maps/Route109/scripts.pory"

# 524 "data/maps/Route109/scripts.pory"
Route109_EventScript_Elijah::
# 525 "data/maps/Route109/scripts.pory"
	trainerbattle_single TRAINER_ELIJAH, Route109_Text_ElijahIntro, Route109_Text_ElijahDefeated
# 526 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_ElijahPostBattle, MSGBOX_AUTOCLOSE
# 527 "data/maps/Route109/scripts.pory"
	end
# 528 "data/maps/Route109/scripts.pory"

# 529 "data/maps/Route109/scripts.pory"
DewfordTown_Text_BrineyLandedInSlateportDeliverGoods:
# 530 "data/maps/Route109/scripts.pory"
	.string "Mr. Briney: Ahoy!\n"
# 531 "data/maps/Route109/scripts.pory"
	.string "We've made land in Slateport!\p"
# 532 "data/maps/Route109/scripts.pory"
	.string "I suppose you're going to visit Capt.\n"
# 533 "data/maps/Route109/scripts.pory"
	.string "Stern and deliver the Devon Goods?$"
# 534 "data/maps/Route109/scripts.pory"

# 535 "data/maps/Route109/scripts.pory"
Route109_Text_BrineySailToDewfordQuestion:
# 536 "data/maps/Route109/scripts.pory"
	.string "Mr. Briney: I thought you're supposed\n"
# 537 "data/maps/Route109/scripts.pory"
	.string "to deliver the Devon Goods.\p"
# 538 "data/maps/Route109/scripts.pory"
	.string "Would you like to sail back to\n"
# 539 "data/maps/Route109/scripts.pory"
	.string "Dewford, then?$"
# 540 "data/maps/Route109/scripts.pory"

# 541 "data/maps/Route109/scripts.pory"
Route109_Text_BrineyDewfordItIs:
# 542 "data/maps/Route109/scripts.pory"
	.string "Mr. Briney: Dewford it is, then!\p"
# 543 "data/maps/Route109/scripts.pory"
	.string "Anchors aweigh!\n"
# 544 "data/maps/Route109/scripts.pory"
	.string "Peeko, we're setting sail, my darling!$"
# 545 "data/maps/Route109/scripts.pory"

# 546 "data/maps/Route109/scripts.pory"
Route109_Text_BrineyDeliverDevonGoods:
# 547 "data/maps/Route109/scripts.pory"
	.string "Mr. Briney: Then you go on and deliver\n"
# 548 "data/maps/Route109/scripts.pory"
	.string "the Devon Goods. I'll be waiting.$"
# 549 "data/maps/Route109/scripts.pory"

# 550 "data/maps/Route109/scripts.pory"
DewfordTown_Text_BrineyLandedInSlateport:
# 551 "data/maps/Route109/scripts.pory"
	.string "Mr. Briney: Ahoy! We've made land in\n"
# 552 "data/maps/Route109/scripts.pory"
	.string "Slateport!\p"
# 553 "data/maps/Route109/scripts.pory"
	.string "You just go on and tell me whenever\n"
# 554 "data/maps/Route109/scripts.pory"
	.string "you want to set sail again!$"
# 555 "data/maps/Route109/scripts.pory"

# 556 "data/maps/Route109/scripts.pory"
Route109_Text_BrineyWhereAreWeBound:
# 557 "data/maps/Route109/scripts.pory"
	.string "Mr. Briney: Ahoy!\n"
# 558 "data/maps/Route109/scripts.pory"
	.string "For you, I'll go out to sea anytime!\p"
# 559 "data/maps/Route109/scripts.pory"
	.string "Now, my friend, where are we bound?$"
# 560 "data/maps/Route109/scripts.pory"

# 561 "data/maps/Route109/scripts.pory"
Route109_Text_BrineyTellMeWhenYouNeedToSail:
# 562 "data/maps/Route109/scripts.pory"
	.string "Mr. Briney: You just tell me whenever\n"
# 563 "data/maps/Route109/scripts.pory"
	.string "you need to set sail again!$"
# 564 "data/maps/Route109/scripts.pory"

# 565 "data/maps/Route109/scripts.pory"
Route109_Text_LittleKidsDartAround:
# 566 "data/maps/Route109/scripts.pory"
	.string "Little kids can dart around so quickly…\p"
# 567 "data/maps/Route109/scripts.pory"
	.string "You don't dare take your eyes off them\n"
# 568 "data/maps/Route109/scripts.pory"
	.string "for an instant. It's very taxing.\p"
# 569 "data/maps/Route109/scripts.pory"
	.string "Mine are with my Pokémon, so they\n"
# 570 "data/maps/Route109/scripts.pory"
	.string "should be okay, but…$"
# 571 "data/maps/Route109/scripts.pory"

# 572 "data/maps/Route109/scripts.pory"
Route109_Text_SandCastleTakingLongTime:
# 573 "data/maps/Route109/scripts.pory"
	.string "Our sand castle's taking a long time\n"
# 574 "data/maps/Route109/scripts.pory"
	.string "to make.$"
# 575 "data/maps/Route109/scripts.pory"

# 576 "data/maps/Route109/scripts.pory"
Route109_Text_YouCanHaveThis:
# 577 "data/maps/Route109/scripts.pory"
	.string "You can have this!$"
# 578 "data/maps/Route109/scripts.pory"

# 579 "data/maps/Route109/scripts.pory"
Route109_Text_WereGoingToMakeBigCastle:
# 580 "data/maps/Route109/scripts.pory"
	.string "We're going to get all the sand from\n"
# 581 "data/maps/Route109/scripts.pory"
	.string "the beach and make a big castle!\p"
# 582 "data/maps/Route109/scripts.pory"
	.string "And then we're going to be a king and\n"
# 583 "data/maps/Route109/scripts.pory"
	.string "queen.\p"
# 584 "data/maps/Route109/scripts.pory"
	.string "We'll let you be a servant.$"
# 585 "data/maps/Route109/scripts.pory"

# 586 "data/maps/Route109/scripts.pory"
Route109_Text_ZigzagoonPicksUpLitter:
# 587 "data/maps/Route109/scripts.pory"
	.string "The water around these parts is clean.\p"
# 588 "data/maps/Route109/scripts.pory"
	.string "But, I get my Zigzagoon to pick up\n"
# 589 "data/maps/Route109/scripts.pory"
	.string "litter from the shoreline at times.\p"
# 590 "data/maps/Route109/scripts.pory"
	.string "Dirty water becomes rain and joins our\n"
# 591 "data/maps/Route109/scripts.pory"
	.string "rivers, which we drink from…\p"
# 592 "data/maps/Route109/scripts.pory"
	.string "If we pollute the sea, it all comes\n"
# 593 "data/maps/Route109/scripts.pory"
	.string "back to haunt us eventually.$"
# 594 "data/maps/Route109/scripts.pory"

# 595 "data/maps/Route109/scripts.pory"
Route109_Text_ZigzagoonCry:
# 596 "data/maps/Route109/scripts.pory"
	.string "Zigzagoon: Guguu?$"
# 597 "data/maps/Route109/scripts.pory"

# 598 "data/maps/Route109/scripts.pory"
Route109_Text_SeashoreHouseSign:
# 599 "data/maps/Route109/scripts.pory"
	.string "Hot House\p"
# 600 "data/maps/Route109/scripts.pory"
	.string "“May hot battles rage on hot sands!\n"
# 601 "data/maps/Route109/scripts.pory"
	.string "The place for hot trainers!”$"
# 602 "data/maps/Route109/scripts.pory"

# 603 "data/maps/Route109/scripts.pory"
Route109_Text_TrainerTipsSign:
# 604 "data/maps/Route109/scripts.pory"
	.string "Trainer Tips\p"
# 605 "data/maps/Route109/scripts.pory"
	.string "Some areas are blocked off until\n"
# 606 "data/maps/Route109/scripts.pory"
	.string "certain events are completed, such as\l"
# 607 "data/maps/Route109/scripts.pory"
	.string "obtaining a new Gym Badge.$"
# 608 "data/maps/Route109/scripts.pory"

# 609 "data/maps/Route109/scripts.pory"

# 610 "data/maps/Route109/scripts.pory"
Route109_Text_ThanksForPlaying:
# 611 "data/maps/Route109/scripts.pory"
	.string "Yo, trainer!\p"
# 612 "data/maps/Route109/scripts.pory"
	.string "Looks like you beat the trainers in the\n"
# 613 "data/maps/Route109/scripts.pory"
	.string "Hot House no problem!\p"
# 614 "data/maps/Route109/scripts.pory"
	.string "Thanks for stopping by, and feel free\n"
# 615 "data/maps/Route109/scripts.pory"
	.string "to come take the challenge again\l"
# 616 "data/maps/Route109/scripts.pory"
	.string "anytime, yo!$"

Route109_EventScript_HotHouseGirl::
# 620 "data/maps/Route109/scripts.pory"
	lock
# 621 "data/maps/Route109/scripts.pory"
	faceplayer
# 622 "data/maps/Route109/scripts.pory"
	goto_if_unset FLAG_BADGE02_GET, Route109_EventScript_SeashoreHouseGirlNoBadge
# 623 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_HotHouseFullIntro
# 624 "data/maps/Route109/scripts.pory"
	closemessage
# 625 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_WhichRewardMenu
	return


Route109_EventScript_WhichRewardMenu::
# 629 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_IntroQuestion
# 631 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_0, 2
# 633 "data/maps/Route109/scripts.pory"
	goto_if_unset FLAG_BADGE03_GET, Route109_EventScript_WhichRewardMenu_2
# 637 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_2, 3
Route109_EventScript_WhichRewardMenu_1:
# 640 "data/maps/Route109/scripts.pory"
	goto_if_unset FLAG_BADGE04_GET, Route109_EventScript_WhichRewardMenu_6
# 644 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_4, 4
Route109_EventScript_WhichRewardMenu_5:
# 647 "data/maps/Route109/scripts.pory"
	goto_if_unset FLAG_BADGE05_GET, Route109_EventScript_WhichRewardMenu_10
# 651 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_6, 5
Route109_EventScript_WhichRewardMenu_9:
# 654 "data/maps/Route109/scripts.pory"
	goto_if_unset FLAG_BADGE06_GET, Route109_EventScript_WhichRewardMenu_14
# 658 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_8, 6
Route109_EventScript_WhichRewardMenu_13:
# 661 "data/maps/Route109/scripts.pory"
	goto_if_unset FLAG_BADGE07_GET, Route109_EventScript_WhichRewardMenu_18
# 665 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_10, 7
Route109_EventScript_WhichRewardMenu_17:
# 668 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_11, MULTI_B_PRESSED
# 671 "data/maps/Route109/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 2, DYN_MULTICHOICE_CB_NONE
# 673 "data/maps/Route109/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq Route109_EventScript_WhichRewardMenu_22
Route109_EventScript_WhichRewardMenu_21:
# 679 "data/maps/Route109/scripts.pory"
	copyvar VAR_0x8005, VAR_RESULT
# 682 "data/maps/Route109/scripts.pory"
	specialvar VAR_0x8006, GetNumBadges
# 684 "data/maps/Route109/scripts.pory"
	compare VAR_0x8006, VAR_0x8005
# 685 "data/maps/Route109/scripts.pory"
	goto_if_lt Route109_EventScript_SorryNotEnoughBadges
# 686 "data/maps/Route109/scripts.pory"
	buffernumberstring STR_VAR_1, VAR_0x8005
# 688 "data/maps/Route109/scripts.pory"
	compare VAR_0x8005, 2
	goto_if_eq Route109_EventScript_WhichRewardMenu_25
Route109_EventScript_WhichRewardMenu_24:
# 693 "data/maps/Route109/scripts.pory"
	compare VAR_0x8005, 3
	goto_if_eq Route109_EventScript_WhichRewardMenu_28
Route109_EventScript_WhichRewardMenu_27:
# 698 "data/maps/Route109/scripts.pory"
	compare VAR_0x8005, 4
	goto_if_eq Route109_EventScript_WhichRewardMenu_31
Route109_EventScript_WhichRewardMenu_30:
# 703 "data/maps/Route109/scripts.pory"
	compare VAR_0x8005, 5
	goto_if_eq Route109_EventScript_WhichRewardMenu_34
Route109_EventScript_WhichRewardMenu_33:
# 708 "data/maps/Route109/scripts.pory"
	compare VAR_0x8005, 6
	goto_if_eq Route109_EventScript_WhichRewardMenu_37
Route109_EventScript_WhichRewardMenu_36:
# 713 "data/maps/Route109/scripts.pory"
	compare VAR_0x8005, 7
	goto_if_eq Route109_EventScript_WhichRewardMenu_40
Route109_EventScript_WhichRewardMenu_39:
# 718 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_HotHouseNo
	return

Route109_EventScript_WhichRewardMenu_2:
# 634 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_1, 3
	goto Route109_EventScript_WhichRewardMenu_1

Route109_EventScript_WhichRewardMenu_6:
# 641 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_3, 4
	goto Route109_EventScript_WhichRewardMenu_5

Route109_EventScript_WhichRewardMenu_10:
# 648 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_5, 5
	goto Route109_EventScript_WhichRewardMenu_9

Route109_EventScript_WhichRewardMenu_14:
# 655 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_7, 6
	goto Route109_EventScript_WhichRewardMenu_13

Route109_EventScript_WhichRewardMenu_18:
# 662 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_WhichRewardMenu_Text_9, 7
	goto Route109_EventScript_WhichRewardMenu_17

Route109_EventScript_WhichRewardMenu_22:
# 675 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_HotHouseNo
	goto Route109_EventScript_WhichRewardMenu_21

Route109_EventScript_WhichRewardMenu_25:
# 690 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_Badge2Options
	goto Route109_EventScript_WhichRewardMenu_24

Route109_EventScript_WhichRewardMenu_28:
# 695 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_Badge3Options
	goto Route109_EventScript_WhichRewardMenu_27

Route109_EventScript_WhichRewardMenu_31:
# 700 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_Badge4Options
	goto Route109_EventScript_WhichRewardMenu_30

Route109_EventScript_WhichRewardMenu_34:
# 705 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_Badge5Options
	goto Route109_EventScript_WhichRewardMenu_33

Route109_EventScript_WhichRewardMenu_37:
# 710 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_Badge6Options
	goto Route109_EventScript_WhichRewardMenu_36

Route109_EventScript_WhichRewardMenu_40:
# 715 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_Badge7Options
	goto Route109_EventScript_WhichRewardMenu_39


Route109_EventScript_Badge2Options::
# 723 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BadgeRewardsQuestion
# 725 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_0, 1
# 726 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_1, 2
# 727 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_2, 3
# 728 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_3, 4
# 729 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_4, MULTI_B_PRESSED
# 734 "data/maps/Route109/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 1, DYN_MULTICHOICE_CB_NONE
# 736 "data/maps/Route109/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq Route109_EventScript_Badge2Options_2
Route109_EventScript_Badge2Options_1:
# 742 "data/maps/Route109/scripts.pory"
	copyvar VAR_0x8004, VAR_RESULT
# 743 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_ConfirmAndEnterHotHouse
	return

Route109_EventScript_Badge2Options_2:
# 738 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_WhichRewardMenu
	goto Route109_EventScript_Badge2Options_1


Route109_EventScript_Badge3Options::
# 748 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BadgeRewardsQuestion
# 750 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge3Options_Text_0, 5
# 751 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge3Options_Text_1, 6
# 752 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge3Options_Text_2, 7
# 753 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge3Options_Text_3, 8
# 754 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_4, MULTI_B_PRESSED
# 759 "data/maps/Route109/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 5, DYN_MULTICHOICE_CB_NONE
# 761 "data/maps/Route109/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq Route109_EventScript_Badge3Options_2
Route109_EventScript_Badge3Options_1:
# 767 "data/maps/Route109/scripts.pory"
	copyvar VAR_0x8004, VAR_RESULT
# 768 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_ConfirmAndEnterHotHouse
	return

Route109_EventScript_Badge3Options_2:
# 763 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_WhichRewardMenu
	goto Route109_EventScript_Badge3Options_1


Route109_EventScript_Badge4Options::
# 773 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BadgeRewardsQuestion
# 775 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge4Options_Text_0, 9
# 776 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge4Options_Text_1, 10
# 777 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge4Options_Text_2, 11
# 778 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge4Options_Text_3, 12
# 779 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_4, MULTI_B_PRESSED
# 784 "data/maps/Route109/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 9, DYN_MULTICHOICE_CB_NONE
# 786 "data/maps/Route109/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq Route109_EventScript_Badge4Options_2
Route109_EventScript_Badge4Options_1:
# 792 "data/maps/Route109/scripts.pory"
	copyvar VAR_0x8004, VAR_RESULT
# 793 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_ConfirmAndEnterHotHouse
	return

Route109_EventScript_Badge4Options_2:
# 788 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_WhichRewardMenu
	goto Route109_EventScript_Badge4Options_1


Route109_EventScript_Badge5Options::
# 798 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BadgeRewardsQuestion
# 800 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge5Options_Text_0, 13
# 801 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge5Options_Text_1, 14
# 802 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_4, MULTI_B_PRESSED
# 807 "data/maps/Route109/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 13, DYN_MULTICHOICE_CB_NONE
# 809 "data/maps/Route109/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq Route109_EventScript_Badge5Options_2
Route109_EventScript_Badge5Options_1:
# 815 "data/maps/Route109/scripts.pory"
	copyvar VAR_0x8004, VAR_RESULT
# 816 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_ConfirmAndEnterHotHouse
	return

Route109_EventScript_Badge5Options_2:
# 811 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_WhichRewardMenu
	goto Route109_EventScript_Badge5Options_1


Route109_EventScript_Badge6Options::
# 821 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BadgeRewardsQuestion
# 823 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge6Options_Text_0, 15
# 824 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_4, MULTI_B_PRESSED
# 829 "data/maps/Route109/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 15, DYN_MULTICHOICE_CB_NONE
# 831 "data/maps/Route109/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq Route109_EventScript_Badge6Options_2
Route109_EventScript_Badge6Options_1:
# 837 "data/maps/Route109/scripts.pory"
	copyvar VAR_0x8004, VAR_RESULT
# 838 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_ConfirmAndEnterHotHouse
	return

Route109_EventScript_Badge6Options_2:
# 833 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_WhichRewardMenu
	goto Route109_EventScript_Badge6Options_1


Route109_EventScript_Badge7Options::
# 843 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_BadgeRewardsQuestion
# 845 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge7Options_Text_0, 16
# 846 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge7Options_Text_1, 17
# 847 "data/maps/Route109/scripts.pory"
	dynmultipush Route109_EventScript_Badge2Options_Text_4, MULTI_B_PRESSED
# 852 "data/maps/Route109/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 16, DYN_MULTICHOICE_CB_NONE
# 854 "data/maps/Route109/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq Route109_EventScript_Badge7Options_2
Route109_EventScript_Badge7Options_1:
# 860 "data/maps/Route109/scripts.pory"
	copyvar VAR_0x8004, VAR_RESULT
# 861 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_ConfirmAndEnterHotHouse
	return

Route109_EventScript_Badge7Options_2:
# 856 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_WhichRewardMenu
	goto Route109_EventScript_Badge7Options_1


Route109_EventScript_ConfirmAndEnterHotHouse::
# 866 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_EnterCantLeave, MSGBOX_YESNO
# 868 "data/maps/Route109/scripts.pory"
	compare VAR_RESULT, NO
	goto_if_eq Route109_EventScript_ConfirmAndEnterHotHouse_2
Route109_EventScript_ConfirmAndEnterHotHouse_1:
# 874 "data/maps/Route109/scripts.pory"
	copyvar VAR_HOT_HOUSE_STATE, VAR_0x8004
# 875 "data/maps/Route109/scripts.pory"
	setvar VAR_ENTERING_HOT_HOUSE, 1
# 877 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_GoodLuckTrainer, MSGBOX_DEFAULT
# 878 "data/maps/Route109/scripts.pory"
	closemessage
# 880 "data/maps/Route109/scripts.pory"
	switch VAR_FACING
# 882 "data/maps/Route109/scripts.pory"
	case DIR_EAST, Route109_EventScript_ConfirmAndEnterHotHouse_6
# 887 "data/maps/Route109/scripts.pory"
	case DIR_NORTH, Route109_EventScript_ConfirmAndEnterHotHouse_7
# 892 "data/maps/Route109/scripts.pory"
	case DIR_WEST, Route109_EventScript_ConfirmAndEnterHotHouse_8
# 898 "data/maps/Route109/scripts.pory"
	applymovement LOCALID_LITTLE_GIRL, HotHouseGirlUnblockStepWest
# 899 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 900 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, PlayerEnterHotHouseStepNorth
# 901 "data/maps/Route109/scripts.pory"
	waitmovement 0
Route109_EventScript_ConfirmAndEnterHotHouse_4:
# 905 "data/maps/Route109/scripts.pory"
	warp MAP_ROUTE109_SEASHORE_HOUSE, 6, 9
# 906 "data/maps/Route109/scripts.pory"
	waitstate
# 907 "data/maps/Route109/scripts.pory"
	release
	end

Route109_EventScript_ConfirmAndEnterHotHouse_2:
# 870 "data/maps/Route109/scripts.pory"
	goto Route109_EventScript_HotHouseNo
	goto Route109_EventScript_ConfirmAndEnterHotHouse_1

Route109_EventScript_ConfirmAndEnterHotHouse_6:
# 883 "data/maps/Route109/scripts.pory"
	applymovement LOCALID_LITTLE_GIRL, HotHouseGirlUnblockStepEast
# 884 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 885 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, PlayerEnterHotHouseStepEast
# 886 "data/maps/Route109/scripts.pory"
	waitmovement 0
	goto Route109_EventScript_ConfirmAndEnterHotHouse_4

Route109_EventScript_ConfirmAndEnterHotHouse_7:
# 888 "data/maps/Route109/scripts.pory"
	applymovement LOCALID_LITTLE_GIRL, HotHouseGirlUnblockStepWest
# 889 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 890 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, PlayerEnterHotHouseStepNorth
# 891 "data/maps/Route109/scripts.pory"
	waitmovement 0
	goto Route109_EventScript_ConfirmAndEnterHotHouse_4

Route109_EventScript_ConfirmAndEnterHotHouse_8:
# 893 "data/maps/Route109/scripts.pory"
	applymovement LOCALID_LITTLE_GIRL, HotHouseGirlUnblockStepWest
# 894 "data/maps/Route109/scripts.pory"
	waitmovement 0
# 895 "data/maps/Route109/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, PlayerEnterHotHouseStepWest
# 896 "data/maps/Route109/scripts.pory"
	waitmovement 0
	goto Route109_EventScript_ConfirmAndEnterHotHouse_4


Route109_EventScript_SeashoreHouseGirlNoBadge::
# 912 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_PapasSpotGettingFixed
# 913 "data/maps/Route109/scripts.pory"
	release
	end


Route109_EventScript_HotHouseNo::
# 918 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_HotHouseNo
# 919 "data/maps/Route109/scripts.pory"
	setvar VAR_HOT_HOUSE_STATE, 0
# 920 "data/maps/Route109/scripts.pory"
	setvar VAR_ENTERING_HOT_HOUSE, 0
# 921 "data/maps/Route109/scripts.pory"
	release
	end


Route109_EventScript_SorryNotEnoughBadges::
# 926 "data/maps/Route109/scripts.pory"
	msgbox Route109_Text_SorryNotEnoughBadges
# 927 "data/maps/Route109/scripts.pory"
	setvar VAR_HOT_HOUSE_STATE, 0
# 928 "data/maps/Route109/scripts.pory"
	setvar VAR_ENTERING_HOT_HOUSE, 0
# 929 "data/maps/Route109/scripts.pory"
	release
	end


HotHouseGirlUnblockStepWest::
# 935 "data/maps/Route109/scripts.pory"
	walk_left
# 936 "data/maps/Route109/scripts.pory"
	face_right
# 937 "data/maps/Route109/scripts.pory"
	step_end
	return


HotHouseGirlUnblockStepEast::
# 942 "data/maps/Route109/scripts.pory"
	walk_right
# 943 "data/maps/Route109/scripts.pory"
	face_left
# 944 "data/maps/Route109/scripts.pory"
	step_end
	return


PlayerEnterHotHouseStepEast::
# 949 "data/maps/Route109/scripts.pory"
	walk_right
# 950 "data/maps/Route109/scripts.pory"
	walk_up
# 951 "data/maps/Route109/scripts.pory"
	step_end
	return


PlayerEnterHotHouseStepWest::
# 956 "data/maps/Route109/scripts.pory"
	walk_left
# 957 "data/maps/Route109/scripts.pory"
	walk_up
# 958 "data/maps/Route109/scripts.pory"
	step_end
	return


PlayerEnterHotHouseStepNorth::
# 963 "data/maps/Route109/scripts.pory"
	walk_up
# 964 "data/maps/Route109/scripts.pory"
	walk_up
# 965 "data/maps/Route109/scripts.pory"
	step_end
	return


PlayerEnteredHotHouse::
# 970 "data/maps/Route109/scripts.pory"
	walk_up
# 971 "data/maps/Route109/scripts.pory"
	step_end
	return


SetHotHouseGirlPermLoc::
# 975 "data/maps/Route109/scripts.pory"
	setobjectxyperm LOCALID_LITTLE_GIRL, 11, 6
	end


Route109_EventScript_WhichRewardMenu_Text_0:
# 631 "data/maps/Route109/scripts.pory"
	.string "Badge 2$"

Route109_EventScript_WhichRewardMenu_Text_1:
# 634 "data/maps/Route109/scripts.pory"
	.string "{COLOR WHITE}{SHADOW LIGHT_GRAY}Badge 3{COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}$"

Route109_EventScript_WhichRewardMenu_Text_2:
# 637 "data/maps/Route109/scripts.pory"
	.string "Badge 3$"

Route109_EventScript_WhichRewardMenu_Text_3:
# 641 "data/maps/Route109/scripts.pory"
	.string "{COLOR WHITE}{SHADOW LIGHT_GRAY}Badge 4{COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}$"

Route109_EventScript_WhichRewardMenu_Text_4:
# 644 "data/maps/Route109/scripts.pory"
	.string "Badge 4$"

Route109_EventScript_WhichRewardMenu_Text_5:
# 648 "data/maps/Route109/scripts.pory"
	.string "{COLOR WHITE}{SHADOW LIGHT_GRAY}Badge 5{COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}$"

Route109_EventScript_WhichRewardMenu_Text_6:
# 651 "data/maps/Route109/scripts.pory"
	.string "Badge 5$"

Route109_EventScript_WhichRewardMenu_Text_7:
# 655 "data/maps/Route109/scripts.pory"
	.string "{COLOR WHITE}{SHADOW LIGHT_GRAY}Badge 6{COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}$"

Route109_EventScript_WhichRewardMenu_Text_8:
# 658 "data/maps/Route109/scripts.pory"
	.string "Badge 6$"

Route109_EventScript_WhichRewardMenu_Text_9:
# 662 "data/maps/Route109/scripts.pory"
	.string "{COLOR WHITE}{SHADOW LIGHT_GRAY}Badge 7{COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}$"

Route109_EventScript_WhichRewardMenu_Text_10:
# 665 "data/maps/Route109/scripts.pory"
	.string "Badge 7$"

Route109_EventScript_WhichRewardMenu_Text_11:
# 668 "data/maps/Route109/scripts.pory"
	.string "Cancel$"

Route109_EventScript_Badge2Options_Text_0:
# 725 "data/maps/Route109/scripts.pory"
	.string "Tyrogue$"

Route109_EventScript_Badge2Options_Text_1:
# 726 "data/maps/Route109/scripts.pory"
	.string "Pansage$"

Route109_EventScript_Badge2Options_Text_2:
# 727 "data/maps/Route109/scripts.pory"
	.string "Panpour$"

Route109_EventScript_Badge2Options_Text_3:
# 728 "data/maps/Route109/scripts.pory"
	.string "Pansear$"

Route109_EventScript_Badge2Options_Text_4:
# 729 "data/maps/Route109/scripts.pory"
	.string "Back$"

Route109_EventScript_Badge3Options_Text_0:
# 750 "data/maps/Route109/scripts.pory"
	.string "Misdreavus$"

Route109_EventScript_Badge3Options_Text_1:
# 751 "data/maps/Route109/scripts.pory"
	.string "Pinsir$"

Route109_EventScript_Badge3Options_Text_2:
# 752 "data/maps/Route109/scripts.pory"
	.string "Heracross$"

Route109_EventScript_Badge3Options_Text_3:
# 753 "data/maps/Route109/scripts.pory"
	.string "Scyther$"

Route109_EventScript_Badge4Options_Text_0:
# 775 "data/maps/Route109/scripts.pory"
	.string "Eevee$"

Route109_EventScript_Badge4Options_Text_1:
# 776 "data/maps/Route109/scripts.pory"
	.string "Magby$"

Route109_EventScript_Badge4Options_Text_2:
# 777 "data/maps/Route109/scripts.pory"
	.string "Elekid$"

Route109_EventScript_Badge4Options_Text_3:
# 778 "data/maps/Route109/scripts.pory"
	.string "Smoochum$"

Route109_EventScript_Badge5Options_Text_0:
# 800 "data/maps/Route109/scripts.pory"
	.string "Riolu$"

Route109_EventScript_Badge5Options_Text_1:
# 801 "data/maps/Route109/scripts.pory"
	.string "Togepi$"

Route109_EventScript_Badge6Options_Text_0:
# 823 "data/maps/Route109/scripts.pory"
	.string "Type: Null$"

Route109_EventScript_Badge7Options_Text_0:
# 845 "data/maps/Route109/scripts.pory"
	.string "Charcadet$"

Route109_EventScript_Badge7Options_Text_1:
# 846 "data/maps/Route109/scripts.pory"
	.string "Aerodactyl$"

Route109_Text_PapasSpotGettingFixed::
# 979 "data/maps/Route109/scripts.pory"
	.string "Yo, trainer!\p"
	.string "Sorry, my papa's spot is getting fixed\n"
	.string "up right now.\p"
	.string "Make sure you come back later to see\n"
	.string "the hottest spot in town, though!$"

Route109_Text_HotHouseFullIntro::
# 987 "data/maps/Route109/scripts.pory"
	.string "Yo, trainer!\n"
	.string "Looks like you've got the right stuff\l"
	.string "to enter the new Hot House!\p"
	.string "My papa totally revamped it, and we've\n"
	.string "got all sorts of great rewards now, but\l"
	.string "the trainers inside will be stronger if\l"
	.string "you try to go for better rewards!\p"
	.string "You can also come back and challenge\n"
	.string "the Hot House as many times as you'd\l"
	.string "like, {COLOR GREEN}{SHADOW LIGHT_GREEN}but be careful, because once you\l"
	.string "enter, you can't leave or access your\l"
	.string "portable PC!{COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}$"

Route109_Text_IntroQuestion::
# 1002 "data/maps/Route109/scripts.pory"
	.string "Which reward level do you want to\n"
	.string "compete for?$"

Route109_Text_BadgeRewardsQuestion::
# 1007 "data/maps/Route109/scripts.pory"
	.string "Which Badge {STR_VAR_1} reward Pokémon do you\n"
	.string "want to compete for?$"

Route109_Text_EnterCantLeave::
# 1012 "data/maps/Route109/scripts.pory"
	.string "You got it, trainer!\n"
	.string "Papa said I have to warn everyone again\l"
	.string "before they go inside:\p"
	.string "{COLOR GREEN}{SHADOW LIGHT_GREEN}Once you enter the Hot House, you can't\n"
	.string "leave or use your PC until you white out\l"
	.string "or beat all the trainers; {COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}is that okay?$"

Route109_Text_GoodLuckTrainer::
# 1021 "data/maps/Route109/scripts.pory"
	.string "That's what I'm talking about, yeah!\n"
	.string "You got this, trainer, good luck in\l"
	.string "there!$"

Route109_Text_HotHouseNo::
# 1028 "data/maps/Route109/scripts.pory"
	.string "No worries! The Hot House is open if you\n"
	.string "change your mind!$"

Route109_Text_SorryNotEnoughBadges::
# 1033 "data/maps/Route109/scripts.pory"
	.string "It looks like you don't have enough\n"
	.string "Badges to compete for that reward yet.\l"
	.string "Come back once you have more Badges!$"
