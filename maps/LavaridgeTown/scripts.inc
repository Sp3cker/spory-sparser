# 1 "data/maps/LavaridgeTown/scripts.pory"

# 2 "data/maps/LavaridgeTown/scripts.pory"
.set LOCALID_RIVAL_ON_BIKE, 7
# 3 "data/maps/LavaridgeTown/scripts.pory"
.set LOCALID_RIVAL, 8
# 4 "data/maps/LavaridgeTown/scripts.pory"

# 5 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_MapScripts::
# 6 "data/maps/LavaridgeTown/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, LavaridgeTown_OnTransition
# 7 "data/maps/LavaridgeTown/scripts.pory"
	map_script MAP_SCRIPT_ON_FRAME_TABLE, LavaridgeTown_OnFrame
# 8 "data/maps/LavaridgeTown/scripts.pory"
	.byte 0
# 9 "data/maps/LavaridgeTown/scripts.pory"

# 10 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_OnTransition:
# 11 "data/maps/LavaridgeTown/scripts.pory"
	setflag FLAG_VISITED_LAVARIDGE_TOWN
# 12 "data/maps/LavaridgeTown/scripts.pory"
	call_if_set FLAG_WHITEOUT_TO_LAVARIDGE, LavaridgeTown_EventScript_ClearLavaridgeWhiteOut
# 13 "data/maps/LavaridgeTown/scripts.pory"
	call_if_set FLAG_DEFEATED_EVIL_TEAM_MT_CHIMNEY, LavaridgeTown_EventScript_ShowMtChimneyTrainers
# 14 "data/maps/LavaridgeTown/scripts.pory"
	call Common_EventScript_SetupRivalGfxId
# 15 "data/maps/LavaridgeTown/scripts.pory"
	call Common_EventScript_SetupRivalOnBikeGfxId
# 16 "data/maps/LavaridgeTown/scripts.pory"
	call_if_eq VAR_LAVARIDGE_TOWN_STATE, 1, LavaridgeTown_EventScript_CheckSetRivalPos
# 17 "data/maps/LavaridgeTown/scripts.pory"
	call_if_eq VAR_LAVARIDGE_TOWN_STATE, 1, LavaridgeTown_EventScript_HideMapNamePopup
# 18 "data/maps/LavaridgeTown/scripts.pory"
	end
# 19 "data/maps/LavaridgeTown/scripts.pory"

# 20 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_ClearLavaridgeWhiteOut::
# 21 "data/maps/LavaridgeTown/scripts.pory"
	clearflag FLAG_WHITEOUT_TO_LAVARIDGE
# 22 "data/maps/LavaridgeTown/scripts.pory"
	return
# 23 "data/maps/LavaridgeTown/scripts.pory"

# 24 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_CheckSetRivalPos::
# 25 "data/maps/LavaridgeTown/scripts.pory"
	getplayerxy VAR_0x8004, VAR_0x8005
# 26 "data/maps/LavaridgeTown/scripts.pory"
	goto_if_eq VAR_0x8004, 9, LavaridgeTown_EventScript_SetRivalPos
# 27 "data/maps/LavaridgeTown/scripts.pory"
	return
# 28 "data/maps/LavaridgeTown/scripts.pory"

# 29 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_SetRivalPos::
# 30 "data/maps/LavaridgeTown/scripts.pory"
	setobjectxyperm LOCALID_RIVAL, 11, 9
# 31 "data/maps/LavaridgeTown/scripts.pory"
	setobjectxyperm LOCALID_RIVAL_ON_BIKE, 9, 8
# 32 "data/maps/LavaridgeTown/scripts.pory"
	setobjectmovementtype LOCALID_RIVAL_ON_BIKE, MOVEMENT_TYPE_FACE_UP
# 33 "data/maps/LavaridgeTown/scripts.pory"
	clearflag FLAG_HIDE_LAVARIDGE_TOWN_RIVAL
# 34 "data/maps/LavaridgeTown/scripts.pory"
	return
# 35 "data/maps/LavaridgeTown/scripts.pory"

# 36 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_ShowMtChimneyTrainers::
# 37 "data/maps/LavaridgeTown/scripts.pory"
	clearflag FLAG_HIDE_MT_CHIMNEY_TRAINERS
# 38 "data/maps/LavaridgeTown/scripts.pory"
	return
# 39 "data/maps/LavaridgeTown/scripts.pory"

# 40 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_HideMapNamePopup::
# 41 "data/maps/LavaridgeTown/scripts.pory"
	setflag FLAG_HIDE_MAP_NAME_POPUP
# 42 "data/maps/LavaridgeTown/scripts.pory"
	return
# 43 "data/maps/LavaridgeTown/scripts.pory"

# 44 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_OnFrame:
# 45 "data/maps/LavaridgeTown/scripts.pory"
	map_script_2 VAR_LAVARIDGE_TOWN_STATE, 1, LavaridgeTown_EventScript_RivalGiveGoGoggles
# 46 "data/maps/LavaridgeTown/scripts.pory"
	.2byte 0
# 47 "data/maps/LavaridgeTown/scripts.pory"

# 48 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_RivalGiveGoGoggles::
# 49 "data/maps/LavaridgeTown/scripts.pory"
	lockall
# 50 "data/maps/LavaridgeTown/scripts.pory"
	getplayerxy VAR_0x8008, VAR_0x8009
# 51 "data/maps/LavaridgeTown/scripts.pory"
	call_if_eq VAR_0x8008, 9, LavaridgeTown_EventScript_RivalNoticePlayer
# 52 "data/maps/LavaridgeTown/scripts.pory"
	call_if_ne VAR_0x8008, 9, LavaridgeTown_EventScript_RivalExitHerbShop
# 53 "data/maps/LavaridgeTown/scripts.pory"
	delay 20
# 54 "data/maps/LavaridgeTown/scripts.pory"
	checkplayergender
# 55 "data/maps/LavaridgeTown/scripts.pory"
	call_if_eq VAR_RESULT, MALE, LavaridgeTown_EventScript_PlayMayMusic
# 56 "data/maps/LavaridgeTown/scripts.pory"
	call_if_eq VAR_RESULT, FEMALE, LavaridgeTown_EventScript_PlayBrendanMusic
# 57 "data/maps/LavaridgeTown/scripts.pory"
	call_if_eq VAR_0x8008, 9, LavaridgeTown_EventScript_RivalApproachPlayer1
# 58 "data/maps/LavaridgeTown/scripts.pory"
	call_if_ne VAR_0x8008, 9, LavaridgeTown_EventScript_RivalApproachPlayer2
# 59 "data/maps/LavaridgeTown/scripts.pory"
	checkplayergender
# 60 "data/maps/LavaridgeTown/scripts.pory"
	goto_if_eq VAR_RESULT, MALE, LavaridgeTown_EventScript_MayGiveGoGoggles
# 61 "data/maps/LavaridgeTown/scripts.pory"
	goto_if_eq VAR_RESULT, FEMALE, LavaridgeTown_EventScript_BrendanGiveGoGoggles
# 62 "data/maps/LavaridgeTown/scripts.pory"
	end
# 63 "data/maps/LavaridgeTown/scripts.pory"

# 64 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_MayGiveGoGoggles::
@explanation Gift from Rival
# 65 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_MayNiceBadgesTakeThis, MSGBOX_DEFAULT
# 66 "data/maps/LavaridgeTown/scripts.pory"
	giveitem ITEM_MEGA_RING
# 67 "data/maps/LavaridgeTown/scripts.pory"
	giveitem ITEM_GO_GOGGLES
# 68 "data/maps/LavaridgeTown/scripts.pory"
	giveitem ITEM_SAFETY_GOGGLES
# 69 "data/maps/LavaridgeTown/scripts.pory"
	setflag FLAG_RECEIVED_GO_GOGGLES
# 70 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_MayExplainGoGogglesChallengeDad, MSGBOX_DEFAULT
# 71 "data/maps/LavaridgeTown/scripts.pory"
	goto LavaridgeTown_EventScript_RivalExit
# 72 "data/maps/LavaridgeTown/scripts.pory"
	end
# 73 "data/maps/LavaridgeTown/scripts.pory"

# 74 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_BrendanGiveGoGoggles::
@explanation Gift from Rival
# 75 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_BrendanNiceBadgesTakeThis, MSGBOX_DEFAULT
# 76 "data/maps/LavaridgeTown/scripts.pory"
	giveitem ITEM_MEGA_RING
# 77 "data/maps/LavaridgeTown/scripts.pory"
	giveitem ITEM_GO_GOGGLES
# 78 "data/maps/LavaridgeTown/scripts.pory"
	giveitem ITEM_SAFETY_GOGGLES
# 79 "data/maps/LavaridgeTown/scripts.pory"
	setflag FLAG_RECEIVED_GO_GOGGLES
# 80 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_BrendanExplainGoGogglesChallengeDad, MSGBOX_DEFAULT
# 81 "data/maps/LavaridgeTown/scripts.pory"
	goto LavaridgeTown_EventScript_RivalExit
# 82 "data/maps/LavaridgeTown/scripts.pory"
	end
# 83 "data/maps/LavaridgeTown/scripts.pory"

# 84 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_RivalExit::
# 85 "data/maps/LavaridgeTown/scripts.pory"
	closemessage
# 86 "data/maps/LavaridgeTown/scripts.pory"
	removeobject LOCALID_RIVAL
# 87 "data/maps/LavaridgeTown/scripts.pory"
	addobject LOCALID_RIVAL_ON_BIKE
# 88 "data/maps/LavaridgeTown/scripts.pory"
	delay 30
# 89 "data/maps/LavaridgeTown/scripts.pory"
	call_if_eq VAR_0x8008, 9, LavaridgeTown_EventScript_RivalExit1
# 90 "data/maps/LavaridgeTown/scripts.pory"
	call_if_ne VAR_0x8008, 9, LavaridgeTown_EventScript_RivalExit2
# 91 "data/maps/LavaridgeTown/scripts.pory"
	removeobject LOCALID_RIVAL_ON_BIKE
# 92 "data/maps/LavaridgeTown/scripts.pory"
	setvar VAR_LAVARIDGE_TOWN_STATE, 2
# 93 "data/maps/LavaridgeTown/scripts.pory"
	clearflag FLAG_HIDE_MAP_NAME_POPUP
# 94 "data/maps/LavaridgeTown/scripts.pory"
	savebgm MUS_DUMMY
# 95 "data/maps/LavaridgeTown/scripts.pory"
	fadedefaultbgm
# 96 "data/maps/LavaridgeTown/scripts.pory"
	releaseall
# 97 "data/maps/LavaridgeTown/scripts.pory"
	end
# 98 "data/maps/LavaridgeTown/scripts.pory"

# 99 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_PlayMayMusic::
# 100 "data/maps/LavaridgeTown/scripts.pory"
	playbgm MUS_ENCOUNTER_MAY, TRUE
# 101 "data/maps/LavaridgeTown/scripts.pory"
	return
# 102 "data/maps/LavaridgeTown/scripts.pory"

# 103 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_PlayBrendanMusic::
# 104 "data/maps/LavaridgeTown/scripts.pory"
	playbgm MUS_ENCOUNTER_BRENDAN, TRUE
# 105 "data/maps/LavaridgeTown/scripts.pory"
	return
# 106 "data/maps/LavaridgeTown/scripts.pory"

# 107 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_RivalNoticePlayer::
# 108 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, Common_Movement_WalkInPlaceFasterUp
# 109 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 110 "data/maps/LavaridgeTown/scripts.pory"
	playse SE_PIN
# 111 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, Common_Movement_ExclamationMark
# 112 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 113 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, Common_Movement_Delay48
# 114 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 115 "data/maps/LavaridgeTown/scripts.pory"
	return
# 116 "data/maps/LavaridgeTown/scripts.pory"

# 117 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_RivalExitHerbShop::
# 118 "data/maps/LavaridgeTown/scripts.pory"
	opendoor 12, 15
# 119 "data/maps/LavaridgeTown/scripts.pory"
	waitdooranim
# 120 "data/maps/LavaridgeTown/scripts.pory"
	addobject LOCALID_RIVAL
# 121 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, LavaridgeTown_Movement_RivalExitHerbShop
# 122 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 123 "data/maps/LavaridgeTown/scripts.pory"
	closedoor 12, 15
# 124 "data/maps/LavaridgeTown/scripts.pory"
	waitdooranim
# 125 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, Common_Movement_WalkInPlaceFasterLeft
# 126 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 127 "data/maps/LavaridgeTown/scripts.pory"
	playse SE_PIN
# 128 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, Common_Movement_ExclamationMark
# 129 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 130 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, Common_Movement_Delay48
# 131 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 132 "data/maps/LavaridgeTown/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_WalkInPlaceFasterRight
# 133 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 134 "data/maps/LavaridgeTown/scripts.pory"
	return
# 135 "data/maps/LavaridgeTown/scripts.pory"

# 136 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_RivalApproachPlayer1::
# 137 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, LavaridgeTown_Movement_RivalApproachPlayer1
# 138 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 139 "data/maps/LavaridgeTown/scripts.pory"
	return
# 140 "data/maps/LavaridgeTown/scripts.pory"

# 141 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_RivalApproachPlayer2::
# 142 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL, LavaridgeTown_Movement_RivalApproachPlayer2
# 143 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 144 "data/maps/LavaridgeTown/scripts.pory"
	return
# 145 "data/maps/LavaridgeTown/scripts.pory"

# 146 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_RivalExit1::
# 147 "data/maps/LavaridgeTown/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, LavaridgeTown_Movement_PlayerWatchRivalExit
# 148 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL_ON_BIKE, LavaridgeTown_Movement_RivalExit1
# 149 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 150 "data/maps/LavaridgeTown/scripts.pory"
	return
# 151 "data/maps/LavaridgeTown/scripts.pory"

# 152 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_RivalExit2::
# 153 "data/maps/LavaridgeTown/scripts.pory"
	applymovement LOCALID_RIVAL_ON_BIKE, LavaridgeTown_Movement_RivalExit2
# 154 "data/maps/LavaridgeTown/scripts.pory"
	waitmovement 0
# 155 "data/maps/LavaridgeTown/scripts.pory"
	return
# 156 "data/maps/LavaridgeTown/scripts.pory"

# 157 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Movement_RivalExit2:
# 158 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 159 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 160 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 161 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_up
# 162 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_up
# 163 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_up
# 164 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_up
# 165 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_up
# 166 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_up
# 167 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_up
# 168 "data/maps/LavaridgeTown/scripts.pory"
	step_end
# 169 "data/maps/LavaridgeTown/scripts.pory"

# 170 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Movement_PlayerWatchRivalExit:
# 171 "data/maps/LavaridgeTown/scripts.pory"
	delay_16
# 172 "data/maps/LavaridgeTown/scripts.pory"
	delay_8
# 173 "data/maps/LavaridgeTown/scripts.pory"
	walk_in_place_faster_right
# 174 "data/maps/LavaridgeTown/scripts.pory"
	step_end
# 175 "data/maps/LavaridgeTown/scripts.pory"

# 176 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Movement_RivalExit1:
# 177 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_down
# 178 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 179 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 180 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 181 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 182 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 183 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 184 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 185 "data/maps/LavaridgeTown/scripts.pory"
	walk_fast_right
# 186 "data/maps/LavaridgeTown/scripts.pory"
	step_end
# 187 "data/maps/LavaridgeTown/scripts.pory"

# 188 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Movement_RivalApproachPlayer2:
# 189 "data/maps/LavaridgeTown/scripts.pory"
	walk_left
# 190 "data/maps/LavaridgeTown/scripts.pory"
	walk_left
# 191 "data/maps/LavaridgeTown/scripts.pory"
	walk_left
# 192 "data/maps/LavaridgeTown/scripts.pory"
	walk_left
# 193 "data/maps/LavaridgeTown/scripts.pory"
	walk_left
# 194 "data/maps/LavaridgeTown/scripts.pory"
	walk_left
# 195 "data/maps/LavaridgeTown/scripts.pory"
	step_end
# 196 "data/maps/LavaridgeTown/scripts.pory"

# 197 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Movement_RivalApproachPlayer1:
# 198 "data/maps/LavaridgeTown/scripts.pory"
	walk_left
# 199 "data/maps/LavaridgeTown/scripts.pory"
	walk_left
# 200 "data/maps/LavaridgeTown/scripts.pory"
	walk_up
# 201 "data/maps/LavaridgeTown/scripts.pory"
	step_end
# 202 "data/maps/LavaridgeTown/scripts.pory"

# 203 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Movement_RivalExitHerbShop:
# 204 "data/maps/LavaridgeTown/scripts.pory"
	walk_down
# 205 "data/maps/LavaridgeTown/scripts.pory"
	step_end
# 206 "data/maps/LavaridgeTown/scripts.pory"

# 207 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_HotSpringsTrigger::
# 208 "data/maps/LavaridgeTown/scripts.pory"
	specialvar VAR_RESULT, GetPlayerFacingDirection
# 209 "data/maps/LavaridgeTown/scripts.pory"
	goto_if_eq VAR_RESULT, DIR_SOUTH, LavaridgeTown_EventScript_EnteredHotSprings
# 210 "data/maps/LavaridgeTown/scripts.pory"
	end
# 211 "data/maps/LavaridgeTown/scripts.pory"

# 212 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_EnteredHotSprings::
# 213 "data/maps/LavaridgeTown/scripts.pory"
	incrementgamestat GAME_STAT_ENTERED_HOT_SPRINGS
# 214 "data/maps/LavaridgeTown/scripts.pory"
	end
# 215 "data/maps/LavaridgeTown/scripts.pory"

# 216 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_ExpertM::
# 217 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_HotSpringsNeverRunDry, MSGBOX_NPC
# 218 "data/maps/LavaridgeTown/scripts.pory"
	end
# 219 "data/maps/LavaridgeTown/scripts.pory"

# 220 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_OldMan::
# 221 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_PokemonNippedBackside, MSGBOX_SIGN
# 222 "data/maps/LavaridgeTown/scripts.pory"
	end
# 223 "data/maps/LavaridgeTown/scripts.pory"

# 224 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_Twin::
# 225 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_BatheInHotSpringsEveryDay, MSGBOX_NPC
# 226 "data/maps/LavaridgeTown/scripts.pory"
	end
# 227 "data/maps/LavaridgeTown/scripts.pory"

# 228 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_HotSpringsOldWoman1::
# 229 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_IfPokemonInHotSprings, MSGBOX_NPC
# 230 "data/maps/LavaridgeTown/scripts.pory"
	end
# 231 "data/maps/LavaridgeTown/scripts.pory"

# 232 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_HotSpringsOldWoman2::
# 233 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_HotSpringsClaims, MSGBOX_NPC
# 234 "data/maps/LavaridgeTown/scripts.pory"
	end
# 235 "data/maps/LavaridgeTown/scripts.pory"

# 236 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_ExpertF::
# 237 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_OhYouLikeHotSprings, MSGBOX_NPC
# 238 "data/maps/LavaridgeTown/scripts.pory"
	end
# 239 "data/maps/LavaridgeTown/scripts.pory"

# 240 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_Sandygast::
# 241 "data/maps/LavaridgeTown/scripts.pory"
	lock
# 242 "data/maps/LavaridgeTown/scripts.pory"
	faceplayer
# 243 "data/maps/LavaridgeTown/scripts.pory"
	waitse
# 244 "data/maps/LavaridgeTown/scripts.pory"
	playmoncry SPECIES_SANDYGAST, CRY_MODE_NORMAL
# 245 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_Sandygast, MSGBOX_DEFAULT
# 246 "data/maps/LavaridgeTown/scripts.pory"
	waitmoncry
# 247 "data/maps/LavaridgeTown/scripts.pory"
	release
# 248 "data/maps/LavaridgeTown/scripts.pory"
	end
# 249 "data/maps/LavaridgeTown/scripts.pory"

# 250 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_EggWoman::
# 251 "data/maps/LavaridgeTown/scripts.pory"
	lock
# 252 "data/maps/LavaridgeTown/scripts.pory"
	faceplayer
# 253 "data/maps/LavaridgeTown/scripts.pory"
	goto_if_set FLAG_RECEIVED_LAVARIDGE_EGG, LavaridgeTown_EventScript_ReceivedEgg
# 254 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_HaveEggWillYouTakeIt, MSGBOX_YESNO
# 255 "data/maps/LavaridgeTown/scripts.pory"
	goto_if_eq VAR_RESULT, NO, LavaridgeTown_EventScript_DeclineEgg
# 256 "data/maps/LavaridgeTown/scripts.pory"
	getpartysize
# 257 "data/maps/LavaridgeTown/scripts.pory"
	goto_if_eq VAR_RESULT, PARTY_SIZE, LavaridgeTown_EventScript_NoRoomForEgg
# 258 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_HopeYoullWalkPlentyWithEgg, MSGBOX_DEFAULT
# 259 "data/maps/LavaridgeTown/scripts.pory"
	setflag FLAG_RECEIVED_LAVARIDGE_EGG
# 260 "data/maps/LavaridgeTown/scripts.pory"
	playfanfare MUS_OBTAIN_ITEM
# 261 "data/maps/LavaridgeTown/scripts.pory"
	message LavaridgeTown_Text_ReceivedTheEgg
# 262 "data/maps/LavaridgeTown/scripts.pory"
	waitfanfare
# 263 "data/maps/LavaridgeTown/scripts.pory"
@explanation Talk to the lady by the Hot Springs
	giveegg SPECIES_EEVEE
# 264 "data/maps/LavaridgeTown/scripts.pory"
	release
# 265 "data/maps/LavaridgeTown/scripts.pory"
	end
# 266 "data/maps/LavaridgeTown/scripts.pory"

# 267 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_ReceivedEgg::
# 268 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_EverySoOftenEggFoundAtDayCare, MSGBOX_DEFAULT
# 269 "data/maps/LavaridgeTown/scripts.pory"
	release
# 270 "data/maps/LavaridgeTown/scripts.pory"
	end
# 271 "data/maps/LavaridgeTown/scripts.pory"

# 272 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_NoRoomForEgg::
# 273 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_NoRoomForThisEgg, MSGBOX_DEFAULT
# 274 "data/maps/LavaridgeTown/scripts.pory"
	release
# 275 "data/maps/LavaridgeTown/scripts.pory"
	end
# 276 "data/maps/LavaridgeTown/scripts.pory"

# 277 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_DeclineEgg::
# 278 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_AsYouWishThen, MSGBOX_DEFAULT
# 279 "data/maps/LavaridgeTown/scripts.pory"
	release
# 280 "data/maps/LavaridgeTown/scripts.pory"
	end
# 281 "data/maps/LavaridgeTown/scripts.pory"

# 282 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_TownSign::
# 283 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_TownSign, MSGBOX_SIGN
# 284 "data/maps/LavaridgeTown/scripts.pory"
	end
# 285 "data/maps/LavaridgeTown/scripts.pory"

# 286 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_GymSign::
# 287 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_GymSign, MSGBOX_SIGN
# 288 "data/maps/LavaridgeTown/scripts.pory"
	end
# 289 "data/maps/LavaridgeTown/scripts.pory"

# 290 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_EventScript_HerbShopSign::
# 291 "data/maps/LavaridgeTown/scripts.pory"
	msgbox LavaridgeTown_Text_HerbShopSign, MSGBOX_SIGN
# 292 "data/maps/LavaridgeTown/scripts.pory"
	end
# 293 "data/maps/LavaridgeTown/scripts.pory"

# 294 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_MiniMarket_EventScript_Saleswoman::
# 295 "data/maps/LavaridgeTown/scripts.pory"
	lock
# 296 "data/maps/LavaridgeTown/scripts.pory"
	faceplayer
# 297 "data/maps/LavaridgeTown/scripts.pory"
	message gText_HowMayIServeYou
# 298 "data/maps/LavaridgeTown/scripts.pory"
	waitmessage
# 299 "data/maps/LavaridgeTown/scripts.pory"
	tmshop LavaridgeTown_MiniMart
# 300 "data/maps/LavaridgeTown/scripts.pory"
	msgbox gText_PleaseComeAgain, MSGBOX_DEFAULT
# 301 "data/maps/LavaridgeTown/scripts.pory"
	release
# 302 "data/maps/LavaridgeTown/scripts.pory"
	end
# 303 "data/maps/LavaridgeTown/scripts.pory"

# 304 "data/maps/LavaridgeTown/scripts.pory"
	.align 2
# 305 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_MiniMart:
# 306 "data/maps/LavaridgeTown/scripts.pory"
	.2byte ITEM_TM_ICE_BEAM
# 307 "data/maps/LavaridgeTown/scripts.pory"
	.2byte ITEM_TM_HYPER_VOICE
# 308 "data/maps/LavaridgeTown/scripts.pory"
	.2byte ITEM_TM_THUNDERBOLT
# 309 "data/maps/LavaridgeTown/scripts.pory"
	.2byte ITEM_TM_FLAMETHROWER
# 310 "data/maps/LavaridgeTown/scripts.pory"
	.2byte ITEM_TM_SLUDGE_BOMB
# 311 "data/maps/LavaridgeTown/scripts.pory"
	.2byte ITEM_TM_ENERGY_BALL
# 312 "data/maps/LavaridgeTown/scripts.pory"
	.2byte ITEM_TM_DARK_PULSE
# 313 "data/maps/LavaridgeTown/scripts.pory"
	.2byte ITEM_NONE
# 314 "data/maps/LavaridgeTown/scripts.pory"
	release
# 315 "data/maps/LavaridgeTown/scripts.pory"
	end
# 316 "data/maps/LavaridgeTown/scripts.pory"

# 317 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_MayNiceBadgesTakeThis:
# 318 "data/maps/LavaridgeTown/scripts.pory"
	.string "Hey {PLAYER}! Glad I caught you here.\p"
# 319 "data/maps/LavaridgeTown/scripts.pory"
	.string "I arrived from Petalburg a little while\n"
# 320 "data/maps/LavaridgeTown/scripts.pory"
	.string "ago to see if you'd beaten Flannery\l"
# 321 "data/maps/LavaridgeTown/scripts.pory"
	.string "yet, and look at that, great timing!\p"
# 322 "data/maps/LavaridgeTown/scripts.pory"
	.string "I just met your Dad at the Petalburg\n"
# 323 "data/maps/LavaridgeTown/scripts.pory"
	.string "Gym, and he told me that if I bumped\l"
# 324 "data/maps/LavaridgeTown/scripts.pory"
	.string "into you, I should give you these.$"
# 325 "data/maps/LavaridgeTown/scripts.pory"

# 326 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_MayExplainGoGogglesChallengeDad:
# 327 "data/maps/LavaridgeTown/scripts.pory"
	.string "Those Go-Goggles will let you get\n"
# 328 "data/maps/LavaridgeTown/scripts.pory"
	.string "through the desert in Route 111.\p"
# 329 "data/maps/LavaridgeTown/scripts.pory"
	.string "I threw in some Safety Goggles as well,\n"
# 330 "data/maps/LavaridgeTown/scripts.pory"
	.string "can never have too many goggles,\l"
# 331 "data/maps/LavaridgeTown/scripts.pory"
	.string "you know?\p"
# 332 "data/maps/LavaridgeTown/scripts.pory"
	.string "When I spoke to your Dad, he said to\n"
# 333 "data/maps/LavaridgeTown/scripts.pory"
	.string "give you that Mega Ring so it would be a\l"
# 334 "data/maps/LavaridgeTown/scripts.pory"
	.string "fair fight when you decided to\l"
# 335 "data/maps/LavaridgeTown/scripts.pory"
	.string "challenge him.\p"
# 336 "data/maps/LavaridgeTown/scripts.pory"
	.string "Oh, and one last thing.\p"
# 337 "data/maps/LavaridgeTown/scripts.pory"
	.string "I spoke with Wally's dad, and he told me\n"
# 338 "data/maps/LavaridgeTown/scripts.pory"
	.string "he was going to give you the {COLOR GREEN}{SHADOW LIGHT_GREEN}HM03 Surf,\l"
# 339 "data/maps/LavaridgeTown/scripts.pory"
	.string "but he accidentally dropped it out in\l"
# 340 "data/maps/LavaridgeTown/scripts.pory"
	.string "the desert somewhere.\p"
# 341 "data/maps/LavaridgeTown/scripts.pory"
	.string "{COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}Okay, I think that's everything, I'll see\n"
# 342 "data/maps/LavaridgeTown/scripts.pory"
	.string "you around, {PLAYER}! Congrats on\l"
# 343 "data/maps/LavaridgeTown/scripts.pory"
	.string "beating Flannery, but don't get too\l"
# 344 "data/maps/LavaridgeTown/scripts.pory"
	.string "comfortable because Dawn and I are\l"
# 345 "data/maps/LavaridgeTown/scripts.pory"
	.string "training hard too!$"
# 346 "data/maps/LavaridgeTown/scripts.pory"

# 347 "data/maps/LavaridgeTown/scripts.pory"

# 348 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_BrendanNiceBadgesTakeThis:
# 349 "data/maps/LavaridgeTown/scripts.pory"
	.string "Hey {PLAYER}! Glad I caught you here.\p"
# 350 "data/maps/LavaridgeTown/scripts.pory"
	.string "I arrived from Petalburg a little while\n"
# 351 "data/maps/LavaridgeTown/scripts.pory"
	.string "ago to see if you'd beaten Flannery\l"
# 352 "data/maps/LavaridgeTown/scripts.pory"
	.string "yet, and look at that, great timing!\p"
# 353 "data/maps/LavaridgeTown/scripts.pory"
	.string "I just met your Dad at the Petalburg\n"
# 354 "data/maps/LavaridgeTown/scripts.pory"
	.string "Gym, and he told me that if I bumped\l"
# 355 "data/maps/LavaridgeTown/scripts.pory"
	.string "into you, I should give you these.$"
# 356 "data/maps/LavaridgeTown/scripts.pory"

# 357 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_BrendanExplainGoGogglesChallengeDad:
# 358 "data/maps/LavaridgeTown/scripts.pory"
	.string "Those Go-Goggles will let you get\n"
# 359 "data/maps/LavaridgeTown/scripts.pory"
	.string "through the desert in Route 111.\p"
# 360 "data/maps/LavaridgeTown/scripts.pory"
	.string "I threw in some Safety Goggles as well,\n"
# 361 "data/maps/LavaridgeTown/scripts.pory"
	.string "can never have too many goggles,\l"
# 362 "data/maps/LavaridgeTown/scripts.pory"
	.string "you know?\p"
# 363 "data/maps/LavaridgeTown/scripts.pory"
	.string "When I spoke to your Dad, he said to\n"
# 364 "data/maps/LavaridgeTown/scripts.pory"
	.string "give you that Mega Ring so it would be a\l"
# 365 "data/maps/LavaridgeTown/scripts.pory"
	.string "fair fight when you decided to\l"
# 366 "data/maps/LavaridgeTown/scripts.pory"
	.string "challenge him.\p"
# 367 "data/maps/LavaridgeTown/scripts.pory"
	.string "Oh, and one last thing.\p"
# 368 "data/maps/LavaridgeTown/scripts.pory"
	.string "I spoke with Wally's dad, and he told me\n"
# 369 "data/maps/LavaridgeTown/scripts.pory"
	.string "he was going to give you the {COLOR GREEN}{SHADOW LIGHT_GREEN}HM03 Surf,\l"
# 370 "data/maps/LavaridgeTown/scripts.pory"
	.string "but he accidentally dropped it out in\l"
# 371 "data/maps/LavaridgeTown/scripts.pory"
	.string "the desert somewhere.\p"
# 372 "data/maps/LavaridgeTown/scripts.pory"
	.string "{COLOR DARK_GRAY}{SHADOW LIGHT_GRAY}Okay, I think that's everything, I'll see\n"
# 373 "data/maps/LavaridgeTown/scripts.pory"
	.string "you around, {PLAYER}! Congrats on\l"
# 374 "data/maps/LavaridgeTown/scripts.pory"
	.string "beating Flannery, but don't get too\l"
# 375 "data/maps/LavaridgeTown/scripts.pory"
	.string "comfortable because Dawn and I are\l"
# 376 "data/maps/LavaridgeTown/scripts.pory"
	.string "training hard too!$"
# 377 "data/maps/LavaridgeTown/scripts.pory"

# 378 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_HaveEggWillYouTakeIt:
# 379 "data/maps/LavaridgeTown/scripts.pory"
	.string "I have here an Egg.\p"
# 380 "data/maps/LavaridgeTown/scripts.pory"
	.string "I'd hoped to hatch it by covering it in\n"
# 381 "data/maps/LavaridgeTown/scripts.pory"
	.string "hot sand by the hot springs.\l"
# 382 "data/maps/LavaridgeTown/scripts.pory"
	.string "But that doesn't seem to be enough…\p"
# 383 "data/maps/LavaridgeTown/scripts.pory"
	.string "I've heard it would be best if it were\n"
# 384 "data/maps/LavaridgeTown/scripts.pory"
	.string "kept together with Pokémon and\l"
# 385 "data/maps/LavaridgeTown/scripts.pory"
	.string "carried about.\p"
# 386 "data/maps/LavaridgeTown/scripts.pory"
	.string "You are a trainer, yes?\n"
# 387 "data/maps/LavaridgeTown/scripts.pory"
	.string "And your Pokémon radiate vitality.\p"
# 388 "data/maps/LavaridgeTown/scripts.pory"
	.string "So, what say you?\n"
# 389 "data/maps/LavaridgeTown/scripts.pory"
	.string "Will you take this Egg to hatch?$"
# 390 "data/maps/LavaridgeTown/scripts.pory"

# 391 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_HopeYoullWalkPlentyWithEgg:
# 392 "data/maps/LavaridgeTown/scripts.pory"
	.string "Good! I hope you'll walk plenty with\n"
# 393 "data/maps/LavaridgeTown/scripts.pory"
	.string "this here Egg!$"
# 394 "data/maps/LavaridgeTown/scripts.pory"

# 395 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_ReceivedTheEgg:
# 396 "data/maps/LavaridgeTown/scripts.pory"
	.string "{PLAYER} received the Egg.$"
# 397 "data/maps/LavaridgeTown/scripts.pory"

# 398 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_NoRoomForThisEgg:
# 399 "data/maps/LavaridgeTown/scripts.pory"
	.string "Oh? You've too many Pokémon.\n"
# 400 "data/maps/LavaridgeTown/scripts.pory"
	.string "There's no room for this Egg…$"
# 401 "data/maps/LavaridgeTown/scripts.pory"

# 402 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_AsYouWishThen:
# 403 "data/maps/LavaridgeTown/scripts.pory"
	.string "As you wish, then…\p"
# 404 "data/maps/LavaridgeTown/scripts.pory"
	.string "If you have a change of heart about\n"
# 405 "data/maps/LavaridgeTown/scripts.pory"
	.string "hatching this Egg, I will be here.$"
# 406 "data/maps/LavaridgeTown/scripts.pory"

# 407 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_EverySoOftenEggFoundAtDayCare:
# 408 "data/maps/LavaridgeTown/scripts.pory"
	.string "Every so often, an Egg will be found at\n"
# 409 "data/maps/LavaridgeTown/scripts.pory"
	.string "the Pokémon Day Care.\p"
# 410 "data/maps/LavaridgeTown/scripts.pory"
	.string "Or at least that's how the rumor goes.$"
# 411 "data/maps/LavaridgeTown/scripts.pory"

# 412 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_HotSpringsNeverRunDry:
# 413 "data/maps/LavaridgeTown/scripts.pory"
	.string "We draw as much hot water as we need,\n"
# 414 "data/maps/LavaridgeTown/scripts.pory"
	.string "and yet the hot springs never run dry.\p"
# 415 "data/maps/LavaridgeTown/scripts.pory"
	.string "Isn't it magical?\p"
# 416 "data/maps/LavaridgeTown/scripts.pory"
	.string "These hot springs appear near active\n"
# 417 "data/maps/LavaridgeTown/scripts.pory"
	.string "volcanoes. Veins of water under the\l"
# 418 "data/maps/LavaridgeTown/scripts.pory"
	.string "ground are heated by magma to well up\l"
# 419 "data/maps/LavaridgeTown/scripts.pory"
	.string "as hot springs.$"
# 420 "data/maps/LavaridgeTown/scripts.pory"

# 421 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_PokemonNippedBackside:
# 422 "data/maps/LavaridgeTown/scripts.pory"
	.string "Being buried in this hot sand is…\n"
# 423 "data/maps/LavaridgeTown/scripts.pory"
	.string "Sigh…\p"
# 424 "data/maps/LavaridgeTown/scripts.pory"
	.string "So warm and heavenly…\p"
# 425 "data/maps/LavaridgeTown/scripts.pory"
	.string "Eh? Gyaah! Ouch!\p"
# 426 "data/maps/LavaridgeTown/scripts.pory"
	.string "A Pokémon nipped my backside!$"
# 427 "data/maps/LavaridgeTown/scripts.pory"

# 428 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_OhYouLikeHotSprings:
# 429 "data/maps/LavaridgeTown/scripts.pory"
	.string "Oh, you like hot springs, do you?\p"
# 430 "data/maps/LavaridgeTown/scripts.pory"
	.string "That's surprising for one as young\n"
# 431 "data/maps/LavaridgeTown/scripts.pory"
	.string "as you.$"
# 432 "data/maps/LavaridgeTown/scripts.pory"

# 433 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_BatheInHotSpringsEveryDay:
# 434 "data/maps/LavaridgeTown/scripts.pory"
	.string "I bathe in the hot springs every day.\p"
# 435 "data/maps/LavaridgeTown/scripts.pory"
	.string "I want to become a beautiful and strong\n"
# 436 "data/maps/LavaridgeTown/scripts.pory"
	.string "Gym Leader like Flannery.$"
# 437 "data/maps/LavaridgeTown/scripts.pory"

# 438 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_IfPokemonInHotSprings:
# 439 "data/maps/LavaridgeTown/scripts.pory"
	.string "If people put Pokémon in hot springs,\n"
# 440 "data/maps/LavaridgeTown/scripts.pory"
	.string "it might be seriously strange.\p"
# 441 "data/maps/LavaridgeTown/scripts.pory"
	.string "Why, it might be an electric bath, or\n"
# 442 "data/maps/LavaridgeTown/scripts.pory"
	.string "a bubble bath, or even a lava bath…$"
# 443 "data/maps/LavaridgeTown/scripts.pory"

# 444 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_HotSpringsClaims:
# 445 "data/maps/LavaridgeTown/scripts.pory"
	.string "They're claiming that these hot springs\n"
# 446 "data/maps/LavaridgeTown/scripts.pory"
	.string "are good for calming nervous tension,\l"
# 447 "data/maps/LavaridgeTown/scripts.pory"
	.string "relieving aching muscles, solving\l"
# 448 "data/maps/LavaridgeTown/scripts.pory"
	.string "romantic problems, and attracting\l"
# 449 "data/maps/LavaridgeTown/scripts.pory"
	.string "money…$"
# 450 "data/maps/LavaridgeTown/scripts.pory"

# 451 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_TownSign:
# 452 "data/maps/LavaridgeTown/scripts.pory"
	.string "Lavaridge Town\p"
# 453 "data/maps/LavaridgeTown/scripts.pory"
	.string "“Pokémon Center Hot Springs\n"
# 454 "data/maps/LavaridgeTown/scripts.pory"
	.string "An excellent place for relaxing!”$"
# 455 "data/maps/LavaridgeTown/scripts.pory"

# 456 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_GymSign:
# 457 "data/maps/LavaridgeTown/scripts.pory"
	.string "Lavaridge Town Pokémon Gym\n"
# 458 "data/maps/LavaridgeTown/scripts.pory"
	.string "Leader: Flannery\l"
# 459 "data/maps/LavaridgeTown/scripts.pory"
	.string "“One with a fiery passion that burns!”$"
# 460 "data/maps/LavaridgeTown/scripts.pory"

# 461 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_HerbShopSign:
# 462 "data/maps/LavaridgeTown/scripts.pory"
	.string "Pokémon Herb Shop\n"
# 463 "data/maps/LavaridgeTown/scripts.pory"
	.string "“Bitter taste--better cure!”$"
# 464 "data/maps/LavaridgeTown/scripts.pory"

# 465 "data/maps/LavaridgeTown/scripts.pory"
LavaridgeTown_Text_Sandygast:
# 466 "data/maps/LavaridgeTown/scripts.pory"
	.string "Sandygast: Sssssssss!$"
