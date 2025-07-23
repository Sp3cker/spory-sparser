# 1 "data/maps/FieryPath/scripts.pory"

# 2 "data/maps/FieryPath/scripts.pory"
FieryPath_MapScripts::
# 3 "data/maps/FieryPath/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, FieryPath_OnTransition
# 4 "data/maps/FieryPath/scripts.pory"
	.byte 0
# 5 "data/maps/FieryPath/scripts.pory"

# 6 "data/maps/FieryPath/scripts.pory"
FieryPath_OnTransition:
# 7 "data/maps/FieryPath/scripts.pory"
	call_if_unset FLAG_LANDMARK_FIERY_PATH, FieryPath_EventScript_MoveScottToFallarbor
# 8 "data/maps/FieryPath/scripts.pory"
	setflag FLAG_LANDMARK_FIERY_PATH
# 9 "data/maps/FieryPath/scripts.pory"
	setflag FLAG_VISITED_FIERY_PATH
# 10 "data/maps/FieryPath/scripts.pory"
	end
# 11 "data/maps/FieryPath/scripts.pory"

# 12 "data/maps/FieryPath/scripts.pory"
FieryPath_EventScript_MoveScottToFallarbor::
# 13 "data/maps/FieryPath/scripts.pory"
	setflag FLAG_HIDE_VERDANTURF_TOWN_SCOTT
# 14 "data/maps/FieryPath/scripts.pory"
	clearflag FLAG_HIDE_FALLARBOR_TOWN_BATTLE_TENT_SCOTT
# 15 "data/maps/FieryPath/scripts.pory"
	return
# 16 "data/maps/FieryPath/scripts.pory"

# 17 "data/maps/FieryPath/scripts.pory"
FieryPath_EventScript_Scientist::
# 18 "data/maps/FieryPath/scripts.pory"
	msgbox FieryPath_Text_BlockedOff, MSGBOX_NPC
# 19 "data/maps/FieryPath/scripts.pory"
	end
# 20 "data/maps/FieryPath/scripts.pory"

# 21 "data/maps/FieryPath/scripts.pory"
FieryPath_Text_BlockedOff:
# 22 "data/maps/FieryPath/scripts.pory"
	.string "There's been an uptick in seismic\n"
# 23 "data/maps/FieryPath/scripts.pory"
	.string "activity in this area, so I'm conducting\l"
# 24 "data/maps/FieryPath/scripts.pory"
	.string "some important research.\p"
# 25 "data/maps/FieryPath/scripts.pory"
	.string "Please don't bother me while I'm\n"
# 26 "data/maps/FieryPath/scripts.pory"
	.string "working, and make sure you walk\l"
# 27 "data/maps/FieryPath/scripts.pory"
	.string "very carefully while you're here in\l"
# 28 "data/maps/FieryPath/scripts.pory"
	.string "Fiery Path so you don't interfere with\l"
# 29 "data/maps/FieryPath/scripts.pory"
	.string "my data!$"
