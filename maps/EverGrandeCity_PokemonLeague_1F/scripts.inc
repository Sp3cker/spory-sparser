# 1 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 2 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
.set LOCALID_NURSE, 1
# 3 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
.set LOCALID_GUARD_1, 3
# 4 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
.set LOCALID_GUARD_2, 4
# 5 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
.set LOCALID_EGG_TUTOR, 6
# 6 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 7 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_MapScripts::
# 8 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, EverGrandeCity_PokemonLeague_1F_OnTransition
# 9 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	map_script MAP_SCRIPT_ON_RESUME, CableClub_OnResume
# 10 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.byte 0
# 11 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 12 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_OnTransition:
# 13 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	setrespawn HEAL_LOCATION_EVER_GRANDE_CITY_POKEMON_LEAGUE
# 14 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	setflag FLAG_LANDMARK_POKEMON_LEAGUE
# 15 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	call_if_unset FLAG_ENTERED_ELITE_FOUR, EverGrandeCity_PokemonLeague_1F_EventScript_GuardsBlockDoor
# 16 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	end
# 17 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 18 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_GuardsBlockDoor::
# 19 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	setobjectxyperm LOCALID_GUARD_1, 9, 2
# 20 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	setobjectxyperm LOCALID_GUARD_2, 10, 2
# 21 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	return
# 22 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 23 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_Nurse::
# 24 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	setvar VAR_0x800B, LOCALID_NURSE
# 25 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	call Common_EventScript_PkmnCenterNurse
# 26 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmessage
# 27 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitbuttonpress
# 28 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	release
# 29 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	end
# 30 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 31 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_Clerk::
# 32 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	lock
# 33 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	faceplayer
# 34 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	message gText_HowMayIServeYou
# 35 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmessage
# 36 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	pokemart EverGrandeCity_PokemonLeague_1F_Pokemart
# 37 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	msgbox gText_PleaseComeAgain, MSGBOX_DEFAULT
# 38 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	release
# 39 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	end
# 40 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 41 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.align 2
# 42 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Pokemart:
# 43 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_ULTRA_BALL
# 44 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_HYPER_POTION
# 45 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_MAX_POTION
# 46 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_FULL_RESTORE
# 47 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_FULL_HEAL
# 48 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_MAX_ELIXIR
# 49 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_ELIXIR
# 50 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_REVIVE
# 51 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_MAX_REPEL
# 52 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.2byte ITEM_NONE
# 53 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	release
# 54 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	end
# 55 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 56 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
@ The door guards only check for FLAG_BADGE06_GET because Winonas badge is the only one that can be skipped
# 57 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
@ Its assumed the player has the remaining badges
# 58 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_DoorGuard::
# 59 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	lockall
# 60 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	goto_if_set FLAG_ENTERED_ELITE_FOUR, EverGrandeCity_PokemonLeague_1F_EventScript_GoForth
# 61 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	getplayerxy VAR_TEMP_0, VAR_TEMP_1
# 62 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	call_if_ge VAR_TEMP_0, 11, EverGrandeCity_PokemonLeague_1F_EventScript_PlayerMoveToFrontFromRight
# 63 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	call_if_le VAR_TEMP_0, 8, EverGrandeCity_PokemonLeague_1F_EventScript_PlayerMoveToFrontFromLeft
# 64 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	message EverGrandeCity_PokemonLeague_1F_Text_MustHaveAllGymBadges
# 65 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmessage
# 66 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	delay 120
# 67 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	goto_if_unset FLAG_BADGE06_GET, EverGrandeCity_PokemonLeague_1F_EventScript_NotAllBadges
# 68 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	closemessage
# 69 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	applymovement LOCALID_GUARD_1, EverGrandeCity_PokemonLeague_1F_Movement_LeftGuardOutOfWay
# 70 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	applymovement LOCALID_GUARD_2, EverGrandeCity_PokemonLeague_1F_Movement_RightGuardOutOfWay
# 71 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmovement 0
# 72 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	delay 10
# 73 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	playfanfare MUS_OBTAIN_BADGE
# 74 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	message EverGrandeCity_PokemonLeague_1F_Text_GoForth
# 75 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmessage
# 76 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitfanfare
# 77 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	closemessage
# 78 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	copyobjectxytoperm LOCALID_GUARD_1
# 79 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	copyobjectxytoperm LOCALID_GUARD_2
# 80 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	setflag FLAG_ENTERED_ELITE_FOUR
# 81 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	releaseall
# 82 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	end
# 83 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 84 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_PlayerMoveToFrontFromRight::
# 85 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, EverGrandeCity_PokemonLeague_1F_Movement_MoveToFrontFromRight
# 86 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmovement 0
# 87 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	return
# 88 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 89 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_PlayerMoveToFrontFromLeft::
# 90 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	applymovement OBJ_EVENT_ID_PLAYER, EverGrandeCity_PokemonLeague_1F_Movement_MoveToFrontFromLeft
# 91 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmovement 0
# 92 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	return
# 93 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 94 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_NotAllBadges::
# 95 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	playse SE_FAILURE
# 96 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	msgbox EverGrandeCity_PokemonLeague_1F_Text_HaventObtainedAllBadges, MSGBOX_DEFAULT
# 97 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	releaseall
# 98 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	end
# 99 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 100 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_GoForth::
# 101 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	applymovement VAR_LAST_TALKED, Common_Movement_FacePlayer
# 102 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmovement 0
# 103 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	msgbox EverGrandeCity_PokemonLeague_1F_Text_GoForth, MSGBOX_DEFAULT
# 104 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	closemessage
# 105 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	applymovement VAR_LAST_TALKED, Common_Movement_FaceOriginalDirection
# 106 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	waitmovement 0
# 107 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	releaseall
# 108 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	end
# 109 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 110 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Movement_MoveToFrontFromRight:
# 111 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_down
# 112 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_left
# 113 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_in_place_faster_up
# 114 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	step_end
# 115 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 116 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Movement_MoveToFrontFromLeft:
# 117 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_down
# 118 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_right
# 119 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_in_place_faster_up
# 120 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	step_end
# 121 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 122 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Movement_LeftGuardOutOfWay:
# 123 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_left
# 124 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_in_place_faster_down
# 125 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	step_end
# 126 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 127 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Movement_RightGuardOutOfWay:
# 128 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_right
# 129 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	walk_in_place_faster_down
# 130 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	step_end
# 131 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 132 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_EventScript_WomanTrolling::
# 133 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	msgbox EverGrandeCity_PokemonLeague_1F_Text_Trolling, MSGBOX_NPC
# 134 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	end
# 135 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 136 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Text_Trolling:
# 137 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "Oh hey, are you here to take on the\n"
# 138 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "Pokémon League?\p"
# 139 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "Well today I saw Sidney with a Galarian\n"
# 140 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "Moltres.\p"
# 141 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "What, you want to know more than that?\p"
# 142 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "What am I, an NPC written by the\n"
# 143 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "creator of this game who knows exactly\l"
# 144 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "which team will be there? Sheesh.$"
# 145 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 146 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Text_MustHaveAllGymBadges:
# 147 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "Beyond this point, only those trainers\n"
# 148 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "who have collected all the Gym Badges\l"
# 149 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "are permitted to enter.\p"
# 150 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "Trainer, let us confirm that you have\n"
# 151 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "all the Gym Badges.$"
# 152 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 153 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Text_HaventObtainedAllBadges:
# 154 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "You haven't obtained all the Badges.\p"
# 155 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "If you're bound for the Pokémon\n"
# 156 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "League, you must return with them.$"
# 157 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"

# 158 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
EverGrandeCity_PokemonLeague_1F_Text_GoForth:
# 159 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "Trainer! Believe in yourself and your\n"
# 160 "data/maps/EverGrandeCity_PokemonLeague_1F/scripts.pory"
	.string "Pokémon, and go forth!$"
