# 1 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 2 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
.set LOCALID_NURSE, 1
# 3 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 4 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_MapScripts::
# 5 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, PacifidlogTown_PokemonCenter_1F_OnTransition
# 6 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	map_script MAP_SCRIPT_ON_RESUME, CableClub_OnResume
# 7 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.byte 0
# 8 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 9 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_OnTransition:
# 10 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	setrespawn HEAL_LOCATION_PACIFIDLOG_TOWN
# 11 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	end
# 12 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 13 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_EventScript_Nurse::
# 14 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	setvar VAR_0x800B, LOCALID_NURSE
# 15 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	call Common_EventScript_PkmnCenterNurse
# 16 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	waitmessage
# 17 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	waitbuttonpress
# 18 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	release
# 19 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	end
# 20 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 21 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_EventScript_Girl::
# 22 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	msgbox PacifidlogTown_PokemonCenter_1F_Text_WhatColorTrainerCard, MSGBOX_NPC
# 23 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	end
# 24 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 25 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_EventScript_Woman::
# 26 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	msgbox PacifidlogTown_PokemonCenter_1F_Text_OnColonyOfCorsola, MSGBOX_NPC
# 27 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	end
# 28 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 29 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_EventScript_OldMan::
# 30 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	msgbox PacifidlogTown_PokemonCenter_1F_Text_AncestorsLivedOnBoats, MSGBOX_NPC
# 31 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	end
# 32 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 33 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_EventScript_FormerExplosionTutor::
# 34 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	lockall
# 35 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	faceplayer
# 36 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	msgbox PacifidlogTown_PokemonCenter_1F_Text_FormerExplosionTutor, MSGBOX_DEFAULT
# 37 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	releaseall
# 38 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	end
# 39 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 40 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_Text_FormerExplosionTutor:
# 41 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "I used to be able to cause huge\n"
# 42 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "explosions… Oh, what happened?$"
# 43 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 44 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_Text_WhatColorTrainerCard:
# 45 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "What color is your TRAINER CARD?\n"
# 46 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "Mine's copper!$"
# 47 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 48 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_Text_OnColonyOfCorsola:
# 49 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "PACIFIDLOG TOWN floats on top of\n"
# 50 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "a colony of CORSOLA.\p"
# 51 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "If I told you that, would you believe\n"
# 52 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "me?$"
# 53 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"

# 54 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
PacifidlogTown_PokemonCenter_1F_Text_AncestorsLivedOnBoats:
# 55 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "The ancestors of the people in\n"
# 56 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "PACIFIDLOG were said to have been\l"
# 57 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "born on boats and then lived and died \l"
# 58 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "aboard them.\p"
# 59 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "I understand that they lived that way\n"
# 60 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "because they were searching for\l"
# 61 "data/maps/PacifidlogTown_PokemonCenter_1F/scripts.pory"
	.string "something.$"
