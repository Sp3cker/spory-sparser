# 1 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 2 "data/maps/Route110_TrickHouseEnd/scripts.pory"
.set LOCALID_TRICK_MASTER, 1
# 3 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 4 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_MapScripts::
# 5 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	map_script MAP_SCRIPT_ON_RESUME, Route110_TrickHouseEnd_OnResume
# 6 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, Route110_TrickHouseEnd_OnTransition
# 7 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	map_script MAP_SCRIPT_ON_FRAME_TABLE, Route110_TrickHouseEnd_OnFrame
# 8 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	map_script MAP_SCRIPT_ON_WARP_INTO_MAP_TABLE, Route110_TrickHouseEnd_OnWarp
# 9 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.byte 0
# 10 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 11 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_OnResume:
# 12 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_TEMP_1, 1, Route110_TrickHouseEnd_EventScript_SetDoorClosedMetatile
# 13 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 14 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 15 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_OnTransition:
# 16 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TEMP_1, 0
# 17 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TEMP_2, 0
# 18 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	special SetTrickHouseNuggetFlag
# 19 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 20 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 21 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_OnWarp:
# 22 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	map_script_2 VAR_TEMP_2, 0, Route110_TrickHouseEnd_EventScript_SetTrickMasterPos
# 23 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.2byte 0
# 24 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 25 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_SetTrickMasterPos::
# 26 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	addobject LOCALID_TRICK_MASTER
# 27 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	showobjectat LOCALID_TRICK_MASTER, MAP_ROUTE110_TRICK_HOUSE_END
# 28 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	turnobject LOCALID_TRICK_MASTER, DIR_EAST
# 29 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 30 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 31 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_OnFrame:
# 32 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	map_script_2 VAR_TEMP_1, 0, Route110_TrickHouseEnd_EventScript_CloseDoor
# 33 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.2byte 0
# 34 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 35 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CloseDoor::
# 36 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TEMP_1, 1
# 37 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_SetDoorClosedMetatile
# 38 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	special DrawWholeMapView
# 39 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 40 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 41 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_SetDoorClosedMetatile::
# 42 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setmetatile 10, 1, METATILE_GenericBuilding_TrickHouse_Door_Closed, TRUE
# 43 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 44 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 45 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_TrickMaster::
# 46 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	lock
# 47 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	faceplayer
# 48 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YouveMadeItToMe, MSGBOX_DEFAULT
# 49 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TEMP_2, 1
# 50 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	switch VAR_TRICK_HOUSE_LEVEL
# 51 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 0, Route110_TrickHouseEnd_EventScript_CompletedPuzzle1
# 52 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 1, Route110_TrickHouseEnd_EventScript_CompletedPuzzle2
# 53 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 2, Route110_TrickHouseEnd_EventScript_CompletedPuzzle3
# 54 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 3, Route110_TrickHouseEnd_EventScript_CompletedPuzzle4
# 55 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 4, Route110_TrickHouseEnd_EventScript_CompletedPuzzle5
# 56 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 5, Route110_TrickHouseEnd_EventScript_CompletedPuzzle6
# 57 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 6, Route110_TrickHouseEnd_EventScript_CompletedPuzzle7
# 58 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 7, Route110_TrickHouseEnd_EventScript_CompletedPuzzle8
# 59 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 60 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 61 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CompletedPuzzle1::
@explanation Solve puzzle in Trick House
# 62 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_AllNightToPlantTrees, MSGBOX_DEFAULT
# 63 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YouHaveEarnedThisReward, MSGBOX_DEFAULT
# 64 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 0
# 65 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_GUNK_SHOT
# 66 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_GARBODORITE
# 67 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TOXTRICITITE
# 68 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_MakeNewTricksToStumpYou, MSGBOX_DEFAULT
# 69 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 70 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_TrickMasterExit
# 71 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	release
# 72 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 73 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 74 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CompletedPuzzle2::
@explanation Solve puzzle 2 in Trick House
# 75 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_AllNightToMakeMaze, MSGBOX_DEFAULT
# 76 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YouHaveEarnedThisReward, MSGBOX_DEFAULT
# 77 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 0
# 78 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_SOLAR_BEAM
# 79 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_SOLAR_BLADE
# 80 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_GRASSY_GLIDE
# 81 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_GRASS_KNOT
# 82 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_POWER_WHIP
# 83 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_BUG_BUZZ
# 84 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_MEGAHORN
# 85 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_BUTTERFRITE
# 86 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_SNORLAXITE
# 87 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_ROSERADITE
# 88 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_MakeNewTricksToStumpYou, MSGBOX_DEFAULT
# 89 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 90 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_TrickMasterExit
# 91 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	release
# 92 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 93 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 94 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CompletedPuzzle3::
@explanation Solve puzzle 3 in Trick House
# 95 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_AllNightToPreparePanels, MSGBOX_DEFAULT
# 96 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YouHaveEarnedThisReward, MSGBOX_DEFAULT
# 97 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 0
# 98 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setflag FLAG_BEAT_TRICK_HOUSE_3
# 99 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_STONE_EDGE
# 100 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_STEELIXITE
# 101 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_KINGLERITE
# 102 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_BOOSTER_ENERGY
# 103 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	addvar VAR_PETALBURG_GYM_STATE, 1
# 104 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_PETALBURG_GYM_STATE, 7, Common_EventScript_ReadyPetalburgGymForBattle
# 105 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_MakeNewTricksToStumpYou, MSGBOX_DEFAULT
# 106 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 107 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_TrickMasterExit
# 108 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	delay 30
# 109 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	playfanfare MUS_LEVEL_UP
# 110 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	specialvar VAR_0x8006, GetLevelCapForText
# 111 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	buffernumberstring STR_VAR_3, VAR_0x8006
# 112 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox LevelCapIncreasedTo, MSGBOX_DEFAULT
# 113 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitfanfare
# 114 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 115 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	delay 30
# 116 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	release
# 117 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 118 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 119 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CompletedPuzzle4::
@explanation Solve puzzle 4 in Trick House
# 120 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_AllNightToShoveBoulders, MSGBOX_DEFAULT
# 121 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YouHaveEarnedThisReward, MSGBOX_DEFAULT
# 122 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 0
# 123 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_SMOKE_BALL
# 124 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_RESULT, FALSE, Route110_TrickHouseEnd_EventScript_BagFull
# 125 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_MakeNewTricksToStumpYou, MSGBOX_DEFAULT
# 126 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 127 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_TrickMasterExit
# 128 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	release
# 129 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 130 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 131 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CompletedPuzzle5::
@explanation Complete puzzle 6 in Trick House
# 132 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_AllNightToMakeMechadolls, MSGBOX_DEFAULT
# 133 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YouHaveEarnedThisReward, MSGBOX_DEFAULT
# 134 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 0
# 135 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_TM_TAUNT
# 136 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_RESULT, FALSE, Route110_TrickHouseEnd_EventScript_BagFull
# 137 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_MakeNewTricksToStumpYou, MSGBOX_DEFAULT
# 138 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 139 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_TrickMasterExit
# 140 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	release
# 141 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 142 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 143 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CompletedPuzzle6::
@explanation Complete puzzle 6 in Trick House
# 144 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_AllNightToInstallDoors, MSGBOX_DEFAULT
# 145 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YouHaveEarnedThisReward, MSGBOX_DEFAULT
# 146 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 0
# 147 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_MAGNET
# 148 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_RESULT, FALSE, Route110_TrickHouseEnd_EventScript_BagFull
# 149 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_MakeNewTricksToStumpYou, MSGBOX_DEFAULT
# 150 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 151 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_TrickMasterExit
# 152 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	release
# 153 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 154 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 155 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CompletedPuzzle7::
@explanation Defeat Trick House
# 156 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_AllNightSettingUpArrows, MSGBOX_DEFAULT
# 157 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YouHaveEarnedThisReward, MSGBOX_DEFAULT
# 158 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 0
# 159 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	giveitem ITEM_PP_MAX
# 160 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_RESULT, FALSE, Route110_TrickHouseEnd_EventScript_BagFull
# 161 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_MakeNewTricksToStumpYou, MSGBOX_DEFAULT
# 162 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 163 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_TrickMasterExit
# 164 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	release
# 165 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 166 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 167 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_CompletedPuzzle8::
# 168 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_AllNightPolishingFloors, MSGBOX_DEFAULT
# 169 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 170 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_FACING, DIR_SOUTH, Route110_TrickHouseEnd_EventScript_TrickMasterFaceAwaySouth
# 171 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_FACING, DIR_NORTH, Route110_TrickHouseEnd_EventScript_TrickMasterFaceAwayNorth
# 172 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_FACING, DIR_WEST, Route110_TrickHouseEnd_EventScript_TrickMasterFaceAwayWest
# 173 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_FACING, DIR_EAST, Route110_TrickHouseEnd_EventScript_TrickMasterFaceAwayEast
# 174 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	delay 30
# 175 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_FountainOfIdeasRunDry, MSGBOX_DEFAULT
# 176 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 177 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Common_Movement_FacePlayer
# 178 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 179 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	delay 30
# 180 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_DefeatedMePreferWhichTent, MSGBOX_DEFAULT
# 181 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 0
# 182 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_ChooseTent
# 183 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call_if_eq VAR_RESULT, FALSE, Route110_TrickHouseEnd_EventScript_NoRoomForTent
# 184 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_LeavingOnJourney, MSGBOX_DEFAULT
# 185 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Route110_TrickHouseEnd_EventScript_TrickMasterExit
# 186 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	special ResetTrickHouseNuggetFlag
# 187 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	release
# 188 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 189 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 190 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_ChooseTent::
# 191 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	multichoice 0, 0, MULTI_TENT, TRUE
# 192 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	switch VAR_RESULT
# 193 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	case 0, Route110_TrickHouseEnd_EventScript_GiveRedTent
# 194 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	goto Route110_TrickHouseEnd_EventScript_GiveBlueTent
# 195 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 196 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_GiveRedTent::
# 197 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	givedecoration DECOR_RED_TENT
# 198 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 199 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 200 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_GiveBlueTent::
# 201 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	givedecoration DECOR_BLUE_TENT
# 202 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 203 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 204 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_TrickMasterExit::
# 205 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Route110_TrickHouse_Movement_TrickMasterSpin
# 206 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 207 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	playse SE_M_EXPLOSION
# 208 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Route110_TrickHouse_Movement_TrickMasterJumpAway
# 209 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 210 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	removeobject LOCALID_TRICK_MASTER
# 211 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	addvar VAR_TRICK_HOUSE_LEVEL, 1
# 212 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 213 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 214 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_BagFull::
# 215 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Common_EventScript_BagIsFull
# 216 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_NoRoomForThis, MSGBOX_DEFAULT
# 217 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 1
# 218 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 219 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 220 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_NoRoomForTent::
# 221 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	call Common_EventScript_NoRoomForDecor
# 222 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_NoRoomInPC, MSGBOX_DEFAULT
# 223 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	setvar VAR_TRICK_HOUSE_PRIZE_PICKUP, 1
# 224 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 225 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 226 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_TrickMasterFaceAwaySouth::
# 227 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Common_Movement_WalkInPlaceFasterDown
# 228 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 229 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 230 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 231 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_TrickMasterFaceAwayNorth::
# 232 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Common_Movement_WalkInPlaceFasterUp
# 233 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 234 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 235 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 236 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_TrickMasterFaceAwayWest::
# 237 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Common_Movement_WalkInPlaceFasterLeft
# 238 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 239 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 240 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 241 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_TrickMasterFaceAwayEast::
# 242 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Common_Movement_WalkInPlaceFasterRight
# 243 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 244 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	return
# 245 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 246 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_EventScript_TrickMasterExitTrigger::
# 247 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	lockall
# 248 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	turnobject LOCALID_TRICK_MASTER, DIR_WEST
# 249 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	playse SE_PIN
# 250 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Common_Movement_ExclamationMark
# 251 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 252 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	delay 20
# 253 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement LOCALID_TRICK_MASTER, Route110_TrickHouseEnd_Movement_TrickMasterSurprise
# 254 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 255 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	playse SE_M_EXPLOSION
# 256 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_WalkInPlaceFasterDown
# 257 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 258 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	msgbox Route110_TrickHouseEnd_Text_YoureIgnoringMe, MSGBOX_DEFAULT
# 259 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	closemessage
# 260 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Route110_TrickHouseEnd_Movement_KeepPlayerInRoom
# 261 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	waitmovement 0
# 262 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	delay 4
# 263 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	turnobject LOCALID_TRICK_MASTER, DIR_EAST
# 264 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	releaseall
# 265 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	end
# 266 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 267 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Movement_KeepPlayerInRoom:
# 268 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	walk_down
# 269 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	step_end
# 270 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 271 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Movement_TrickMasterSurprise:
# 272 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	jump_in_place_left
# 273 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	step_end
# 274 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 275 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_YouveMadeItToMe:
# 276 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Aak!\n"
# 277 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You've made it to me?\l"
# 278 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Hmmm… You're sharp!$"
# 279 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 280 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_AllNightToPlantTrees:
# 281 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It took me all night to plant all those\n"
# 282 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "trees…\p"
# 283 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You're almost my equal in greatness by\n"
# 284 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "one, two, three, four, five, six places!$"
# 285 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 286 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_AllNightToMakeMaze:
# 287 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It took me all night to make the maze…\p"
# 288 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You're almost my equal in greatness by\n"
# 289 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "one, two, three, four, five places!$"
# 290 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 291 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_AllNightToPreparePanels:
# 292 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It took me all night to prepare\n"
# 293 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "the wall panels…\p"
# 294 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You're almost my equal in greatness by\n"
# 295 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "one, two, three, four places!$"
# 296 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 297 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_AllNightToShoveBoulders:
# 298 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It took me all night to shove in those\n"
# 299 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "boulders…\p"
# 300 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You're almost my equal in greatness by\n"
# 301 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "one, two, three places!$"
# 302 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 303 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_AllNightToMakeMechadolls:
# 304 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It took me all night to make MECHADOLLS\n"
# 305 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "and another to think up the quiz…\p"
# 306 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You're almost my equal in greatness by\n"
# 307 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "one, two places!$"
# 308 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 309 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_AllNightToInstallDoors:
# 310 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It took me all night to install\n"
# 311 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "the doors…\p"
# 312 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You're almost my equal in greatness!$"
# 313 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 314 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_AllNightSettingUpArrows:
# 315 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It took me all night setting up arrows…\p"
# 316 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You're my equal in greatness!$"
# 317 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 318 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_AllNightPolishingFloors:
# 319 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It took me all night polishing floors…\p"
# 320 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You're above me in greatness!\n"
# 321 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Possibly…$"
# 322 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 323 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_FountainOfIdeasRunDry:
# 324 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Wh-what should I do?\n"
# 325 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "My fountain of ideas for tricks has\l"
# 326 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "run dry…\p"
# 327 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Perhaps it is time I toured the country\n"
# 328 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "on a quest to devise new tricks…$"
# 329 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 330 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_DefeatedMePreferWhichTent:
# 331 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "I hate to admit defeat, but you have\n"
# 332 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "bested me!\p"
# 333 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Still, you must have been reeled in by\n"
# 334 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "my charisma for you to visit me again\l"
# 335 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "and again. Yes, you must have!\p"
# 336 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "But that has nothing to do with my\n"
# 337 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "losing!\p"
# 338 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "In recognition of the friendship\n"
# 339 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "between you, the driven, and the genius\l"
# 340 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "that is myself, I demand that you take\l"
# 341 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "this keepsake!\p"
# 342 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Actually there are two--\n"
# 343 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "a RED TENT and a BLUE TENT.\l"
# 344 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Which do you prefer?$"
# 345 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 346 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_NoRoomInPC:
# 347 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "What? No room in your PC?\n"
# 348 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "What am I to make of that?\p"
# 349 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "I wish I could say that, but I am much\n"
# 350 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "too kind and caring, so come back later!$"
# 351 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 352 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_LeavingOnJourney:
# 353 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "… … … … … …\p"
# 354 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "I am leaving on a journey of discovery.\n"
# 355 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "A quest in search of new tricks.\p"
# 356 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "I wish that you will one day visit and\n"
# 357 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "entertain me again.\p"
# 358 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "And now, farewell!$"
# 359 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 360 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_YouHaveEarnedThisReward:
# 361 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Fine!\n"
# 362 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You have earned this reward!$"
# 363 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 364 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_NoRoomForThis:
# 365 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "What? Have you no room for this?\n"
# 366 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "What manner of items do you carry?\p"
# 367 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "But fine, since you've reached me,\n"
# 368 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "your reward will be with me till later.$"
# 369 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 370 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_MakeNewTricksToStumpYou:
# 371 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Scrub that smug smirk from your face!\n"
# 372 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "It's much too early to think you've won!\p"
# 373 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "I'll make new tricks to stump you, I will.\n"
# 374 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "You may mock me only when you're done.\p"
# 375 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Come back for the next exciting\n"
# 376 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "installment!$"
# 377 "data/maps/Route110_TrickHouseEnd/scripts.pory"

# 378 "data/maps/Route110_TrickHouseEnd/scripts.pory"
Route110_TrickHouseEnd_Text_YoureIgnoringMe:
# 379 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Now, now! You're ignoring me now?\n"
# 380 "data/maps/Route110_TrickHouseEnd/scripts.pory"
	.string "Now that, I consider heartbreaking!$"
