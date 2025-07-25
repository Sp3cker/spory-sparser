# 1 "data/maps/VictoryRoad_1F/scripts.pory"

# 2 "data/maps/VictoryRoad_1F/scripts.pory"
.set LOCALID_WALLY_ENTRANCE, 4
# 3 "data/maps/VictoryRoad_1F/scripts.pory"

# 4 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_MapScripts::
# 5 "data/maps/VictoryRoad_1F/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, VictoryRoad_1F_OnTransition
# 6 "data/maps/VictoryRoad_1F/scripts.pory"
	.byte 0
# 7 "data/maps/VictoryRoad_1F/scripts.pory"

# 8 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_OnTransition:
# 9 "data/maps/VictoryRoad_1F/scripts.pory"
	call_if_eq VAR_VICTORY_ROAD_1F_STATE, 1, VictoryRoad_1F_EventScript_SetEntranceWallyPos1
# 10 "data/maps/VictoryRoad_1F/scripts.pory"
	call_if_eq VAR_VICTORY_ROAD_1F_STATE, 2, VictoryRoad_1F_EventScript_SetEntranceWallyPos2
# 11 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 12 "data/maps/VictoryRoad_1F/scripts.pory"

# 13 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_SetEntranceWallyPos1::
# 14 "data/maps/VictoryRoad_1F/scripts.pory"
	setobjectxyperm LOCALID_WALLY_ENTRANCE, 2, 24
# 15 "data/maps/VictoryRoad_1F/scripts.pory"
	setobjectmovementtype LOCALID_WALLY_ENTRANCE, MOVEMENT_TYPE_FACE_DOWN
# 16 "data/maps/VictoryRoad_1F/scripts.pory"
	return
# 17 "data/maps/VictoryRoad_1F/scripts.pory"

# 18 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_SetEntranceWallyPos2::
# 19 "data/maps/VictoryRoad_1F/scripts.pory"
	setobjectxyperm LOCALID_WALLY_ENTRANCE, 3, 24
# 20 "data/maps/VictoryRoad_1F/scripts.pory"
	setobjectmovementtype LOCALID_WALLY_ENTRANCE, MOVEMENT_TYPE_FACE_DOWN
# 21 "data/maps/VictoryRoad_1F/scripts.pory"
	return
# 22 "data/maps/VictoryRoad_1F/scripts.pory"

# 23 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_WallyBattleTrigger1::
# 24 "data/maps/VictoryRoad_1F/scripts.pory"
	lockall
# 25 "data/maps/VictoryRoad_1F/scripts.pory"
	playbgm MUS_ENCOUNTER_BRENDAN, FALSE
# 26 "data/maps/VictoryRoad_1F/scripts.pory"
	setvar VAR_0x8008, 1
# 27 "data/maps/VictoryRoad_1F/scripts.pory"
	addobject LOCALID_WALLY_ENTRANCE
# 28 "data/maps/VictoryRoad_1F/scripts.pory"
	applymovement LOCALID_WALLY_ENTRANCE, VictoryRoad_1F_Movement_WallyApproachPlayer1
# 29 "data/maps/VictoryRoad_1F/scripts.pory"
	waitmovement 0
# 30 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_WallyEntranceBattle
# 31 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 32 "data/maps/VictoryRoad_1F/scripts.pory"

# 33 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_WallyBattleTrigger2::
# 34 "data/maps/VictoryRoad_1F/scripts.pory"
	lockall
# 35 "data/maps/VictoryRoad_1F/scripts.pory"
	playbgm MUS_ENCOUNTER_BRENDAN, FALSE
# 36 "data/maps/VictoryRoad_1F/scripts.pory"
	setvar VAR_0x8008, 2
# 37 "data/maps/VictoryRoad_1F/scripts.pory"
	addobject LOCALID_WALLY_ENTRANCE
# 38 "data/maps/VictoryRoad_1F/scripts.pory"
	applymovement LOCALID_WALLY_ENTRANCE, VictoryRoad_1F_Movement_WallyApproachPlayer2
# 39 "data/maps/VictoryRoad_1F/scripts.pory"
	waitmovement 0
# 40 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_WallyEntranceBattle
# 41 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 42 "data/maps/VictoryRoad_1F/scripts.pory"

# 43 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_WallyEntranceBattle::
@explanation Defeat Wally at the entrance of Victory Road

# 44 "data/maps/VictoryRoad_1F/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_WalkInPlaceFasterDown
# 45 "data/maps/VictoryRoad_1F/scripts.pory"
	waitmovement 0
# 46 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WallyNotGoingToLoseAnymore, MSGBOX_DEFAULT
# 47 "data/maps/VictoryRoad_1F/scripts.pory"
	trainerbattle_no_intro TRAINER_WALLY_VR_1, VictoryRoad_1F_Text_WallyEntranceDefeat
# 48 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WallyGiftFromDad, MSGBOX_DEFAULT
# 49 "data/maps/VictoryRoad_1F/scripts.pory"
	giveitem ITEM_SLAKITE
# 50 "data/maps/VictoryRoad_1F/scripts.pory"
	giveitem ITEM_TYRANITARITE
# 51 "data/maps/VictoryRoad_1F/scripts.pory"
	giveitem ITEM_SALAMENCITE
# 52 "data/maps/VictoryRoad_1F/scripts.pory"
	giveitem ITEM_GARCHOMPITE
# 53 "data/maps/VictoryRoad_1F/scripts.pory"
	giveitem ITEM_METAGROSSITE
# 54 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WallyTicketsFromDad, MSGBOX_DEFAULT
# 55 "data/maps/VictoryRoad_1F/scripts.pory"
	giveitem ITEM_EON_TICKET
# 56 "data/maps/VictoryRoad_1F/scripts.pory"
	giveitem ITEM_AURORA_TICKET
# 57 "data/maps/VictoryRoad_1F/scripts.pory"
	setflag FLAG_ENABLE_SHIP_BIRTH_ISLAND
# 58 "data/maps/VictoryRoad_1F/scripts.pory"
	setflag FLAG_ENABLE_SHIP_SOUTHERN_ISLAND
# 59 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WallyPostEntranceBattle, MSGBOX_DEFAULT
# 60 "data/maps/VictoryRoad_1F/scripts.pory"
	closemessage
# 61 "data/maps/VictoryRoad_1F/scripts.pory"
	clearflag FLAG_HIDE_VICTORY_ROAD_ENTRANCE_WALLY
# 62 "data/maps/VictoryRoad_1F/scripts.pory"
	copyobjectxytoperm LOCALID_WALLY_ENTRANCE
# 63 "data/maps/VictoryRoad_1F/scripts.pory"
	setflag FLAG_DEFEATED_WALLY_VICTORY_ROAD
# 64 "data/maps/VictoryRoad_1F/scripts.pory"
	copyvar VAR_VICTORY_ROAD_1F_STATE, VAR_0x8008
# 65 "data/maps/VictoryRoad_1F/scripts.pory"
	delay 30
# 66 "data/maps/VictoryRoad_1F/scripts.pory"
	playfanfare MUS_LEVEL_UP
# 67 "data/maps/VictoryRoad_1F/scripts.pory"
	specialvar VAR_0x8006, GetLevelCapForText
# 68 "data/maps/VictoryRoad_1F/scripts.pory"
	buffernumberstring STR_VAR_3, VAR_0x8006
# 69 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox LevelCapIncreasedTo, MSGBOX_DEFAULT
# 70 "data/maps/VictoryRoad_1F/scripts.pory"
	waitfanfare
# 71 "data/maps/VictoryRoad_1F/scripts.pory"
	closemessage
# 72 "data/maps/VictoryRoad_1F/scripts.pory"
	delay 30
# 73 "data/maps/VictoryRoad_1F/scripts.pory"
	releaseall
# 74 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 75 "data/maps/VictoryRoad_1F/scripts.pory"

# 76 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Movement_WallyApproachPlayer1:
# 77 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 78 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 79 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 80 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 81 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 82 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 83 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 84 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 85 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 86 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 87 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_up
# 88 "data/maps/VictoryRoad_1F/scripts.pory"
	step_end
# 89 "data/maps/VictoryRoad_1F/scripts.pory"

# 90 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Movement_WallyApproachPlayer2:
# 91 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 92 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 93 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 94 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 95 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 96 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 97 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 98 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 99 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_left
# 100 "data/maps/VictoryRoad_1F/scripts.pory"
	walk_up
# 101 "data/maps/VictoryRoad_1F/scripts.pory"
	step_end
# 102 "data/maps/VictoryRoad_1F/scripts.pory"

# 103 "data/maps/VictoryRoad_1F/scripts.pory"
@ This Wally appears near the entrance once his battle is triggered and remains there until the Hall of Fame is entered
# 104 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_EntranceWally::
# 105 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WallyPostEntranceBattle, MSGBOX_NPC
# 106 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 107 "data/maps/VictoryRoad_1F/scripts.pory"

# 108 "data/maps/VictoryRoad_1F/scripts.pory"
@ This Wally appears and remains at the exit after the Hall of Fame is entered
# 109 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_ExitWally::
# 110 "data/maps/VictoryRoad_1F/scripts.pory"
	trainerbattle_single TRAINER_WALLY_VR_2, VictoryRoad_1F_Text_WallyIntro, VictoryRoad_1F_Text_WallyDefeat
# 111 "data/maps/VictoryRoad_1F/scripts.pory"
	specialvar VAR_RESULT, ShouldTryRematchBattle
# 112 "data/maps/VictoryRoad_1F/scripts.pory"
	goto_if_eq VAR_RESULT, TRUE, VictoryRoad_1F_EventScript_RematchWally
# 113 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WallyPostBattle, MSGBOX_AUTOCLOSE
# 114 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 115 "data/maps/VictoryRoad_1F/scripts.pory"

# 116 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_RematchWally::
# 117 "data/maps/VictoryRoad_1F/scripts.pory"
	trainerbattle_rematch TRAINER_WALLY_VR_2, VictoryRoad_1F_Text_WallyIntro, VictoryRoad_1F_Text_WallyDefeat
# 118 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WallyPostBattle, MSGBOX_AUTOCLOSE
# 119 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 120 "data/maps/VictoryRoad_1F/scripts.pory"

# 121 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_Edgar::
# 122 "data/maps/VictoryRoad_1F/scripts.pory"
	trainerbattle_single TRAINER_EDGAR, VictoryRoad_1F_Text_EdgarIntro, VictoryRoad_1F_Text_EdgarDefeat
# 123 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_EdgarPostBattle, MSGBOX_AUTOCLOSE
# 124 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 125 "data/maps/VictoryRoad_1F/scripts.pory"

# 126 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_Albert::
# 127 "data/maps/VictoryRoad_1F/scripts.pory"
	trainerbattle_single TRAINER_ALBERT, VictoryRoad_1F_Text_AlbertIntro, VictoryRoad_1F_Text_AlbertDefeat
# 128 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_AlbertPostBattle, MSGBOX_AUTOCLOSE
# 129 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 130 "data/maps/VictoryRoad_1F/scripts.pory"

# 131 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_Hope::
# 132 "data/maps/VictoryRoad_1F/scripts.pory"
	trainerbattle_single TRAINER_HOPE, VictoryRoad_1F_Text_HopeIntro, VictoryRoad_1F_Text_HopeDefeat
# 133 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_HopePostBattle, MSGBOX_AUTOCLOSE
# 134 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 135 "data/maps/VictoryRoad_1F/scripts.pory"

# 136 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_Quincy::
# 137 "data/maps/VictoryRoad_1F/scripts.pory"
	trainerbattle_single TRAINER_QUINCY, VictoryRoad_1F_Text_QuincyIntro, VictoryRoad_1F_Text_QuincyDefeat
# 138 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_QuincyPostBattle, MSGBOX_AUTOCLOSE
# 139 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 140 "data/maps/VictoryRoad_1F/scripts.pory"

# 141 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_EventScript_Katelynn::
# 142 "data/maps/VictoryRoad_1F/scripts.pory"
	trainerbattle_single TRAINER_KATELYNN, VictoryRoad_1F_Text_KatelynnIntro, VictoryRoad_1F_Text_KatelynnDefeat
# 143 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_KatelynnPostBattle, MSGBOX_AUTOCLOSE
# 144 "data/maps/VictoryRoad_1F/scripts.pory"
	end
# 145 "data/maps/VictoryRoad_1F/scripts.pory"

# 146 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_WallyNotGoingToLoseAnymore:
# 147 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "{PLAYER}! You made it! I've been\n"
# 148 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "wandering around here doing more\l"
# 149 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "training, and I knew you'd show up\l"
# 150 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "eventually.\p"
# 151 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "After you beat me in Mauville and on\n"
# 152 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Route 110, I realized how weak I was,\l"
# 153 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "how little I knew about Pokémon…\p"
# 154 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Since then, I've become so much\n"
# 155 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "stronger.\p"
# 156 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I've trained extremely hard in hopes of\n"
# 157 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "beating you one day, I even defeated\l"
# 158 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "all of the Gym Leaders here in Hoenn!\p"
# 159 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "However, I have one more goal before I\n"
# 160 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "can move on to the Pokémon League…\p"
# 161 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I have to beat you, {PLAYER}!\n"
# 162 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "You inspired me to get stronger, so now\l"
# 163 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I'll show you the results of my\l"
# 164 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "hard work!$"
# 165 "data/maps/VictoryRoad_1F/scripts.pory"

# 166 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_WallyEntranceDefeat:
# 167 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "All my training, and it still wasn't\n"
# 168 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "enough… I won't give up, though! I'll\l"
# 169 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "keep training until I can beat you!$"
# 170 "data/maps/VictoryRoad_1F/scripts.pory"

# 171 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_WallyPostEntranceBattle:
# 172 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I couldn't beat you this time,\n"
# 173 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "either…\p"
# 174 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "But one of these days,\n"
# 175 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "{PLAYER}, I'm going to catch up to you.\p"
# 176 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "And then I'll challenge the Pokémon\n"
# 177 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "League!$"
# 178 "data/maps/VictoryRoad_1F/scripts.pory"

# 179 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_WallyGiftFromDad:
# 180 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "That was a great battle, but I still\n"
# 181 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "clearly have more to learn…\p"
# 182 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Oh! I just remembered, your dad gave me\n"
# 183 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "a package with some items to give to\l"
# 184 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "you, {PLAYER}.\p"
# 185 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "He said to tell you he was sorry he\n"
# 186 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "didn't have that one Mega Stone ready\l"
# 187 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "when you defeated him, so he threw in\l"
# 188 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "some extras to make up for it.\p"
# 189 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Here you go, {PLAYER}.$"
# 190 "data/maps/VictoryRoad_1F/scripts.pory"

# 191 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_WallyTicketsFromDad:
# 192 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Oh I almost forgot, he gave me these to\n"
# 193 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "give to you too.\p"
# 194 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I'm not sure where these tickets will\n"
# 195 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "take you, but your dad said you can go\l"
# 196 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "to the ferry in Lilycove City and use\l"
# 197 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "the tickets there.$"
# 198 "data/maps/VictoryRoad_1F/scripts.pory"

# 199 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_WallyIntro:
# 200 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Hi! {PLAYER}!\p"
# 201 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I've gotten stronger since that last\n"
# 202 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "time! I wanted to show you, {PLAYER}!\p"
# 203 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Okay… Here I come!$"
# 204 "data/maps/VictoryRoad_1F/scripts.pory"

# 205 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_WallyDefeat:
# 206 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Wow!\n"
# 207 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "{PLAYER}, you are strong, after all!$"
# 208 "data/maps/VictoryRoad_1F/scripts.pory"

# 209 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_WallyPostBattle:
# 210 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I couldn't beat you this time,\n"
# 211 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "too… But one of these days, {PLAYER},\l"
# 212 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I'm going to catch up to you…\p"
# 213 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "And challenge the Pokémon LEAGUE!$"
# 214 "data/maps/VictoryRoad_1F/scripts.pory"

# 215 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_EdgarIntro:
# 216 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I've made it this far a couple times,\n"
# 217 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "but the last stretch is so long…$"
# 218 "data/maps/VictoryRoad_1F/scripts.pory"

# 219 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_EdgarDefeat:
# 220 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "My dream ends here again…$"
# 221 "data/maps/VictoryRoad_1F/scripts.pory"

# 222 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_EdgarPostBattle:
# 223 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "You've made it this far. Keep the\n"
# 224 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "momentum going and become the\l"
# 225 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "CHAMPION! If anyone can, it's you!$"
# 226 "data/maps/VictoryRoad_1F/scripts.pory"

# 227 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_AlbertIntro:
# 228 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I didn't come all this way to lose now.\n"
# 229 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "That possibility doesn't exist!$"
# 230 "data/maps/VictoryRoad_1F/scripts.pory"

# 231 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_AlbertDefeat:
# 232 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Impossible…\n"
# 233 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I lost?$"
# 234 "data/maps/VictoryRoad_1F/scripts.pory"

# 235 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_AlbertPostBattle:
# 236 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I lost here…\p"
# 237 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "That means I lack the qualifications\n"
# 238 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "to become the CHAMPION…$"
# 239 "data/maps/VictoryRoad_1F/scripts.pory"

# 240 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_HopeIntro:
# 241 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "This seemingly infinite and harsh road\n"
# 242 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "lives up to its name of VICTORY.$"
# 243 "data/maps/VictoryRoad_1F/scripts.pory"

# 244 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_HopeDefeat:
# 245 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Your battle style is fantastic…$"
# 246 "data/maps/VictoryRoad_1F/scripts.pory"

# 247 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_HopePostBattle:
# 248 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "You seem to have the potential for\n"
# 249 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "becoming the CHAMPION.$"
# 250 "data/maps/VictoryRoad_1F/scripts.pory"

# 251 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_QuincyIntro:
# 252 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "What is the VICTORY ROAD?\n"
# 253 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I'll tell you if you win!$"
# 254 "data/maps/VictoryRoad_1F/scripts.pory"

# 255 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_QuincyDefeat:
# 256 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Okay!\n"
# 257 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Well done!$"
# 258 "data/maps/VictoryRoad_1F/scripts.pory"

# 259 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_QuincyPostBattle:
# 260 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Getting through here safely--that's\n"
# 261 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "the final test for any TRAINER aiming\l"
# 262 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "to become the Pokémon CHAMPION.\p"
# 263 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "That's why it's called the VICTORY\n"
# 264 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "ROAD.$"
# 265 "data/maps/VictoryRoad_1F/scripts.pory"

# 266 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_KatelynnIntro:
# 267 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I have nothing to say to anyone\n"
# 268 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "that's come this far. Come on!$"
# 269 "data/maps/VictoryRoad_1F/scripts.pory"

# 270 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_KatelynnDefeat:
# 271 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "This is a disgrace…$"
# 272 "data/maps/VictoryRoad_1F/scripts.pory"

# 273 "data/maps/VictoryRoad_1F/scripts.pory"
VictoryRoad_1F_Text_KatelynnPostBattle:
# 274 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Humph, go right on ahead.\n"
# 275 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "See if I care.$"

VictoryRoad_1F_EventScript_PowerfulMonSummoner::
# 280 "data/maps/VictoryRoad_1F/scripts.pory"
	lock
# 281 "data/maps/VictoryRoad_1F/scripts.pory"
	faceplayer
# 282 "data/maps/VictoryRoad_1F/scripts.pory"
	goto_if_set FLAG_TEMP_1, VictoryRoad_1F_EventScript_PowerfulMonSummoner_2
# 288 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_SummonerIntro, MSGBOX_YESNO
VictoryRoad_1F_EventScript_PowerfulMonSummoner_1:
# 291 "data/maps/VictoryRoad_1F/scripts.pory"
	setflag FLAG_TEMP_1
# 293 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, NO
	goto_if_eq VictoryRoad_1F_EventScript_PowerfulMonSummoner_6
VictoryRoad_1F_EventScript_PowerfulMonSummoner_5:
# 298 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_ChooseRoom
# 299 "data/maps/VictoryRoad_1F/scripts.pory"
	release
	end

VictoryRoad_1F_EventScript_PowerfulMonSummoner_2:
# 284 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_SummonerIntroQuick, MSGBOX_YESNO
	goto VictoryRoad_1F_EventScript_PowerfulMonSummoner_1

VictoryRoad_1F_EventScript_PowerfulMonSummoner_6:
# 295 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_SummonWomanManNo
	goto VictoryRoad_1F_EventScript_PowerfulMonSummoner_5


VictoryRoad_1F_EventScript_ChooseRoom::
# 304 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WhichRoom, MSGBOX_DEFAULT
# 306 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_ChooseRoom_Text_0, 0
# 307 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_ChooseRoom_Text_1, 1
# 308 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_ChooseRoom_Text_2, 2
# 309 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_ChooseRoom_Text_3, MULTI_B_PRESSED
# 313 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 0, DYN_MULTICHOICE_CB_NONE
# 315 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq VictoryRoad_1F_EventScript_ChooseRoom_2
VictoryRoad_1F_EventScript_ChooseRoom_1:
# 320 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, 0
	goto_if_eq VictoryRoad_1F_EventScript_ChooseRoom_5
VictoryRoad_1F_EventScript_ChooseRoom_4:
# 324 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, 1
	goto_if_eq VictoryRoad_1F_EventScript_ChooseRoom_8
VictoryRoad_1F_EventScript_ChooseRoom_7:
# 328 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, 2
	goto_if_eq VictoryRoad_1F_EventScript_ChooseRoom_11
VictoryRoad_1F_EventScript_ChooseRoom_10:
# 333 "data/maps/VictoryRoad_1F/scripts.pory"
	release
	end

VictoryRoad_1F_EventScript_ChooseRoom_2:
# 317 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_SummonWomanManNo
	goto VictoryRoad_1F_EventScript_ChooseRoom_1

VictoryRoad_1F_EventScript_ChooseRoom_5:
# 322 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_EntranceRoom
	goto VictoryRoad_1F_EventScript_ChooseRoom_4

VictoryRoad_1F_EventScript_ChooseRoom_8:
# 326 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_InnerRoom
	goto VictoryRoad_1F_EventScript_ChooseRoom_7

VictoryRoad_1F_EventScript_ChooseRoom_11:
# 330 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_StairsRoom
	goto VictoryRoad_1F_EventScript_ChooseRoom_10


VictoryRoad_1F_EventScript_EntranceRoom::
# 338 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WhichPokemon, MSGBOX_DEFAULT
# 340 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_0, SPECIES_GREAT_TUSK
# 341 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_1, SPECIES_SCREAM_TAIL
# 342 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_2, SPECIES_BRUTE_BONNET
# 343 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_3, SPECIES_FLUTTER_MANE
# 344 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_4, SPECIES_SLITHER_WING
# 345 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_5, SPECIES_SANDY_SHOCKS
# 346 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_6, SPECIES_ROARING_MOON
# 347 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_7, SPECIES_WALKING_WAKE
# 348 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_8, SPECIES_GOUGING_FIRE
# 349 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_9, SPECIES_RAGING_BOLT
# 350 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_10, MULTI_B_PRESSED
# 354 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, SPECIES_GREAT_TUSK, DYN_MULTICHOICE_CB_NONE
# 356 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq VictoryRoad_1F_EventScript_EntranceRoom_2
VictoryRoad_1F_EventScript_EntranceRoom_1:
# 361 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_ConfirmAndUseSummon
# 363 "data/maps/VictoryRoad_1F/scripts.pory"
	release
	end

VictoryRoad_1F_EventScript_EntranceRoom_2:
# 358 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_ChooseRoom
	goto VictoryRoad_1F_EventScript_EntranceRoom_1


VictoryRoad_1F_EventScript_InnerRoom::
# 369 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WhichPokemon, MSGBOX_DEFAULT
# 371 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_0, SPECIES_IRON_TREADS
# 372 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_1, SPECIES_IRON_BUNDLE
# 373 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_2, SPECIES_IRON_HANDS
# 374 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_3, SPECIES_IRON_JUGULIS
# 375 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_4, SPECIES_IRON_MOTH
# 376 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_5, SPECIES_IRON_THORNS
# 377 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_6, SPECIES_IRON_VALIANT
# 378 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_7, SPECIES_IRON_LEAVES
# 379 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_8, SPECIES_IRON_BOULDER
# 380 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_InnerRoom_Text_9, SPECIES_IRON_CROWN
# 381 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_10, MULTI_B_PRESSED
# 385 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, SPECIES_IRON_TREADS, DYN_MULTICHOICE_CB_NONE
# 387 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq VictoryRoad_1F_EventScript_InnerRoom_2
VictoryRoad_1F_EventScript_InnerRoom_1:
# 392 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_ConfirmAndUseSummon
# 394 "data/maps/VictoryRoad_1F/scripts.pory"
	release
	end

VictoryRoad_1F_EventScript_InnerRoom_2:
# 389 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_ChooseRoom
	goto VictoryRoad_1F_EventScript_InnerRoom_1


VictoryRoad_1F_EventScript_StairsRoom::
@explanation Select a Paradox Pokémon to fight

# 400 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_WhichPokemon, MSGBOX_DEFAULT
# 402 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_0, SPECIES_NIHILEGO
# 403 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_1, SPECIES_GUZZLORD
# 404 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_2, SPECIES_XURKITREE
# 405 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_3, SPECIES_BUZZWOLE
# 406 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_4, SPECIES_BLACEPHALON
# 407 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_5, SPECIES_STAKATAKA
# 408 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_6, SPECIES_POIPOLE
# 409 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_7, SPECIES_PHEROMOSA
# 410 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_StairsRoom_Text_8, SPECIES_CELESTEELA
# 411 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultipush VictoryRoad_1F_EventScript_EntranceRoom_Text_10, MULTI_B_PRESSED
# 415 "data/maps/VictoryRoad_1F/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, SPECIES_NIHILEGO, DYN_MULTICHOICE_CB_NONE
# 417 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq VictoryRoad_1F_EventScript_StairsRoom_2
VictoryRoad_1F_EventScript_StairsRoom_1:
# 422 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_ConfirmAndUseSummon
# 424 "data/maps/VictoryRoad_1F/scripts.pory"
	release
	end

VictoryRoad_1F_EventScript_StairsRoom_2:
# 419 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_ChooseRoom
	goto VictoryRoad_1F_EventScript_StairsRoom_1


VictoryRoad_1F_EventScript_ConfirmAndUseSummon::
# 431 "data/maps/VictoryRoad_1F/scripts.pory"
	copyvar VAR_0x8005, VAR_RESULT
# 432 "data/maps/VictoryRoad_1F/scripts.pory"
	bufferspeciesname STR_VAR_1, VAR_0x8005
# 433 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_ConfirmSummon, MSGBOX_YESNO
# 435 "data/maps/VictoryRoad_1F/scripts.pory"
	compare VAR_RESULT, NO
	goto_if_eq VictoryRoad_1F_EventScript_ConfirmAndUseSummon_2
VictoryRoad_1F_EventScript_ConfirmAndUseSummon_1:
# 440 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_Text_VeryWell, MSGBOX_DEFAULT
# 441 "data/maps/VictoryRoad_1F/scripts.pory"
	delay 30
# 443 "data/maps/VictoryRoad_1F/scripts.pory"
	setwildbattle VAR_0x8005, 50
# 444 "data/maps/VictoryRoad_1F/scripts.pory"
	waitse
# 445 "data/maps/VictoryRoad_1F/scripts.pory"
	playmoncry VAR_0x8005, CRY_MODE_ENCOUNTER
# 446 "data/maps/VictoryRoad_1F/scripts.pory"
	delay 40
# 447 "data/maps/VictoryRoad_1F/scripts.pory"
	waitmoncry
# 448 "data/maps/VictoryRoad_1F/scripts.pory"
	dowildbattle
# 449 "data/maps/VictoryRoad_1F/scripts.pory"
	release
	end

VictoryRoad_1F_EventScript_ConfirmAndUseSummon_2:
# 437 "data/maps/VictoryRoad_1F/scripts.pory"
	goto VictoryRoad_1F_EventScript_SummonWomanManNo
	goto VictoryRoad_1F_EventScript_ConfirmAndUseSummon_1


VictoryRoad_1F_EventScript_SummonWomanManNo::
# 455 "data/maps/VictoryRoad_1F/scripts.pory"
	msgbox VictoryRoad_1F_SummonWomanDeclined, MSGBOX_DEFAULT
# 456 "data/maps/VictoryRoad_1F/scripts.pory"
	release
	end


VictoryRoad_1F_EventScript_ChooseRoom_Text_0:
# 306 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Entrance Room$"

VictoryRoad_1F_EventScript_ChooseRoom_Text_1:
# 307 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Inner Room$"

VictoryRoad_1F_EventScript_ChooseRoom_Text_2:
# 308 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Stairs Room$"

VictoryRoad_1F_EventScript_ChooseRoom_Text_3:
# 309 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Cancel$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_0:
# 340 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Great Tusk$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_1:
# 341 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Scream Tail$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_2:
# 342 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Brute Bonnet$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_3:
# 343 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Flutter Mane$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_4:
# 344 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Slither Wing$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_5:
# 345 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Sandy Shocks$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_6:
# 346 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Roaring Moon$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_7:
# 347 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Walking Wake$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_8:
# 348 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Gouging Fire$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_9:
# 349 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Raging Bolt$"

VictoryRoad_1F_EventScript_EntranceRoom_Text_10:
# 350 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Back$"

VictoryRoad_1F_EventScript_InnerRoom_Text_0:
# 371 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Treads$"

VictoryRoad_1F_EventScript_InnerRoom_Text_1:
# 372 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Bundle$"

VictoryRoad_1F_EventScript_InnerRoom_Text_2:
# 373 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Hands$"

VictoryRoad_1F_EventScript_InnerRoom_Text_3:
# 374 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Jugulis$"

VictoryRoad_1F_EventScript_InnerRoom_Text_4:
# 375 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Moth$"

VictoryRoad_1F_EventScript_InnerRoom_Text_5:
# 376 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Thorns$"

VictoryRoad_1F_EventScript_InnerRoom_Text_6:
# 377 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Valiant$"

VictoryRoad_1F_EventScript_InnerRoom_Text_7:
# 378 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Leaves$"

VictoryRoad_1F_EventScript_InnerRoom_Text_8:
# 379 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Boulder$"

VictoryRoad_1F_EventScript_InnerRoom_Text_9:
# 380 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Iron Crown$"

VictoryRoad_1F_EventScript_StairsRoom_Text_0:
# 402 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Nihilego$"

VictoryRoad_1F_EventScript_StairsRoom_Text_1:
# 403 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Guzzlord$"

VictoryRoad_1F_EventScript_StairsRoom_Text_2:
# 404 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Xurkitree$"

VictoryRoad_1F_EventScript_StairsRoom_Text_3:
# 405 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Buzzwole$"

VictoryRoad_1F_EventScript_StairsRoom_Text_4:
# 406 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Blacephalon$"

VictoryRoad_1F_EventScript_StairsRoom_Text_5:
# 407 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Stakataka$"

VictoryRoad_1F_EventScript_StairsRoom_Text_6:
# 408 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Poipole$"

VictoryRoad_1F_EventScript_StairsRoom_Text_7:
# 409 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Pheromosa$"

VictoryRoad_1F_EventScript_StairsRoom_Text_8:
# 410 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Celesteela$"

VictoryRoad_1F_Text_SummonerIntro::
# 461 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Hello, young trainer.\p"
	.string "I've come to this remote location\n"
	.string "because I have learned a powerful\l"
	.string "technique that allows me to summon one\l"
	.string "Pokémon from a remote location.\p"
	.string "Would you like me to summon a Pokémon\n"
	.string "here so you can battle it?$"

VictoryRoad_1F_Text_SummonerIntroQuick::
# 471 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Would you like me to summon a Pokémon\n"
	.string "here so you can battle it?$"

VictoryRoad_1F_Text_WhichRoom::
# 476 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Which room would you like me to summon a\n"
	.string "Pokémon from?$"

VictoryRoad_1F_Text_WhichPokemon::
# 481 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Which Pokémon would you like me to\n"
	.string "summon so you can battle?$"

VictoryRoad_1F_Text_ConfirmSummon::
# 486 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "So you want me to summon a\n"
	.string "{STR_VAR_1} for you to battle?$"

VictoryRoad_1F_Text_VeryWell::
# 491 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "Very well, prepare yourself for battle.$"

VictoryRoad_1F_SummonWomanDeclined::
# 495 "data/maps/VictoryRoad_1F/scripts.pory"
	.string "I see. Let me know if you change\n"
	.string "your mind.$"
