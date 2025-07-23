# 1 "data/maps/FieryPath_BackRoom/scripts.pory"

# 2 "data/maps/FieryPath_BackRoom/scripts.pory"
FieryPath_BackRoom_MapScripts::
# 3 "data/maps/FieryPath_BackRoom/scripts.pory"
	map_script MAP_SCRIPT_ON_RESUME, FieryPath_BackRoom_OnResume
# 4 "data/maps/FieryPath_BackRoom/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, FieryPath_BackRoom_OnTransition
# 5 "data/maps/FieryPath_BackRoom/scripts.pory"
	.byte 0
# 6 "data/maps/FieryPath_BackRoom/scripts.pory"

# 7 "data/maps/FieryPath_BackRoom/scripts.pory"
FieryPath_BackRoom_OnResume:
# 8 "data/maps/FieryPath_BackRoom/scripts.pory"
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, FieryPath_BackRoom_EventScript_TryRemoveHeatran
# 9 "data/maps/FieryPath_BackRoom/scripts.pory"
	end
# 10 "data/maps/FieryPath_BackRoom/scripts.pory"

# 11 "data/maps/FieryPath_BackRoom/scripts.pory"
FieryPath_BackRoom_EventScript_TryRemoveHeatran::
# 12 "data/maps/FieryPath_BackRoom/scripts.pory"
	specialvar VAR_RESULT, GetBattleOutcome
# 13 "data/maps/FieryPath_BackRoom/scripts.pory"
	goto_if_ne VAR_RESULT, B_OUTCOME_CAUGHT, Common_EventScript_NopReturn
# 14 "data/maps/FieryPath_BackRoom/scripts.pory"
	removeobject VAR_LAST_TALKED
# 15 "data/maps/FieryPath_BackRoom/scripts.pory"
	return
# 16 "data/maps/FieryPath_BackRoom/scripts.pory"

# 17 "data/maps/FieryPath_BackRoom/scripts.pory"
FieryPath_BackRoom_OnTransition:
# 18 "data/maps/FieryPath_BackRoom/scripts.pory"
	call_if_unset FLAG_DEFEATED_HEATRAN, FieryPath_BackRoom_EventScript_ShowHeatran
# 19 "data/maps/FieryPath_BackRoom/scripts.pory"
	end
# 20 "data/maps/FieryPath_BackRoom/scripts.pory"

# 21 "data/maps/FieryPath_BackRoom/scripts.pory"
FieryPath_BackRoom_EventScript_ShowHeatran::
# 22 "data/maps/FieryPath_BackRoom/scripts.pory"
	clearflag FLAG_HIDE_HEATRAN
# 23 "data/maps/FieryPath_BackRoom/scripts.pory"
	return
# 24 "data/maps/FieryPath_BackRoom/scripts.pory"

# 25 "data/maps/FieryPath_BackRoom/scripts.pory"
FieryPath_BackRoom_EventScript_Heatran::
# 26 "data/maps/FieryPath_BackRoom/scripts.pory"
	lock
# 27 "data/maps/FieryPath_BackRoom/scripts.pory"
	faceplayer
# 28 "data/maps/FieryPath_BackRoom/scripts.pory"
	waitse
# 29 "data/maps/FieryPath_BackRoom/scripts.pory"
	playmoncry SPECIES_HEATRAN, CRY_MODE_ENCOUNTER
# 30 "data/maps/FieryPath_BackRoom/scripts.pory"
	delay 40
# 31 "data/maps/FieryPath_BackRoom/scripts.pory"
	waitmoncry
# 32 "data/maps/FieryPath_BackRoom/scripts.pory"
	setwildbattle SPECIES_HEATRAN, 70
# 33 "data/maps/FieryPath_BackRoom/scripts.pory"
	setflag FLAG_SYS_CTRL_OBJ_DELETE
# 34 "data/maps/FieryPath_BackRoom/scripts.pory"
	special StartRegiBattle
# 35 "data/maps/FieryPath_BackRoom/scripts.pory"
	waitstate
# 36 "data/maps/FieryPath_BackRoom/scripts.pory"
	clearflag FLAG_SYS_CTRL_OBJ_DELETE
# 37 "data/maps/FieryPath_BackRoom/scripts.pory"
	specialvar VAR_RESULT, GetBattleOutcome
# 38 "data/maps/FieryPath_BackRoom/scripts.pory"
	goto_if_eq VAR_RESULT, B_OUTCOME_WON, FieryPath_BackRoom_EventScript_DefeatedHeatran
# 39 "data/maps/FieryPath_BackRoom/scripts.pory"
	goto_if_eq VAR_RESULT, B_OUTCOME_RAN, FieryPath_BackRoom_EventScript_RanFromHeatran
# 40 "data/maps/FieryPath_BackRoom/scripts.pory"
	goto_if_eq VAR_RESULT, B_OUTCOME_PLAYER_TELEPORTED, FieryPath_BackRoom_EventScript_RanFromHeatran
# 41 "data/maps/FieryPath_BackRoom/scripts.pory"
	setflag FLAG_DEFEATED_HEATRAN
# 42 "data/maps/FieryPath_BackRoom/scripts.pory"
	release
# 43 "data/maps/FieryPath_BackRoom/scripts.pory"
	end
# 44 "data/maps/FieryPath_BackRoom/scripts.pory"

# 45 "data/maps/FieryPath_BackRoom/scripts.pory"
FieryPath_BackRoom_EventScript_DefeatedHeatran::
# 46 "data/maps/FieryPath_BackRoom/scripts.pory"
	setflag FLAG_DEFEATED_HEATRAN
# 47 "data/maps/FieryPath_BackRoom/scripts.pory"
	goto Common_EventScript_RemoveStaticPokemon
# 48 "data/maps/FieryPath_BackRoom/scripts.pory"
	end
# 49 "data/maps/FieryPath_BackRoom/scripts.pory"

# 50 "data/maps/FieryPath_BackRoom/scripts.pory"
FieryPath_BackRoom_EventScript_RanFromHeatran::
# 51 "data/maps/FieryPath_BackRoom/scripts.pory"
	setvar VAR_0x8004, SPECIES_HEATRAN
# 52 "data/maps/FieryPath_BackRoom/scripts.pory"
	goto Common_EventScript_LegendaryFlewAway
# 53 "data/maps/FieryPath_BackRoom/scripts.pory"
	end
